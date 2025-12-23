import React, { useState } from "react";
import { Card, Button, Form } from "react-bootstrap";
import { BsCloudUpload, BsDownload, BsFileEarmarkText, BsTrophy, BsTag } from "react-icons/bs";
import "./CourseContent.css";

const AssignmentSubmissionUI = ({ lesson }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false); // Bắt đầu với trạng thái chưa nộp
  const [submissionResult, setSubmissionResult] = useState(null);

  // Mock data for a graded submission to show the UI
  const gradedSubmission = {
    files: [{ name: "Assignment.py", size: "50 KB" }],
    score: 60,
    maxScore: 100,
    percentage: 60,
    status: "Pass",
    scorer: "Instructor B",
    date: "21:06:21 14/11/2025",
  };

  const handleFileSelect = (event) => {
    setSelectedFiles([...event.target.files]);
  };

  const handleSubmit = () => {
    // Simulate submission with mock result
    const now = new Date();
    const formattedDate = now
      .toLocaleString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(",", "");

    setSubmissionResult({
      files: selectedFiles.map((f) => ({
        name: f.name,
        size: `${Math.round(f.size / 1024)} KB`,
      })),
      score: 60,
      maxScore: 100,
      percentage: 60,
      status: "Pass",
      scorer: "Instructor B",
      date: formattedDate,
    });
    setIsSubmitted(true);
  };

  return (
    <>
      {/* Assignment Submission Component */}
      <div className="assignment-submission-container mb-4">
        <Card className="p-4" style={{ backgroundColor: "#ffffff", color: "#000000", border: '1px solid #dee2e6', borderRadius: '0.5rem' }}>
          <Card.Body>
                  <div className="d-flex align-items-start gap-3 mb-4">
                    <span style={{ fontSize: "1.5rem" }}>📖</span>
                    <div>
                      <h2 className="h5 fw-bold mb-2">Description</h2>
                      <p>
                        The user input a number n. Write a program to calculate the sum of 1 to n.
                        If n is lower than 1, return error.
                      </p>
                    </div>
                  </div>

                  {/* Conditional Rendering: Upload Form or Submission Result */}
                  {!isSubmitted && !lesson.isCompleted ? (
                    /* Upload Section */
                    <div className="mt-4">
                      <h3 className="h6 fw-bold mb-3">
                        Upload your file here (can have multiple files):
                      </h3>

                      <div
                        className="rounded-3 p-5 text-center"
                        style={{ border: "4px solid #06b6d4", cursor: "pointer" }}
                        onClick={() => document.getElementById("file-upload").click()}
                      >
                        <Form.Control
                          type="file"
                          multiple
                          onChange={handleFileSelect}
                          className="d-none"
                          id="file-upload"
                        />
                        <div className="d-flex flex-column align-items-center gap-3">
                          <BsCloudUpload style={{ fontSize: "4rem", color: "#06b6d4" }} />
                          <Button variant="info" className="text-white text-bold">
                            Choose file
                          </Button>
                          <p className="text-black mb-0">Or drag'n drop file here</p>
                          <p className="small text-black">Maximum size: 100MB</p>
                        </div>
                      </div>

                      {selectedFiles.length > 0 && (
                        <div className="mt-4">
                          <p className="small fw-medium mb-2">Selected files:</p>
                          <ul className="list-unstyled small text-black">
                            {selectedFiles.map((file, index) => (
                              <li key={index}>• {file.name}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <Button
                        variant="success"
                        size="lg"
                        className="w-100 mt-4"
                        onClick={handleSubmit}
                        disabled={selectedFiles.length === 0 || isSubmitted}
                      >
                        <span className="fs-5 me-2">✓</span>
                        Submit Assignment
                      </Button>
                    </div>
                  ) : (
                    /* Submission Result Section */
                    <div className="mt-4">
                      {/* Uploaded Files */}
                      {/* Using gradedSubmission for demonstration as submissionResult is null initially */}
                      <div className="mb-4">
                        <p className="text-black mb-3">
                          Uploaded file ({submissionResult?.files.length || gradedSubmission.files.length})
                        </p>

                        {(submissionResult?.files || gradedSubmission.files).map((file, index) => (
                          <div
                            key={index}
                            className="d-flex align-items-center justify-content-between p-3 mb-2 rounded-3"
                            style={{ backgroundColor: "#5cccd8ff" }}
                          >
                            <div className="d-flex align-items-center gap-3">
                              <BsFileEarmarkText style={{ fontSize: "2rem", color: "#0891b2" }} />
                              <div>
                                <p className="fw-bold mb-0" style={{ color: "#000" }}>
                                  {file.name}
                                </p>
                                <p className="small text-black mb-0">{file.size}</p>
                              </div>
                            </div>
                            <Button variant="link" className="text-dark p-0">
                              <BsDownload style={{ fontSize: "1.5rem" }} />
                            </Button>
                          </div>
                        ))}
                      </div>

                      {/* Score Card */}
                      <div
                        className="d-flex align-items-center justify-content-between p-4 rounded-3"
                        style={{ backgroundColor: "#fbbf24" }}
                      >
                        <div>
                          <div className="d-flex align-items-center gap-2 mb-2">
                            <BsTag style={{ fontSize: "1.5rem", color: "#dc2626" }} />
                            <span
                              className="fw-bold"
                              style={{ fontSize: "1.25rem", color: "#dc2626" }}
                            >
                              Your final score: {submissionResult?.score || gradedSubmission.score} /{" "}
                              {submissionResult?.maxScore || gradedSubmission.maxScore} (
                              {submissionResult?.percentage || gradedSubmission.percentage}%)
                            </span>
                          </div>
                          <p className="mb-1 ms-4" style={{ color: "#374151" }}>
                            Scorer: {submissionResult?.scorer || gradedSubmission.scorer}
                          </p>
                          <p className="mb-0 ms-4" style={{ color: "#374151" }}>
                            Date: {submissionResult?.date || gradedSubmission.date}
                          </p>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <BsTrophy style={{ fontSize: "2rem", color: "black" }} />
                          <span
                            className="fw-bold"
                            style={{
                              fontSize: "1.5rem",
                              color:
                                (submissionResult?.status || gradedSubmission.status) === "Pass"
                                  ? "#16a34a"
                                  : "#dc2626",
                            }}
                          >
                            {submissionResult?.status || gradedSubmission.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

export default AssignmentSubmissionUI;
