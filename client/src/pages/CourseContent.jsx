import React, { useState, useRef } from "react";
import { Container, Row, Col, Button, ProgressBar } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import "./CourseContent.css";

const CourseContent = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [currentLesson, setCurrentLesson] = useState("python-introduction");
  const mainContentRef = useRef(null);

  // Mock course data - now using React state
  const [courseData, setCourseData] = useState({
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
            isActive: false,
            type: "video",
            videoUrl: "https://youtu.be/dQw4w9WgXcQ?si=U44oTis058iYqDBU",
          },
          {
            id: "variables-data-types",
            title: "Variables and Data Types",
            duration: "15:20",
            isCompleted: true,
            isActive: false,
            type: "video",
          },
          {
            id: "python-syntax",
            title: "Reading: Python Syntax",
            duration: "8 minutes",
            isCompleted: true,
            isActive: true,
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
            isActive: false,
            type: "video",
          },
          {
            id: "loops",
            title: "Loops",
            duration: "16:40",
            isCompleted: false,
            isActive: false,
            type: "video",
          },
          {
            id: "write-program",
            title: "Write a simple program",
            duration: "3 days left",
            isCompleted: false,
            isActive: false,
            type: "assignment",
          },
        ],
      },
    ],
  });

  // Helper function to get all lessons in order across sections
  const getAllLessons = () => {
    return courseData.sections.flatMap((section) => section.lessons);
  };

  const currentLessonData = getAllLessons().find((lesson) => lesson.id === currentLesson);

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

  // Helper function to get current section
  const getCurrentSection = () => {
    return courseData.sections.find((section) =>
      section.lessons.some((lesson) => lesson.id === currentLesson)
    );
  };

  // Helper function to calculate overall progress percentage
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

  // Helper function to scroll to top of main content
  const scrollToMainContent = () => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleLessonClick = (lessonId) => {
    setCurrentLesson(lessonId);
  };

  // Helper function to convert YouTube URL to embed format
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;

    // Extract video ID from various YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }

    return null;
  };

  const handleMarkAsFinished = () => {
    // Logic to mark current lesson as finished
    setCourseData((prevData) => {
      const newData = { ...prevData };

      // Find the section and lesson
      const targetSectionIndex = newData.sections.findIndex((section) =>
        section.lessons.some((lesson) => lesson.id === currentLesson)
      );

      if (targetSectionIndex !== -1) {
        const targetSection = { ...newData.sections[targetSectionIndex] };
        const targetLessonIndex = targetSection.lessons.findIndex(
          (lesson) => lesson.id === currentLesson
        );

        if (targetLessonIndex !== -1) {
          const targetLesson = targetSection.lessons[targetLessonIndex];

          if (!targetLesson.isCompleted) {
            // Create new arrays and objects to ensure React detects the change
            targetSection.lessons = [...targetSection.lessons];
            targetSection.lessons[targetLessonIndex] = {
              ...targetLesson,
              isCompleted: true,
            };
            targetSection.completedLessons += 1;

            newData.sections = [...newData.sections];
            newData.sections[targetSectionIndex] = targetSection;

            console.log("Lesson marked as finished:", currentLesson);
          } else {
            targetSection.lessons = [...targetSection.lessons];
            targetSection.lessons[targetLessonIndex] = {
              ...targetLesson,
              isCompleted: false,
            };
            targetSection.completedLessons -= 1;

            newData.sections = [...newData.sections];
            newData.sections[targetSectionIndex] = targetSection;

            console.log("Lesson unmarked:", currentLesson);
          }
        }
      }

      return newData;
    });
  };

  const handlePreviousLesson = () => {
    if (hasPreviousLesson()) {
      const allLessons = getAllLessons();
      const currentIndex = getCurrentLessonIndex();
      const previousLesson = allLessons[currentIndex - 1];

      // Check if we're moving to a different section
      const currentSectionId = getCurrentSection()?.id;
      const previousSection = courseData.sections.find((section) =>
        section.lessons.some((lesson) => lesson.id === previousLesson.id)
      );

      if (currentSectionId !== previousSection?.id) {
        console.log(`Moving to previous section: ${previousSection?.title}`);
      }

      setCurrentLesson(previousLesson.id);
      console.log("Moving to previous lesson:", previousLesson.title);

      // Scroll to top of main content after lesson change
      setTimeout(() => scrollToMainContent(), 100);
    } else {
      console.log("Already at the first lesson");
    }
  };

  const handleNextLesson = () => {
    if (hasNextLesson()) {
      const allLessons = getAllLessons();
      const currentIndex = getCurrentLessonIndex();
      const nextLesson = allLessons[currentIndex + 1];

      // Check if we're moving to a different section
      const currentSectionId = getCurrentSection()?.id;
      const nextSection = courseData.sections.find((section) =>
        section.lessons.some((lesson) => lesson.id === nextLesson.id)
      );

      if (currentSectionId !== nextSection?.id) {
        console.log(`Moving to next section: ${nextSection?.title}`);
      }

      setCurrentLesson(nextLesson.id);
      console.log("Moving to next lesson:", nextLesson.title);

      // Scroll to top of main content after lesson change
      setTimeout(() => scrollToMainContent(), 100);
    } else {
      console.log("Already at the last lesson");
    }
  };

  const renderLessonIcon = (lesson) => {
    if (lesson.type === "video") {
      return (
        <div
          className={`lesson-icon ${lesson.isCompleted ? "completed" : lesson.isActive ? "active" : ""}`}
        >
          ▶
        </div>
      );
    } else if (lesson.type === "reading") {
      return (
        <div
          className={`lesson-icon ${lesson.isCompleted ? "completed" : lesson.isActive ? "active" : ""}`}
        >
          📄
        </div>
      );
    } else if (lesson.type === "assignment") {
      return (
        <div
          className={`lesson-icon ${lesson.isCompleted ? "completed" : lesson.isActive ? "active" : ""}`}
        >
          ✏️
        </div>
      );
    }
  };

  return (
    <>
      {/* Custom Styles */}
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
                      onClick={() => handleLessonClick(lesson.id)}
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
            <div className="main-content" ref={mainContentRef}>
              <div className="lesson-header">
                <div className="lesson-category">
                  {getCurrentSection()?.title || "Course Content"}
                </div>
                <h1 className="lesson-main-title">{currentLessonData?.title}</h1>
                <div className="lesson-meta">
                  <span>
                    ▶{" "}
                    {currentLessonData?.type === "video"
                      ? "Video"
                      : currentLessonData?.type === "reading"
                        ? "Reading"
                        : "Assignment"}
                  </span>
                  <span>• {currentLessonData?.duration}</span>
                </div>
              </div>

              {/* Content Container - Adaptable for Video/Reading/Assignment */}
              <div className="content-container">
                {currentLessonData?.type === "video" && currentLessonData?.videoUrl ? (
                  <iframe
                    src={getYouTubeEmbedUrl(currentLessonData.videoUrl)}
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
                        <div className="api-ready-note">Ready for video API integration</div>
                      </>
                    )}
                    {currentLessonData?.type === "reading" && (
                      <>
                        📄 Reading Content - {currentLessonData?.title}
                        <div className="api-ready-note">
                          Ready for reading content API integration
                        </div>
                      </>
                    )}
                    {currentLessonData?.type === "assignment" && (
                      <>
                        📝 Assignment - {currentLessonData?.title}
                        <div className="api-ready-note">Ready for assignment API integration</div>
                        {/* Assignment submit here */}
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Lesson Actions */}
              <div className="lesson-actions">
                {currentLessonData.isCompleted ? (
                  <Button className="unmark-btn" onClick={handleMarkAsFinished}>
                    ✕ Unmark
                  </Button>
                ) : (
                  <Button className="mark-finished-btn" onClick={handleMarkAsFinished}>
                    ✓ Mark as finished
                  </Button>
                )}
              </div>

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
                  {getCurrentSection()?.title}
                </div>
                <button
                  className={`nav-btn next ${!hasNextLesson() ? "disabled" : ""}`}
                  onClick={handleNextLesson}
                  disabled={!hasNextLesson()}
                >
                  Next lesson →
                </button>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default CourseContent;
