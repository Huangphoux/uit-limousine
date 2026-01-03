import React, { useEffect, useState } from "react";
import { Card, Button, Form } from "react-bootstrap";
import { BsCloudUpload, BsDownload, BsFileEarmarkText, BsTrophy, BsTag } from "react-icons/bs";
import "./CourseContent.css";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;

const AssignmentSubmissionUI = ({ lesson, onMarkAsFinished, isCompleted }) => {
  console.log("=== AssignmentSubmissionUI ===");
  console.log("Lesson data:", lesson);
  console.log("Assignment:", lesson?.assignment);
  console.log("Assignment Description:", lesson?.assignment?.description);
  console.log("Assignment Title:", lesson?.assignment?.title);
  console.log("Is Completed:", isCompleted);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [content, setContent] = useState("");
  const token = localStorage.getItem("accessToken"); // Assuming token is stored in localStorage

  // Assignment due date & lock state
  const dueDate = lesson?.assignment?.dueDate ? new Date(lesson.assignment.dueDate) : null;
  const now = new Date();
  const submissionClosed = dueDate ? dueDate < now : false;

  const formatDueDate = (d) => {
    if (!d) return null;
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Reset state when lesson changes
  useEffect(() => {
    console.log("Lesson changed, resetting state for lesson:", lesson?.id);
    setIsSubmitted(false);
    setSubmissionResult(null);
    setSelectedFiles([]);
    setContent("");
    setError(null);
  }, [lesson?.id]); // Reset when lesson ID changes

  // Load submission data if exists
  useEffect(() => {
    if (lesson?.submission) {
      setIsSubmitted(true);
      setSubmissionResult({
        files: lesson.submission.fileUrl
          ? [
              {
                name: lesson.submission.fileUrl.split("/").pop(),
                url: lesson.submission.fileUrl,
              },
            ]
          : [],
        score: lesson.submission.grade,
        maxScore: lesson.assignment?.maxScore || 100,
        percentage: lesson.submission.grade
          ? Math.round((lesson.submission.grade / (lesson.assignment?.maxScore || 100)) * 100)
          : 0,
        status: lesson.submission.status,
        scorer: lesson.submission.gradedBy?.name || "Pending",
        date: lesson.submission.submittedAt
          ? new Date(lesson.submission.submittedAt).toLocaleString("en-GB")
          : "N/A",
        content: lesson.submission.content,
        feedback: lesson.submission.feedback || null,
      });
    }
  }, [lesson]);

  // Fetch submission status function
  const fetchSubmissionStatus = async () => {
    if (!lesson?.assignment?.id || !token) return;

    try {
      const response = await fetch(
        `${API_URL}/courses/assignments/${lesson.assignment.id}/submission`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          // Đã có submission
          setIsSubmitted(true);
          setSubmissionResult({
            files: data.data.fileUrl
              ? [
                  {
                    name: data.data.fileUrl.split("/").pop(),
                    url: data.data.fileUrl,
                  },
                ]
              : [],
            score: data.data.grade,
            maxScore: lesson.assignment?.maxScore || 100,
            percentage: data.data.grade
              ? Math.round((data.data.grade / (lesson.assignment?.maxScore || 100)) * 100)
              : 0,
            status: data.data.status,
            scorer: data.data.gradedBy?.name || "Pending Review",
            date: data.data.submittedAt
              ? new Date(data.data.submittedAt).toLocaleString("en-GB")
              : "N/A",
            content: data.data.content,
            feedback: data.data.feedback || null,
          });
        }
      }
    } catch (err) {
      console.error("Error fetching submission status:", err);
    }
  };

  // Fetch submission status on component mount / when assignmentId changes
  useEffect(() => {
    fetchSubmissionStatus();
  }, [lesson?.assignment?.id, token]);
  const handleFileSelect = (event) => {
    setSelectedFiles([...event.target.files]);
    setError(null);
  };

  // Upload file to server/cloud storage and get URL
  const uploadFile = async (file) => {
    console.log(file);

    // const formData = new FormData();
    // formData.append("file", file);
    // try {
    //   const response = await fetch("/api/upload", {
    //     method: "POST",
    //     body: formData,
    //     headers: { Authorization: `Bearer ${token}` },
    //   });
    //   if (!response.ok) {
    //     throw new Error("File upload failed");
    //   }
    //   const data = await response.json();
    //   return data.fileUrl; // Assuming API returns { fileUrl: "..." }
    // } catch (err) {
    //   console.error("File upload error:", err);
    //   throw err;
    // }
  };

  const handleSubmit = async () => {
    console.log("[handleSubmit] Starting submission...");
    console.log("[handleSubmit] Assignment ID:", lesson?.assignment?.id);
    console.log("[handleSubmit] Content:", content);
    console.log("[handleSubmit] Selected files:", selectedFiles);

    if (submissionClosed && !isSubmitted) {
      setError("Submission deadline has passed");
      toast.error("Submission deadline has passed");
      console.log("[handleSubmit] Error: deadline passed");
      return;
    }

    if (selectedFiles.length === 0 && !content.trim()) {
      setError("Please provide either content or upload a file");
      console.log("[handleSubmit] Error: No content or file provided");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      let fileUrl = null;

      console.log("[handleSubmit] Calling API to submit assignment...");

      let response;
      // If a file is selected, use multipart/form-data with field name 'file'
      if (selectedFiles.length > 0) {
        const fd = new FormData();
        fd.append("file", selectedFiles[0]);
        if (content.trim()) fd.append("content", content.trim());

        response = await fetch(`${API_URL}/courses/assignments/${lesson.assignment?.id}/submit`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: fd,
        });
      } else {
        // No file: send JSON body
        response = await fetch(`${API_URL}/courses/assignments/${lesson.assignment?.id}/submit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            assignmentId: lesson.assignment?.id,
            content: content.trim() || null,
          }),
        });
      }

      console.log("[handleSubmit] API response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.log("[handleSubmit] API error:", errorData);
        throw new Error(errorData.message || "Submission failed");
      }

      const responseData = await response.json().catch(() => ({}));
      console.log("[handleSubmit] API response data:", responseData);

      // Extract submission DTO returned by server
      const sub = responseData?.data || responseData || {};

      // Build files array for UI
      const files = sub.fileUrl
        ? [
            {
              name: sub.fileName || selectedFiles[0]?.name || "Submission file",
              size: sub.fileSize
                ? `${Math.round(sub.fileSize / 1024)} KB`
                : selectedFiles[0]
                  ? `${Math.round(selectedFiles[0].size / 1024)} KB`
                  : "N/A",
              url: sub.fileUrl,
            },
          ]
        : [];

      const result = {
        files,
        score: sub?.grade || null,
        maxScore: lesson.assignment?.maxScore || 100,
        percentage: sub?.grade
          ? Math.round((sub.grade / (lesson.assignment?.maxScore || 100)) * 100)
          : 0,
        status: sub?.status || "Pending",
        scorer: sub?.gradedBy?.name || "Pending",
        date: sub?.submittedAt
          ? new Date(sub.submittedAt).toLocaleString("en-GB")
          : new Date().toLocaleString("en-GB"),
        content: sub?.content || content,
        feedback: sub?.feedback || null,
        submissionId: sub?.id,
      };

      console.log("[handleSubmit] Submission successful, result:", result);
      toast.success("Assignment submitted successfully!");
      setSubmissionResult(result);
      setIsSubmitted(true);

      // Clear selected files and content input
      setSelectedFiles([]);
      setContent("");

      // Refresh submission status so UI reflects persisted submission
      fetchSubmissionStatus();

      // Mark lesson as finished after submission
      if (onMarkAsFinished) {
        console.log("[handleSubmit] Marking lesson as finished...");
        onMarkAsFinished();
      }
    } catch (err) {
      console.error("[handleSubmit] Submission error:", err);
      setError(err.message || "Failed to submit assignment. Please try again.");
      toast.error(err.message || "Failed to submit assignment");
    } finally {
      setIsSubmitting(false);
      console.log("[handleSubmit] Submission process completed");
    }
  };

  return (
    <div className="assignment-submission-container mb-4">
      <div
        className="p-4"
        style={{
          backgroundColor: "#ffffff",
          color: "#000000",
          border: "1px solid #dee2e6",
          borderRadius: "0.5rem",
        }}
      >
        {/* Description Section */}
        <div className="d-flex align-items-start gap-3 mb-4">
          <span style={{ fontSize: "1.5rem" }}>📖</span>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <h2 className="h5 fw-bold mb-2">Description</h2>
              {dueDate && (
                <div
                  style={{ fontSize: "0.9rem", color: submissionClosed ? "#dc2626" : "#0369a1" }}
                >
                  <strong>Due:</strong> {formatDueDate(dueDate)}{" "}
                  {submissionClosed ? "• Closed" : ""}
                </div>
              )}
            </div>

            <p style={{ whiteSpace: "pre-wrap" }}>
              {lesson?.assignment?.description || lesson?.description ? (
                lesson.assignment?.description || lesson.description
              ) : (
                <em style={{ color: "#6c757d" }}>No description provided for this assignment.</em>
              )}
            </p>

            {/* Lesson resources (visible to students) */}
            {lesson?.lessonResources && lesson.lessonResources.length > 0 && (
              <div style={{ marginTop: "0.75rem" }}>
                <h6 className="fw-bold mb-2">Resources</h6>
                <div>
                  {lesson.lessonResources.map((r) => (
                    <div key={r.id || r.fileId} style={{ marginBottom: "0.5rem" }}>
                      {r.id ? (
                        <a
                          href={`${import.meta.env.VITE_API_URL}/lessons/${r.lessonId}/resources/${r.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#0891b2" }}
                        >
                          {r.filename}
                        </a>
                      ) : (
                        <span className="text-muted">{r.filename} (processing)</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Conditional Rendering: Upload Form or Submission Result */}
        {!isSubmitted ? (
          /* Upload Section */
          <div className="mt-4">
            {/* Text Content Input */}
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 className="h6 fw-bold mb-3">Add a note about your submission (Optional):</h3>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter your assignment content here..."
                style={{
                  width: "100%",
                  minHeight: "150px",
                  padding: "0.75rem",
                  border: "4px solid #06b6d4",
                  backgroundColor: "#f8fafc",
                  borderRadius: "0.375rem",
                  color: "#000000",
                  fontSize: "0.95rem",
                  fontFamily: "inherit",
                  resize: "vertical",
                  outline: "none",
                }}
              />
            </div>

            {/* File Upload Section */}
            <h3 className="h6 fw-bold mb-3">Upload your file here (Optional):</h3>

            <div
              className="rounded-3 p-5 text-center"
              style={{ border: "4px solid #06b6d4", cursor: "pointer" }}
              onClick={() => document.getElementById("file-upload").click()}
            >
              <input
                type="file"
                multiple={false}
                onChange={handleFileSelect}
                className="d-none"
                id="file-upload"
                disabled={isSubmitting || (submissionClosed && !isSubmitted)}
              />
              <div className="d-flex flex-column align-items-center gap-3">
                <span style={{ fontSize: "4rem", color: "#06b6d4" }}>☁️</span>
                <button
                  type="button"
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: isSubmitting ? "#94a3b8" : "#06b6d4",
                    border: "none",
                    color: "white",
                    fontWeight: "bold",
                    padding: "0.5rem 1.5rem",
                    borderRadius: "0.375rem",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                  }}
                >
                  Choose file
                </button>
                <p className="text-black mb-0">Or drag'n drop file here</p>
                <p className="small text-black">Maximum size: 100MB</p>
              </div>
            </div>

            {selectedFiles.length > 0 && (
              <div className="mt-4">
                <p className="small fw-medium mb-2">Selected file:</p>
                <div
                  style={{
                    padding: "0.75rem",
                    backgroundColor: "#f1f5f9",
                    borderRadius: "0.375rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span>📎</span>
                  <span className="small text-black">{selectedFiles[0].name}</span>
                  <span className="small text-black" style={{ marginLeft: "auto" }}>
                    {Math.round(selectedFiles[0].size / 1024)} KB
                  </span>
                </div>
              </div>
            )}

            {/* If submission closed and not submitted, show notice and hide upload controls */}
            {submissionClosed && !isSubmitted && (
              <div
                style={{
                  marginTop: "1rem",
                  padding: "1rem",
                  background: "#fff7ed",
                  border: "1px solid #fed7aa",
                  borderRadius: 6,
                }}
              >
                <strong style={{ color: "#92400e" }}>Submission closed:</strong> The deadline has
                passed and new submissions are not accepted.
              </div>
            )}

            <button
              type="button"
              style={{
                backgroundColor: isSubmitting ? "#94a3b8" : "#22c55e",
                border: "none",
                fontSize: "1.1rem",
                padding: "0.75rem",
                width: "100%",
                marginTop: "1rem",
                borderRadius: "0.375rem",
                color: "white",
                fontWeight: "600",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
              onClick={handleSubmit}
              disabled={
                isSubmitting ||
                (selectedFiles.length === 0 && !content.trim()) ||
                (submissionClosed && !isSubmitted)
              }
            >
              {isSubmitting ? (
                <>
                  <span
                    style={{
                      display: "inline-block",
                      width: "1rem",
                      height: "1rem",
                      border: "2px solid white",
                      borderTopColor: "transparent",
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                    }}
                  ></span>
                  Submitting...
                </>
              ) : (
                <>
                  <span className="fs-5">✓</span>
                  Submit Assignment
                </>
              )}
            </button>
          </div>
        ) : (
          /* Submission Result Section */
          <div className="mt-4">
            {/* Show submitted content if exists */}
            {submissionResult?.content && (
              <div style={{ marginBottom: "1.5rem" }}>
                <h3 className="h6 fw-bold mb-2">Submitted Content:</h3>
                <div
                  style={{
                    padding: "1rem",
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "0.375rem",
                    whiteSpace: "pre-wrap",
                    fontSize: "0.95rem",
                  }}
                >
                  {submissionResult.content}
                </div>
              </div>
            )}

            {/* Uploaded Files */}
            {submissionResult?.files && submissionResult.files.length > 0 && (
              <div className="mb-4">
                <p className="text-black mb-3">Uploaded file ({submissionResult.files.length})</p>

                {submissionResult.files.map((file, index) => (
                  <div
                    key={index}
                    className="d-flex align-items-center justify-content-between p-3 mb-2 rounded-3"
                    style={{ backgroundColor: "#e0f2fe", border: "1px solid #bae6fd" }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <span style={{ fontSize: "2rem", color: "#0891b2" }}>📄</span>
                      <div>
                        <p className="fw-bold mb-0" style={{ color: "#000" }}>
                          {file.name}
                        </p>
                        {file.size && <p className="small text-black mb-0">{file.size}</p>}
                      </div>
                    </div>
                    {file.url && (
                      <a
                        href={file.url}
                        download
                        style={{
                          background: "none",
                          border: "none",
                          color: "#0891b2",
                          padding: 0,
                          cursor: "pointer",
                          textDecoration: "none",
                        }}
                      >
                        <span style={{ fontSize: "1.5rem" }}>⬇️</span>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Score Card - Only show if graded */}
            {submissionResult?.score !== null && submissionResult?.score !== undefined ? (
              <div className="rounded-3" style={{ overflow: "hidden" }}>
                <div
                  className="d-flex align-items-center justify-content-between p-4"
                  style={{ backgroundColor: "#fef3c7", border: "1px solid #fde68a" }}
                >
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span style={{ fontSize: "1.5rem", color: "#dc2626" }}>🏷️</span>
                      <span className="fw-bold" style={{ fontSize: "1.25rem", color: "#dc2626" }}>
                        Your final score: {submissionResult.score} / {submissionResult.maxScore} (
                        {submissionResult.percentage}%)
                      </span>
                    </div>
                    <p className="mb-1 ms-4" style={{ color: "#374151" }}>
                      Scorer: {submissionResult.scorer}
                    </p>
                    <p className="mb-0 ms-4" style={{ color: "#374151" }}>
                      Date: {submissionResult.date}
                    </p>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span style={{ fontSize: "2rem" }}>🏆</span>
                    <span
                      className="fw-bold"
                      style={{
                        fontSize: "1.5rem",
                        color: submissionResult.percentage >= 50 ? "#16a34a" : "#dc2626",
                      }}
                    >
                      {submissionResult.percentage >= 50 ? "Pass" : "Fail"}
                    </span>
                  </div>
                </div>

                {/* Feedback Section */}
                {submissionResult?.feedback && (
                  <div
                    className="p-4"
                    style={{
                      backgroundColor: "#f0fdf4",
                      borderTop: "1px solid #bbf7d0",
                      borderLeft: "1px solid #fde68a",
                      borderRight: "1px solid #fde68a",
                      borderBottom: "1px solid #fde68a",
                    }}
                  >
                    <div className="d-flex align-items-start gap-2 mb-2">
                      <span style={{ fontSize: "1.25rem" }}>💬</span>
                      <h3 className="h6 fw-bold mb-0">Instructor Feedback:</h3>
                    </div>
                    <p
                      className="ms-4 mb-0"
                      style={{
                        whiteSpace: "pre-wrap",
                        color: "#166534",
                        fontSize: "0.95rem",
                      }}
                    >
                      {submissionResult.feedback}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* Pending Review */
              <div
                style={{
                  padding: "1.5rem",
                  backgroundColor: "#f1f5f9",
                  border: "1px solid #cbd5e1",
                  borderRadius: "0.375rem",
                  textAlign: "center",
                }}
              >
                <span style={{ fontSize: "2rem", marginBottom: "0.5rem", display: "block" }}>
                  ⏳
                </span>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "0.5rem" }}>
                  Submission Received
                </h3>
                <p style={{ color: "#64748b", marginBottom: 0 }}>
                  Your assignment is pending review by the instructor.
                  <br />
                  Submitted on: {submissionResult?.date}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Lesson Actions - Mark as Finished */}
        <div className="lesson-actions mt-4">
          {isCompleted ? (
            <Button className="unmark-btn" onClick={onMarkAsFinished}>
              ✕ Unmark
            </Button>
          ) : (
            <Button className="mark-finished-btn" onClick={onMarkAsFinished}>
              ✓ Mark as finished
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentSubmissionUI;
