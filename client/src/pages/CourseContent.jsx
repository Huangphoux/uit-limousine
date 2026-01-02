import React, { useState, useRef, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import "./CourseContent.css";
import AssignmentSubmissionUI from "../pages/AssignmentSubmissionUI";

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
  console.log("CurrentData description:", currentLessonData?.description);
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
        // Get detailed error message
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error Response:", errorData);
        console.error("Status:", response.status, response.statusText);

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

        const errorMessage =
          errorData.message || errorData.error || `Failed to update progress (${response.status})`;
        alert(`Error: ${errorMessage}`);
        throw new Error(errorMessage);
      }

      const result = await response.json().catch(() => ({}));
      console.log("Mark as finished response:", result);
      console.log(
        isCurrentlyCompleted ? "Lesson unmarked:" : "Lesson marked as finished:",
        currentLesson
      );
    } catch (err) {
      console.error("Error updating lesson progress:", err);
      if (err.message && !err.message.includes("Failed to update progress")) {
        alert(`Error: ${err.message}`);
      }
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

  const handleDownloadResource = async (e, lessonId, resourceId, filename) => {
    e.preventDefault();

    alert(`Downloading: ${filename}\nLessonId: ${lessonId}\nResourceId: ${resourceId}`);
    console.log("[Download] Starting download:", { lessonId, resourceId, filename });

    const downloadUrl = `${import.meta.env.VITE_API_URL}/lessons/${lessonId}/resources/${resourceId}`;
    console.log("[Download] URL:", downloadUrl);

    try {
      const response = await fetch(downloadUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("[Download] Response status:", response.status);
      console.log("[Download] Response headers:", Object.fromEntries(response.headers.entries()));

      console.log("[Download] Response status:", response.status);
      console.log("[Download] Response headers:", Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log("[Download] Error data:", errorData);
        if (response.status === 404) {
          throw new Error("File not found. It may have been deleted.");
        }
        throw new Error(errorData.message || "Failed to download file");
      }

      const blob = await response.blob();
      console.log("[Download] Blob created:", { size: blob.size, type: blob.type });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      console.log("[Download] Download initiated for:", filename);
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("[Download] Error:", error);
      console.error("[Download] Error details:", {
        message: error.message,
        lessonId,
        resourceId,
        filename,
      });
      console.error("Download error:", error);
      alert(`Failed to download file: ${error.message}`);
    }
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

  // Updated JSX structure for English translation and layout separation
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
                      <div className="lesson-duration">{formatDuration(lesson.duration)}</div>
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
                <span>• {formatDuration(currentLessonData?.duration)}</span>
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
            ) : currentLessonData?.type === "article" ? (
              // Article rendering outside of .content-container to avoid layout overlap
              (() => {
                // Split content into description and reading content
                const fullContent = currentLessonData.content || "";
                const parts = fullContent.split(/\n\n+/); // Split by 2+ newlines
                const description = currentLessonData.description || parts[0] || "";
                const readingContent = currentLessonData.description
                  ? fullContent
                  : parts.slice(1).join("\n\n") || parts[0] || "";

                return (
                  <div className="article-content-container">
                    {description && (
                      <div className="reading-description">
                        <h3 className="reading-title">📖 Description</h3>
                        <div className="reading-box">{description}</div>
                      </div>
                    )}

                    {readingContent && (
                      <div className="reading-content">
                        <h3 className="reading-title">📝 Reading Content</h3>
                        <div className="reading-box">{readingContent}</div>
                      </div>
                    )}
                  </div>
                );
              })()
            ) : (
              <div className="content-container">
                {currentLessonData?.type === "video" &&
                (currentLessonData?.videoUrl || currentLessonData?.mediaUrl) ? (
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
                ) : (
                  <div className="content-placeholder">
                    {currentLessonData?.type === "video" && (
                      <>
                        🎥 Video Player - {currentLessonData?.title}
                        <div className="api-ready-note">No video URL provided</div>
                      </>
                    )}
                    {currentLessonData?.type === "article" && (
                      <>
                        📄 Article Content - {currentLessonData?.title}
                        <div className="api-ready-note">No article content provided</div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Lesson Resources */}
            {currentLessonData?.type !== "assignment" &&
              currentLessonData?.lessonResources &&
              currentLessonData.lessonResources.length > 0 && (
                <div className="lesson-resources mt-3">
                  <h5>Resources</h5>
                  <div className="resource-list">
                    {currentLessonData.lessonResources.map((res) => (
                      <div key={res.id} className="resource-item">
                        <div className="resource-icon">📎</div>
                        <a
                          className="resource-link"
                          href="#"
                          onClick={(e) =>
                            handleDownloadResource(e, res.lessonId, res.id, res.filename)
                          }
                        >
                          {res.filename}
                        </a>
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
