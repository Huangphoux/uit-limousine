import React, { useState } from "react";
import { Card, Button, Form, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { BsCloudUpload, BsDownload, BsFileEarmarkText, BsTrophy, BsTag } from "react-icons/bs";
import "./CourseContent.css";

const AssignmentSubmit = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(true); // 👈 true = đã nộp
  const [submissionResult, setSubmissionResult] = useState({
    files: [{ name: "Assignment.py", size: "50 KB" }],
    score: 60,
    maxScore: 100,
    percentage: 60,
    status: "Pass",
    scorer: "Instructor B",
    date: "21:06:21 14/11/2025",
  });
  const navigate = useNavigate();

  const [courseData] = useState({
    title: "Python For Everybody Specialization",
    instructor: "Charles Severance",
    sections: [
      {
        id: "python-basics",
        title: "Python Basics",
        totalLessons: 3,
        completedLessons: 3,
        lessons: [
          {
            id: "python-introduction",
            title: "Python Introduction",
            duration: "10:00",
            isCompleted: true,
            type: "video",
          },
          {
            id: "variables-data-types",
            title: "Variables and Data Types",
            duration: "15:20",
            isCompleted: true,
            type: "video",
          },
          {
            id: "python-syntax",
            title: "Reading: Python Syntax",
            duration: "8 minutes",
            isCompleted: true,
            type: "reading",
          },
        ],
      },
      {
        id: "control-flow",
        title: "Control Flow",
        totalLessons: 3,
        completedLessons: 0,
        lessons: [
          {
            id: "if-statement",
            title: "If statement",
            duration: "12:00",
            isCompleted: false,
            type: "video",
          },
          { id: "loops", title: "Loops", duration: "16:40", isCompleted: false, type: "video" },
          {
            id: "write-program",
            title: "Write a simple program",
            duration: "3 days left",
            isCompleted: false,
            type: "assignment",
          },
        ],
      },
    ],
  });

  const currentLesson = "write-program";
  const getAllLessons = () => courseData.sections.flatMap((section) => section.lessons);
  const currentLessonData = getAllLessons().find((lesson) => lesson.id === currentLesson);
  const getCurrentSection = () =>
    courseData.sections.find((section) =>
      section.lessons.some((lesson) => lesson.id === currentLesson)
    );

  const getOverallProgress = () => {
    const totalLessons = courseData.sections.reduce(
      (total, section) => total + section.totalLessons,
      0
    );
    const completedLessons = courseData.sections.reduce(
      (total, section) => total + section.completedLessons,
      0
    );
    return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
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

  const handleResubmit = () => {
    setIsSubmitted(false);
    setSubmissionResult(null);
    setSelectedFiles([]);
  };

  return (
    <>
      <div style={{ minHeight: "100vh", background: "#ffffff" }}>
        {/* Header */}
        <div className="course-header">
          <Container fluid>
            <Row className="align-items-center">
              <Col md={6}>
                <div className="d-flex align-items-center gap-2">
                  <button className="back-btn" onClick={() => navigate(-1)}>
                    Back
                  </button>
                  <div>
                    <h1 className="course-title">{courseData.title}</h1>
                    <p className="instructor-name">{courseData.instructor}</p>
                  </div>
                </div>
              </Col>
              <Col md={6}>
                <div className="progress-section justify-content-end d-flex">
                  <span className="progress-text">Progress</span>
                  <span className="progress-text">{getOverallProgress()}%</span>
                  <div className="custom-progress">
                    <div
                      className="custom-progress-fill"
                      style={{ width: `${getOverallProgress()}%` }}
                    ></div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>

        {/* Main Layout */}
        <Row className="g-0">
          {/* Left Sidebar */}
          <Col md={4} lg={3}>
            <div className="sidebar">
              <h1 className="sidebar-title">Course Content</h1>
              <div className="progress-section">
                <div className="progress-label">Completed</div>
                <div className="progress-count">
                  {courseData.sections.reduce(
                    (total, section) => total + section.completedLessons,
                    0
                  )}
                  /{courseData.sections.reduce((total, section) => total + section.totalLessons, 0)}{" "}
                  lessons
                </div>
                <div className="progress-bar-container">
                  <div
                    className="progress-bar-filled"
                    style={{
                      width: `${
                        (courseData.sections.reduce(
                          (total, section) => total + section.completedLessons,
                          0
                        ) /
                          courseData.sections.reduce(
                            (total, section) => total + section.totalLessons,
                            0
                          )) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              {courseData.sections.map((section) => (
                <div key={section.id} className="section">
                  <div className="section-header">
                    <div className="section-title">{section.title}</div>
                    <div className="section-info">{section.lessons.length} lessons</div>
                  </div>

                  {section.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className={`lesson-item ${lesson.id === currentLesson ? "active" : ""} ${lesson.isCompleted ? "completed" : ""}`}
                      onClick={() => navigate(`/course/${courseData.id}`)}
                    >
                      <div className="lesson-status-icon">
                        {lesson.isCompleted ? (
                          <div className="check-icon">✓</div>
                        ) : (
                          <div className="empty-circle"></div>
                        )}
                      </div>
                      <div className="lesson-type-icon">
                        {lesson.type === "video" ? "🎥" : lesson.type === "reading" ? "📄" : "📝"}
                      </div>
                      <div className="lesson-details">
                        <div className="lesson-title">{lesson.title}</div>
                        <div className="lesson-duration">{lesson.duration}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Col>

          {/* Main Content */}
          <Col md={8} lg={9}>
            <div className="main-content">
              <div className="lesson-header">
                <div className="lesson-category">
                  {getCurrentSection()?.title || "Course Content"}
                </div>
                <h1 className="lesson-main-title">{currentLessonData?.title}</h1>
                <div className="lesson-meta">
                  <span>📝 Assignment</span>
                  <span>• {currentLessonData?.duration}</span>
                </div>
              </div>

              {/* Assignment Submission Component */}
              <Card className="p-4 mb-4" style={{ backgroundColor: "#ffffff", color: "#000000" }}>
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
                  {!isSubmitted ? (
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
                        disabled={selectedFiles.length === 0}
                      >
                        <span className="fs-5 me-2">✓</span>
                        Submit Assignment
                      </Button>
                    </div>
                  ) : (
                    /* Submission Result Section */
                    <div className="mt-4">
                      {/* Uploaded Files */}
                      <div className="mb-4">
                        <p className="text-black mb-3">
                          Uploaded file ({submissionResult.files.length})
                        </p>

                        {submissionResult.files.map((file, index) => (
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
                              Your final score: {submissionResult.score} /{" "}
                              {submissionResult.maxScore} ({submissionResult.percentage}%)
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
                          <BsTrophy style={{ fontSize: "2rem", color: "black" }} />
                          <span
                            className="fw-bold"
                            style={{
                              fontSize: "1.5rem",
                              color: submissionResult.status === "Pass" ? "#16a34a" : "#dc2626",
                            }}
                          >
                            {submissionResult.status}
                          </span>
                        </div>
                      </div>

                      {/* Resubmit Button */}
                      <Button
                        variant="secondary"
                        size="lg"
                        className="w-100 mt-4"
                        onClick={handleResubmit}
                      >
                        🔄 Resubmit Assignment
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default AssignmentSubmit;
