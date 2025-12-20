import React, { useEffect, useState } from "react";
import { Card, Button, Form } from "react-bootstrap";
import { BsCloudUpload, BsDownload, BsFileEarmarkText, BsTrophy, BsTag } from "react-icons/bs";
import "./CourseContent.css";
import { toast } from "sonner";

const AssignmentSubmissionUI = ({ lesson, onMarkAsFinished }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [content, setContent] = useState("");
  const token = localStorage.getItem("accessToken"); // Assuming token is stored in localStorage
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
      });
    }
  }, [lesson]);

  // Fetch submission status on component mount
  useEffect(() => {
    const fetchSubmissionStatus = async () => {
      if (!lesson?.assignment?.id || !token) return;

      try {
        const response = await fetch(
          `http://localhost:3000/courses/assignments/${lesson.assignment.id}/submission`,
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
              scorer: "Pending Review", // Hoặc data.data.gradedBy nếu có
              date: data.data.submittedAt
                ? new Date(data.data.submittedAt).toLocaleString("en-GB")
                : "N/A",
              content: data.data.content,
            });
          }
        }
      } catch (err) {
        console.error("Error fetching submission status:", err);
      }
    };

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
    // if (!studentId) {
    //   setError("Student ID is required");
    //   return;
    // }

    if (selectedFiles.length === 0 && !content.trim()) {
      setError("Please provide either content or upload a file");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      let fileUrl = null;

      // Upload file if selected
      if (selectedFiles.length > 0) {
        // For multiple files, you might want to upload all and concatenate URLs
        // For now, uploading the first file
        fileUrl = await uploadFile(selectedFiles[0]);
      }

      // Submit assignment to API
      const response = await fetch(
        `http://localhost:3000/courses/assignments/${lesson.assignment?.id}/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            assignmentId: lesson.assignment?.id,
            content: content.trim() || null,
            fileUrl: "Link: https://github.com/learner1/todo-app", // Replace with actual fileUrl
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Submission failed");
      }

      const responseData = await response.json();

      // Format submission result from API response
      const now = new Date();
      const formattedDate = now.toLocaleString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      const result = {
        files: fileUrl
          ? [
              {
                name: selectedFiles[0].name,
                size: `${Math.round(selectedFiles[0].size / 1024)} KB`,
                url: fileUrl,
              },
            ]
          : [],
        score: responseData.data?.grade || null,
        maxScore: lesson.assignment?.maxScore || 100,
        percentage: responseData.data?.score
          ? Math.round((responseData.data.score / (lesson.assignment?.maxScore || 100)) * 100)
          : 0,
        status: responseData.data?.status || "Pending",
        scorer: responseData.data?.gradedBy?.name || "Pending Review",
        date: formattedDate,
        content: content,
        submissionId: responseData.data?.id,
      };
      toast.success("Assignment submitted successfully!");
      setSubmissionResult(result);
      setIsSubmitted(true);

      // Mark lesson as finished after submission
      if (onMarkAsFinished) {
        onMarkAsFinished();
      }
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.message || "Failed to submit assignment. Please try again.");
    } finally {
      setIsSubmitting(false);
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
            <h2 className="h5 fw-bold mb-2">Description</h2>
            <p>
              {lesson?.assignment.description ||
                "The user input a number n. Write a program to calculate the sum of 1 to n. If n is lower than 1, return error."}
            </p>
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
                disabled={isSubmitting}
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
              disabled={isSubmitting || (selectedFiles.length === 0 && !content.trim())}
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
              <div
                className="d-flex align-items-center justify-content-between p-4 rounded-3"
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
                      color: submissionResult.percentage >= 60 ? "#16a34a" : "#dc2626",
                    }}
                  >
                    {submissionResult.percentage >= 60 ? "Pass" : "Fail"}
                  </span>
                </div>
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
      </div>
    </div>
  );
};

export default AssignmentSubmissionUI;
