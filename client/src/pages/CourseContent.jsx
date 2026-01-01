import React, { useState, useRef, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import "./CourseContent.css";
import AssignmentSubmissionUI from "../pages/AssignmentSubmissionUI";

const API_URL = import.meta.env.VITE_API_URL;

const CourseContent = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [currentLesson, setCurrentLesson] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const mainContentRef = useRef(null);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);

        // Fetch course materials (includes assignment details)
        const materialsResponse = await fetch(
          `http://localhost:3000/courses/${courseId}/materials`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!materialsResponse.ok) throw new Error("Failed to fetch course materials");

        const materialsResult = await materialsResponse.json();
        console.log("Materials API response:", materialsResult);
        console.log("Modules from API:", materialsResult.data?.modules || materialsResult.modules);

        // Debug: Log all lessons with their mediaUrl and type
        const modules = materialsResult.data?.modules || materialsResult.modules || [];
        modules.forEach((module, modIdx) => {
          console.log(`Module ${modIdx}: ${module.title}`);
          module.lessons.forEach((lesson, lesIdx) => {
            console.log(`  Lesson ${lesIdx}: ${lesson.title}`);
            console.log(`    - type: ${lesson.type}`);
            console.log(`    - mediaUrl: ${lesson.mediaUrl}`);
            console.log(`    - content: ${lesson.content?.substring(0, 50)}`);
            console.log(
              `    - assignment: ${lesson.assignment ? JSON.stringify(lesson.assignment) : "null"}`
            );
          });
        });

        // Fetch course basic info
        const courseResponse = await fetch(`http://localhost:3000/courses/${courseId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!courseResponse.ok) throw new Error("Failed to fetch course data");

        const courseResult = await courseResponse.json();
        console.log("Course API response:", courseResult);

        // Combine materials with course info
        const combinedData = {
          ...courseResult,
          modules: materialsResult.data?.modules || materialsResult.modules || [],
        };

        console.log("Combined course data:", combinedData);
        setCourseData(combinedData);

        console.log("Combined course data:", combinedData);
        setCourseData(combinedData);

        // --- BỔ SUNG ĐOẠN NÀY ---
        const finished = new Set();
        modules.forEach((module) => {
          module.lessons.forEach((lesson) => {
            // Dựa trên logic backend bạn đã sửa ở câu hỏi trước:
            // Nếu lesson.isCompleted là true hoặc lesson.progress tồn tại
            if (lesson.isCompleted) {
              finished.add(lesson.id);
            }
          });
        });
        setCompletedLessons(finished);
        // -------------------------

        if (modules && modules.length > 0 && modules[0].lessons.length > 0) {
          setCurrentLesson(modules[0].lessons[0].id);
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (courseId) fetchCourseData();
  }, [courseId, token]); // Thêm token vào dependency để fetch lại nếu token thay đổi

  // Helper function to get all lessons in order across modules
  const getAllLessons = () => {
    if (!courseData?.modules) return [];
    return courseData.modules.flatMap((module) => module.lessons || []);
  };

  const currentLessonData = getAllLessons().find((lesson) => lesson.id === currentLesson);
  console.log("CurrentData", currentLessonData);
  console.log("CurrentData contentType:", currentLessonData?.contentType);
  console.log("CurrentData type:", currentLessonData?.type);
  console.log("CurrentData mediaUrl:", currentLessonData?.mediaUrl);
  console.log("CurrentData content:", currentLessonData?.content);

  // Helper function to find current lesson index
  const getCurrentLessonIndex = () => {
    const allLessons = getAllLessons();
    return allLessons.findIndex((lesson) => lesson.id === currentLesson);
  };

  // Helper function to check if there's a previous lesson
  const hasPreviousLesson = () => {
    return getCurrentLessonIndex() > 0;
  };

  // Helper function to check if there's a next lesson
  const hasNextLesson = () => {
    const allLessons = getAllLessons();
    return getCurrentLessonIndex() < allLessons.length - 1;
  };

  const getNextLesson = () => {
    const allLessons = getAllLessons();
    if (hasNextLesson()) {
      let nextIndex = getCurrentLessonIndex() + 1;
      return allLessons[nextIndex];
    }
    return null;
  };

  // Helper function to get current module
  const getCurrentModule = () => {
    if (!courseData?.modules) return null;
    return courseData.modules.find((module) =>
      module.lessons?.some((lesson) => lesson.id === currentLesson)
    );
  };

  // Helper function to calculate overall progress percentage
  const getOverallProgress = () => {
    const totalLessons = getAllLessons().length;
    const completed = completedLessons.size;
    return totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;
  };

  // Helper function to get completed lessons count for a module
  const getModuleCompletedCount = (module) => {
    if (!module.lessons) return 0;
    return module.lessons.filter((lesson) => completedLessons.has(lesson.id)).length;
  };

  // Helper function to scroll to top of main content
  const scrollToMainContent = () => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Helper function to check if a lesson is unlocked
  const isLessonUnlocked = (lessonId) => {
    const allLessons = getAllLessons();
    const lessonIndex = allLessons.findIndex((lesson) => lesson.id === lessonId);

    if (lessonIndex === -1) return false;
    if (lessonIndex === 0) return true;
    if (completedLessons.has(lessonId)) return true;

    return completedLessons.has(allLessons[lessonIndex - 1].id);
  };

  const handleLessonClick = (lessonId) => {
    if (isLessonUnlocked(lessonId)) {
      setCurrentLesson(lessonId);
      scrollToMainContent();
    } else {
      console.log("This lesson is locked. Complete previous lessons first.");
    }
  };

  // Helper function to convert YouTube URL to embed format
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    return null;
  };

  const handleMarkAsFinished = async () => {
    const token = localStorage.getItem("accessToken");
    const isCurrentlyCompleted = completedLessons.has(currentLesson);

    try {
      // Optimistic update
      setCompletedLessons((prev) => {
        const newSet = new Set(prev);
        if (isCurrentlyCompleted) {
          newSet.delete(currentLesson);
        } else {
          newSet.add(currentLesson);
        }
        return newSet;
      });

      // Call API
      const response = await fetch(`http://localhost:3000/lessons/${currentLesson}/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Revert on error
        setCompletedLessons((prev) => {
          const newSet = new Set(prev);
          if (isCurrentlyCompleted) {
            newSet.add(currentLesson);
          } else {
            newSet.delete(currentLesson);
          }
          return newSet;
        });
        throw new Error("Failed to update progress");
      }

      console.log(
        isCurrentlyCompleted ? "Lesson unmarked:" : "Lesson marked as finished:",
        currentLesson
      );
    } catch (err) {
      console.error("Error updating lesson progress:", err);
    }
  };

  const handlePreviousLesson = () => {
    if (hasPreviousLesson()) {
      const allLessons = getAllLessons();
      const currentIndex = getCurrentLessonIndex();
      const previousLesson = allLessons[currentIndex - 1];
      setCurrentLesson(previousLesson.id);
      setTimeout(() => scrollToMainContent(), 100);
    }
  };

  const handleNextLesson = () => {
    if (hasNextLesson()) {
      const allLessons = getAllLessons();
      const currentIndex = getCurrentLessonIndex();
      const nextLesson = allLessons[currentIndex + 1];

      if (!isLessonUnlocked(nextLesson.id)) {
        console.log("Next lesson is locked. Complete current lesson first.");
        return;
      }

      setCurrentLesson(nextLesson.id);
      setTimeout(() => scrollToMainContent(), 100);
    }
  };

  const formatDuration = (durationSec) => {
    if (!durationSec) return "Reading";
    const minutes = Math.floor(durationSec / 60);
    const seconds = durationSec % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const formatDateShort = (iso) => {
    if (!iso) return null;
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getContentTypeIcon = (contentType) => {
    console.log("getContentTypeIcon called with:", contentType);
    switch (contentType) {
      case "video":
        return "🎥";
      case "article":
        return "📄";
      case "assignment":
        return "📝";
      default:
        return "📄";
    }
  };

  // Simple file icon chooser based on extension or mimeType
  const getFileIcon = (filename, mimeType) => {
    const ext = (filename || "").split(".").pop()?.toLowerCase();
    if (mimeType?.startsWith("image") || ["png", "jpg", "jpeg", "gif"].includes(ext)) return "🖼️";
    if (mimeType?.startsWith("video") || ["mp4", "mov", "avi", "mkv"].includes(ext)) return "🎥";
    if (ext === "pdf" || mimeType === "application/pdf") return "📄";
    if (["doc", "docx", "txt"].includes(ext)) return "📝";
    if (["zip", "rar"].includes(ext)) return "🗜️";
    if (["ppt", "pptx"].includes(ext)) return "📊";
    return "📎";
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f8f9fa",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div>Loading course data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f8f9fa",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div>
          <h3>Error loading course</h3>
          <p>{error}</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  if (!courseData) {
    return null;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa" }}>
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
                  <p className="instructor-name">{courseData.instructor?.name}</p>
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
                {completedLessons.size} / {getAllLessons().length} lessons
              </div>
              <div className="progress-bar-container">
                <div
                  className="progress-bar-filled"
                  style={{ width: `${getOverallProgress()}%` }}
                ></div>
              </div>
            </div>

            {courseData.modules?.map((module) => (
              <div key={module.id} className="section">
                <div className="section-header">
                  <div className="section-title">{module.title}</div>
                  <div className="section-info">{module.lessons?.length || 0} lessons</div>
                </div>

                {module.lessons?.map((lesson) => (
                  <div
                    key={lesson.id}
                    className={`lesson-item ${lesson.id === currentLesson ? "active" : ""} ${completedLessons.has(lesson.id) ? "completed" : ""} ${!isLessonUnlocked(lesson.id) ? "locked" : ""}`}
                    onClick={() => handleLessonClick(lesson.id)}
                    style={{
                      cursor: isLessonUnlocked(lesson.id) ? "pointer" : "not-allowed",
                      opacity: isLessonUnlocked(lesson.id) ? 1 : 0.5,
                    }}
                  >
                    <div className="lesson-status-icon">
                      {completedLessons.has(lesson.id) ? (
                        <div className="check-icon">✓</div>
                      ) : isLessonUnlocked(lesson.id) ? (
                        <div className="empty-circle"></div>
                      ) : (
                        <div className="lock-icon">🔒</div>
                      )}
                    </div>
                    <div className="lesson-type-icon">{getContentTypeIcon(lesson.type)}</div>
                    <div className="lesson-details">
                      <div className="lesson-title">{lesson.title}</div>
                      <div className="lesson-duration">
                        {lesson.type === "assignment" && lesson.assignment?.dueDate ? (
                          <span className="sidebar-deadline">
                            Due: {formatDateShort(lesson.assignment.dueDate)}
                          </span>
                        ) : (
                          formatDuration(lesson.duration)
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Col>

        {/* Main Content */}
        <Col md={8} lg={9}>
          <div className="main-content" ref={mainContentRef}>
            <div className="lesson-header">
              <div className="lesson-category">{getCurrentModule()?.title || "Course Content"}</div>
              <h1 className="lesson-main-title">{currentLessonData?.title}</h1>
              <div className="lesson-meta">
                <span>
                  {getContentTypeIcon(currentLessonData?.type)}{" "}
                  {currentLessonData?.type === "video"
                    ? "Video"
                    : currentLessonData?.type === "article"
                      ? "Article"
                      : "Assignment"}
                </span>
                {currentLessonData?.type === "assignment" ? (
                  currentLessonData?.assignment?.dueDate && (
                    <span className="deadline-badge" style={{ marginLeft: 8 }}>
                      Due:{" "}
                      <strong
                        style={{
                          color:
                            new Date(currentLessonData.assignment.dueDate) < new Date()
                              ? "#dc2626"
                              : "#0369a1",
                        }}
                      >
                        {formatDateShort(currentLessonData.assignment.dueDate)}
                      </strong>
                      {new Date(currentLessonData.assignment.dueDate) < new Date()
                        ? " • Closed"
                        : ""}
                    </span>
                  )
                ) : (
                  <span>• {formatDuration(currentLessonData?.duration)}</span>
                )}
              </div>
            </div>

            {/* Content Container */}
            {currentLessonData?.type === "assignment" ? (
              <AssignmentSubmissionUI
                key={currentLessonData?.id}
                lesson={currentLessonData}
                onMarkAsFinished={handleMarkAsFinished}
                isCompleted={completedLessons.has(currentLesson)}
              />
            ) : (
              <div className="content-container">
                {currentLessonData?.type === "video" &&
                (currentLessonData?.videoUrl || currentLessonData?.mediaUrl) ? (
                  <div>
                    <h3 className="h6 mb-3" style={{ color: "#111827", fontWeight: 600 }}>
                      🔊 Video
                    </h3>

                    {currentLessonData.description && (
                      <div style={{ marginBottom: "1rem", color: "#111827" }}>
                        {currentLessonData.description}
                      </div>
                    )}

                    <iframe
                      src={getYouTubeEmbedUrl(
                        currentLessonData.videoUrl || currentLessonData.mediaUrl
                      )}
                      title={currentLessonData.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="video-iframe"
                    />
                  </div>
                ) : (currentLessonData?.type === "article" ||
                    currentLessonData?.type === "reading") &&
                  (currentLessonData?.readingContent || currentLessonData?.content) ? (
                  <div>
                    <h3 className="h6 mb-3" style={{ color: "#111827", fontWeight: 600 }}>
                      📖 Reading Content
                    </h3>

                    {currentLessonData.description && (
                      <div style={{ marginBottom: "1rem", color: "#111827", fontWeight: 600 }}>
                        {currentLessonData.description}
                      </div>
                    )}

                    <div
                      className="article-content-container"
                      style={{
                        padding: "2rem",
                        backgroundColor: "#ffffff",
                        borderRadius: "0.5rem",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        lineHeight: "1.8",
                        fontSize: "1rem",
                        color: "#0f172a",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {currentLessonData.readingContent || currentLessonData.content}
                    </div>
                  </div>
                ) : (
                  <div className="content-placeholder">
                    {currentLessonData?.type === "video" && (
                      <>
                        🎥 Video Player - {currentLessonData?.title}
                        <div className="api-ready-note">No video URL provided</div>
                      </>
                    )}
                    {(currentLessonData?.type === "article" ||
                      currentLessonData?.type === "reading") && (
                      <>
                        📄 Article Content - {currentLessonData?.title}
                        <div className="api-ready-note">No content provided</div>
                      </>
                    )}
                    {!["video", "article", "reading"].includes(currentLessonData?.type) && (
                      <>
                        <div style={{ fontSize: "1.1rem", fontWeight: 600 }}>
                          {getContentTypeIcon(currentLessonData?.type)} {currentLessonData?.title}
                        </div>
                        <div className="api-ready-note">No content type UI for this lesson</div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Lesson description (if any, separate from content) */}
            {currentLessonData?.description && (
              <div className="lesson-description" style={{ marginTop: "1rem" }}>
                <h5>Description</h5>
                <p style={{ whiteSpace: "pre-wrap" }}>{currentLessonData.description}</p>
              </div>
            )}

            {/* Lesson resources / files */}
            {currentLessonData?.lessonResources && currentLessonData.lessonResources.length > 0 && (
              <div className="lesson-resources" style={{ marginTop: "1rem" }}>
                <h5>Resources</h5>
                <div className="resource-list">
                  {currentLessonData.lessonResources.map((res) => (
                    <div
                      key={res.id || res.fileId}
                      className={`resource-item ${!res.id ? "processing" : ""}`}
                    >
                      <span className="resource-icon" aria-hidden="true">
                        {getFileIcon(res.filename, res.mimeType)}
                      </span>
                      {res.id ? (
                        <a
                          className="resource-link"
                          href={`${API_URL}/lessons/${res.lessonId}/resources/${res.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <strong>{res.filename}</strong>
                        </a>
                      ) : (
                        <div className="resource-processing">
                          <strong>{res.filename}</strong>
                          <span className="processing-badge">processing</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lesson Actions */}
            {currentLessonData?.type !== "assignment" && (
              <div className="lesson-actions">
                {completedLessons.has(currentLesson) ? (
                  <Button className="unmark-btn" onClick={handleMarkAsFinished}>
                    ✕ Unmark
                  </Button>
                ) : (
                  <Button className="mark-finished-btn" onClick={handleMarkAsFinished}>
                    ✓ Mark as finished
                  </Button>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="lesson-navigation">
              <button
                className={`nav-btn ${!hasPreviousLesson() ? "disabled" : ""}`}
                onClick={handlePreviousLesson}
                disabled={!hasPreviousLesson()}
              >
                ← Previous lesson
              </button>
              <div className="lesson-progress">
                Lesson {getCurrentLessonIndex() + 1} / {getAllLessons().length} -{" "}
                {getCurrentModule()?.title}
              </div>
              <button
                className={`nav-btn next ${!hasNextLesson() || (getNextLesson() && !isLessonUnlocked(getNextLesson().id)) ? "disabled" : ""}`}
                onClick={handleNextLesson}
                disabled={
                  !hasNextLesson() || (getNextLesson() && !isLessonUnlocked(getNextLesson().id))
                }
              >
                Next lesson →
              </button>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CourseContent;
