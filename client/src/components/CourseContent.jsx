import React, { useState, useRef } from "react";
import { Container, Row, Col, Button, ProgressBar } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";

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
      <style>
        {`
          .course-header {
            background: white;
            border-bottom: 1px solid #e9ecef;
            padding: 0.75rem 0;
          }

          .back-btn {
            background: #f8f9fa;
            border: 2px solid #e9ecef;
            border-radius: 25px;
            padding: 10px 20px;
            font-size: 1rem;
            font-weight: 600;
            color: #333;
            display: flex;
            align-items: center;
            gap: 6px;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .back-btn:hover {
            background: #e9ecef;
            border-color: #dee2e6;
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
          }

          .back-btn:active {
            transform: translateY(0);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .course-title {
            font-size: 1.1rem;
            font-weight: 600;
            margin: 0 0 0.125rem 0;
            color: #333;
          }

          .instructor-name {
            font-size: 0.85rem;
            color: #666;
            margin: 0;
          }

          .course-header .progress-section {
            display: flex;
            align-items: center;
            gap: 1rem;
          }

          .progress-text {
            font-size: 0.9rem;
            color: #333;
            margin: 0;
          }

          .custom-progress {
            width: 200px;
            height: 8px;
            background-color: #e9ecef;
            border-radius: 4px;
            overflow: hidden;
          }

          .custom-progress-fill {
            height: 100%;
            background-color: #333;
            transition: width 0.3s ease;
          }

          .sidebar {
            background: #00bcd4;
            color: white;
            height: calc(100vh - 80px);
            overflow-y: auto;
            padding: 1.5rem;
            border-right: 1px solid #e9ecef;
          }

          .sidebar-title {
            font-size: 1.4rem;
            font-weight: 700;
            margin-bottom: 1.5rem;
            color: white;
          }

          .sidebar .progress-section {
            display: block;
            margin-bottom: 2rem;
            padding-bottom: 1.5rem;
            border-bottom: 2px solid rgba(255, 255, 255, 0.5);
          }

          .progress-label {
            font-size: 0.9rem;
            color: rgba(255, 255, 255, 0.8);
            margin: 0 0 0.25rem 0;
          }

          .progress-count {
            font-size: 1.1rem;
            font-weight: 600;
            color: white;
            margin: 0 0 0.75rem 0;
          }

          .progress-bar-container {
            width: 100%;
            height: 6px;
            background-color: rgba(255, 255, 255, 0.3);
            border-radius: 3px;
            overflow: hidden;
          }

          .progress-bar-filled {
            height: 100%;
            background-color: #000000;
            border-radius: 3px;
            transition: width 0.3s ease;
          }

          .section {
            margin-bottom: 1.5rem;
            padding-bottom: 1.5rem;
            border-bottom: 2px solid rgba(255, 255, 255, 0.5);
          }

          .section:last-child {
            border-bottom: none;
            padding-bottom: 0;
          }

          .section-header {
            margin-bottom: 1rem;
          }

          .section-title {
            font-weight: 600;
            font-size: 1.2rem;
            margin: 0 0 0.25rem 0;
            color: white;
          }

          .section-info {
            font-size: 1rem;
            color: rgba(255, 255, 255, 0.8);
          }

          .lesson-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem 0;
            margin: 0.5rem 0;
            cursor: pointer;
            transition: background-color 0.2s ease;
            border-radius: 8px;
            border: 2px solid #0088ff;
          }

          .lesson-item:hover {
            background: rgba(255, 255, 255, 0.1);
          }

          .lesson-item.completed {
            background: #4caf50;
          }

          .lesson-item.active {
            background: #0088ff;
            padding-left: 0.5rem;
          }

          .lesson-item.completed .lesson-title {
            color: white;
          }

          .lesson-status-icon {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: flex;
            margin-left: 14px;
            align-items: center;
            justify-content: center;
            font-size: 0.7rem;
          }

          .check-icon {
            background: #4caf50;
            color: white;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.7rem;
            border: 1px solid white;
          }

          .empty-circle {
            background: transparent;
            border: 2px solid rgba(255, 255, 255, 0.4);
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid white;
          }

          // .play-icon {
          //   background: rgba(255, 255, 255, 0.2);
          //   color: white;
          //   width: 20px;
          //   height: 20px;
          //   border-radius: 50%;
          //   display: flex;
          //   align-items: center;
          //   justify-content: center;
          //   font-size: 0.6rem;
          // }

          .lesson-type-icon {
            font-size: 1rem;
          }

          .lesson-details {
            flex: 1;
          }

          .lesson-title {
            font-size: 1rem;
            margin: 0 0 0.25rem 0;
            color: white;
            font-weight: 600;
          }

          .lesson-duration {
            font-size: 0.8rem;
            color: rgba(255, 255, 255, 0.8);
          }
            line-height: 1.3;
          }

          .lesson-duration {
            font-size: 0.8rem;
            opacity: 0.8;
          }

          .main-content {
            padding: 2rem;
            background: #f8f9fa;
            height: calc(100vh - 80px);
            overflow-y: auto;
          }

          .lesson-header {
            margin-bottom: 1.5rem;
          }

          .lesson-category {
            background: #e9ecef;
            color: #666;
            padding: 0.25rem 0.75rem;
            border-radius: 1rem;
            font-size: 0.8rem;
            display: inline-block;
            margin-bottom: 0.5rem;
          }

          .lesson-main-title {
            font-size: 1.8rem;
            font-weight: 600;
            color: #333;
            margin-bottom: 0.5rem;
          }

          .lesson-meta {
            display: flex;
            align-items: center;
            gap: 1rem;
            color: #666;
            font-size: 0.9rem;
          }

          .content-container {
            background: #000;
            border-radius: 0.5rem;
            overflow: hidden;
            margin-bottom: 2rem;
            min-height: 300px;
            transition: all 0.3s ease;
          }

          .content-container:has(.content-placeholder:contains("Reading")) {
            background: #f8f9fa;
            border: 2px solid #dee2e6;
          }

          .content-container:has(.content-placeholder:contains("Assignment")) {
            background: linear-gradient(135deg, #e3f2fd, #bbdefb);
            border: 2px solid #2196f3;
          }

          .content-placeholder {
            width: 100%;
            height: 100%;
            min-height: 300px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.2rem;
            font-weight: 600;
            text-align: center;
            gap: 1rem;
            padding: 2rem;
          }

          .content-placeholder:has-text("Reading") {
            color: #333;
          }

          .content-placeholder:has-text("Assignment") {
            color: #1976d2;
          }

          .api-ready-note {
            font-size: 0.9rem;
            opacity: 0.7;
            font-weight: 400;
            font-style: italic;
            padding: 0.5rem 1rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 0.25rem;
            border: 1px dashed rgba(255, 255, 255, 0.3);
          }

          /* Video-specific styles */
          .content-container:has(.content-placeholder:contains("Video")) {
            aspect-ratio: 16/9;
            background: linear-gradient(135deg, #333, #666);
          }

          .video-iframe {
            width: 100%;
            height: 100%;
            border: none;
            border-radius: 0.5rem;
            aspect-ratio: 16/9;
          }

          .content-container:has(.video-iframe) {
            aspect-ratio: 16/9;
            background: transparent;
            padding: 0;
          }

          /* Reading-specific styles */  
          .content-container:has(.content-placeholder:contains("Reading")) .api-ready-note {
            background: rgba(0, 0, 0, 0.05);
            border-color: rgba(0, 0, 0, 0.1);
            color: #666;
          }

          /* Assignment-specific styles */
          .content-container:has(.content-placeholder:contains("Assignment")) .api-ready-note {
            background: rgba(25, 118, 210, 0.1);
            border-color: rgba(25, 118, 210, 0.3);
            color: #1565c0;
          }

          .lesson-actions {
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;
          }

          .mark-finished-btn {
            background: #28a745;
            border: none;
            color: white;
            padding: 0.75rem 2rem;
            border-radius: 0.5rem;
            font-weight: 600;
            flex: 1;
          }

          .mark-finished-btn:hover {
            background: #218838;
          }

          .unmark-btn {
            background: red;
            border: none;
            color: white;
            padding: 0.75rem 2rem;
            border-radius: 0.5rem;
            font-weight: 600;
            flex: 1;
          }

          .unmark-btn:hover {
            background: #680606ff;
          }

          .lesson-navigation {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 1rem;
            border-top: 1px solid #dee2e6;
          }

          .nav-btn {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            color: #666;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .nav-btn:hover {
            background: #e9ecef;
          }

          .nav-btn.next {
            background: #007bff;
            color: white;
            border-color: #007bff;
          }

          .nav-btn.next:hover {
            background: #0056b3;
          }

          .nav-btn.disabled {
            background: #f8f9fa;
            color: #ccc;
            border-color: #e9ecef;
            cursor: not-allowed;
            opacity: 0.6;
          }

          .nav-btn.disabled:hover {
            background: #f8f9fa;
            color: #ccc;
            transform: none;
          }

          .lesson-progress {
            font-size: 0.9rem;
            color: #666;
          }
        `}
      </style>

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
