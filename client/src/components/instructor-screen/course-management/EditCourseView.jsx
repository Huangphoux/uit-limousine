import { useState, useRef, useEffect } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { FiFolderPlus } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";

import VideoLessonContent from "./VideoLessonContent";
import ReadingLessonContent from "./ReadingLessonContent";
import AssignmentLessonContent from "./AssignmentLessonContent";
import AssignmentGradingDetail from "./AssignmentGradingDetail";

// import Header from "../../Header";
import "./EditCourseView.css";

const EditCourseView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mainContentRef = useRef(null);
  const [assignmentActiveTab, setAssignmentActiveTab] = useState("edit");

  const [courseData, setCourseData] = useState({
    title: "Demo Course",
    instructor: "Instructor Name",
    modules: [],
  });

  // Load course data from navigation state
  useEffect(() => {
    if (location.state?.courseData) {
      const course = location.state.courseData;
      setCourseData({
        id: course.id,
        title: course.title,
        description: course.description,
        instructor: "Instructor Name", // You can get this from context/auth
        image: course.image,
        status: course.status,
        modules: course.modules || [],
      });
    }
  }, [location.state]);

  const [selectedLesson, setSelectedLesson] = useState(null);
  const [editingModule, setEditingModule] = useState(null); // Track which module is being renamed
  const [editingLesson, setEditingLesson] = useState(null); // Track which lesson is being renamed

  const [lessonForm, setLessonForm] = useState({
    title: "",
    type: "Video",
    duration: "10:00",
    description: "",
    files: [],
  });

  // Add new module
  const handleAddModule = () => {
    const newModuleNumber = courseData.modules.length + 1;
    const newModule = {
      id: `module-${Date.now()}`,
      title: `New Module ${newModuleNumber}`,
      lessons: [],
      isCustomName: false, // Track if user has renamed this module
    };
    setCourseData((prev) => ({
      ...prev,
      modules: [...prev.modules, newModule],
    }));
  };

  // Add new lesson to a module
  const handleAddLesson = (moduleId) => {
    const module = courseData.modules.find((m) => m.id === moduleId);
    const newLessonNumber = module ? module.lessons.length + 1 : 1;
    const newLesson = {
      id: `lesson-${Date.now()}`,
      title: `New Lesson ${newLessonNumber}`,
      type: "Video",
      duration: "10:00",
      description: "",
      files: [],
      isCustomName: false, // Track if user has renamed this lesson
    };

    setCourseData((prev) => ({
      ...prev,
      modules: prev.modules.map((module) =>
        module.id === moduleId ? { ...module, lessons: [...module.lessons, newLesson] } : module
      ),
    }));

    setSelectedLesson({ moduleId, lessonId: newLesson.id });
    setLessonForm(newLesson);
  };

  // Select lesson to edit
  const handleSelectLesson = (moduleId, lessonId) => {
    const module = courseData.modules.find((m) => m.id === moduleId);
    const lesson = module?.lessons.find((l) => l.id === lessonId);
    if (lesson) {
      setSelectedLesson({ moduleId, lessonId });
      setLessonForm(lesson);
      if (lesson.type === "Assignment") {
        setAssignmentActiveTab("edit");
      }
    }
  };

  // Update lesson form
  const handleLessonFormChange = (field, value) => {
    setLessonForm((prev) => {
      let updatedForm = { ...prev, [field]: value };

      // When changing lesson type, reset type-specific fields
      if (field === "type") {
        if (value === "Video") {
          updatedForm = {
            ...updatedForm,
            videoUrl: "",
            duration: "10:00",
            // Remove reading/assignment specific fields
            readingContent: undefined,
            dueDate: undefined,
            dueTime: undefined,
            maxScore: undefined,
            latePolicy: undefined,
          };
        } else if (value === "Reading") {
          updatedForm = {
            ...updatedForm,
            readingContent: "",
            duration: "10:00",
            // Remove video/assignment specific fields
            videoUrl: undefined,
            dueDate: undefined,
            dueTime: undefined,
            maxScore: undefined,
            latePolicy: undefined,
          };
        } else if (value === "Assignment") {
          updatedForm = {
            ...updatedForm,
            dueDate: "",
            dueTime: "23:59",
            maxScore: 100,
            latePolicy: "accept",
            // Remove video/reading specific fields
            videoUrl: undefined,
            readingContent: undefined,
            duration: undefined,
          };
        }
      }

      return updatedForm;
    });

    // Update lesson in courseData
    if (selectedLesson) {
      setCourseData((prev) => ({
        ...prev,
        modules: prev.modules.map((module) =>
          module.id === selectedLesson.moduleId
            ? {
                ...module,
                lessons: module.lessons.map((lesson) => {
                  if (lesson.id === selectedLesson.lessonId) {
                    let updatedLesson = { ...lesson, [field]: value };

                    // Apply same type change logic
                    if (field === "type") {
                      if (value === "Video") {
                        updatedLesson = {
                          ...updatedLesson,
                          videoUrl: "",
                          duration: "10:00",
                          readingContent: undefined,
                          dueDate: undefined,
                          dueTime: undefined,
                          maxScore: undefined,
                          latePolicy: undefined,
                        };
                      } else if (value === "Reading") {
                        updatedLesson = {
                          ...updatedLesson,
                          readingContent: "",
                          duration: "10:00",
                          videoUrl: undefined,
                          dueDate: undefined,
                          dueTime: undefined,
                          maxScore: undefined,
                          latePolicy: undefined,
                        };
                      } else if (value === "Assignment") {
                        updatedLesson = {
                          ...updatedLesson,
                          dueDate: "",
                          dueTime: "23:59",
                          maxScore: 100,
                          latePolicy: "accept",
                          videoUrl: undefined,
                          readingContent: undefined,
                          duration: undefined,
                        };
                      }
                    }

                    return updatedLesson;
                  }
                  return lesson;
                }),
              }
            : module
        ),
      }));
    }
  };

  // Delete module
  const handleDeleteModule = (moduleId) => {
    setCourseData((prev) => {
      const updatedModules = prev.modules
        .filter((m) => m.id !== moduleId)
        .map((module, index) => {
          // Reorder only if not custom named
          if (!module.isCustomName) {
            return {
              ...module,
              title: `New Module ${index + 1}`,
            };
          }
          return module;
        });

      return {
        ...prev,
        modules: updatedModules,
      };
    });

    if (selectedLesson?.moduleId === moduleId) {
      setSelectedLesson(null);
      setLessonForm({
        title: "",
        type: "Video",
        duration: "10:00",
        description: "",
        files: [],
      });
    }
  };

  // Delete lesson
  const handleDeleteLesson = (moduleId, lessonId) => {
    setCourseData((prev) => ({
      ...prev,
      modules: prev.modules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              lessons: module.lessons
                .filter((l) => l.id !== lessonId)
                .map((lesson, index) => {
                  // Reorder only if not custom named
                  if (!lesson.isCustomName) {
                    return {
                      ...lesson,
                      title: `New Lesson ${index + 1}`,
                    };
                  }
                  return lesson;
                }),
            }
          : module
      ),
    }));

    if (selectedLesson?.lessonId === lessonId) {
      setSelectedLesson(null);
      setLessonForm({
        title: "",
        type: "Video",
        duration: "10:00",
        description: "",
        files: [],
      });
    }
  };

  // Rename module
  const handleRenameModule = (moduleId, newTitle) => {
    setCourseData((prev) => ({
      ...prev,
      modules: prev.modules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              title: newTitle,
              isCustomName: true, // Mark as custom named
            }
          : module
      ),
    }));
  };

  // Rename lesson
  const handleRenameLesson = (moduleId, lessonId, newTitle) => {
    setCourseData((prev) => ({
      ...prev,
      modules: prev.modules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              lessons: module.lessons.map((lesson) =>
                lesson.id === lessonId
                  ? {
                      ...lesson,
                      title: newTitle,
                      isCustomName: true, // Mark as custom named
                    }
                  : lesson
              ),
            }
          : module
      ),
    }));

    // Update lessonForm if this is the selected lesson
    if (selectedLesson?.lessonId === lessonId) {
      setLessonForm((prev) => ({
        ...prev,
        title: newTitle,
      }));
    }
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    handleLessonFormChange("files", [...lessonForm.files, ...files]);
  };

  // Remove file
  const handleRemoveFile = (index) => {
    const newFiles = lessonForm.files.filter((_, i) => i !== index);
    handleLessonFormChange("files", newFiles);
  };

  // Get current module and lesson info for navigation
  const getCurrentModuleLesson = () => {
    if (!selectedLesson) return null;
    const module = courseData.modules.find((m) => m.id === selectedLesson.moduleId);
    const lesson = module?.lessons.find((l) => l.id === selectedLesson.lessonId);
    const lessonIndex = module?.lessons.findIndex((l) => l.id === selectedLesson.lessonId);
    return { module, lesson, lessonIndex };
  };

  // Navigate to previous lesson
  const handlePreviousLesson = () => {
    const info = getCurrentModuleLesson();
    if (!info) return;

    const { module, lessonIndex } = info;
    if (lessonIndex > 0) {
      // Previous lesson in same module
      const prevLesson = module.lessons[lessonIndex - 1];
      handleSelectLesson(selectedLesson.moduleId, prevLesson.id);
    } else {
      // Previous module's last lesson
      const moduleIndex = courseData.modules.findIndex((m) => m.id === selectedLesson.moduleId);
      if (moduleIndex > 0) {
        const prevModule = courseData.modules[moduleIndex - 1];
        if (prevModule.lessons.length > 0) {
          const lastLesson = prevModule.lessons[prevModule.lessons.length - 1];
          handleSelectLesson(prevModule.id, lastLesson.id);
        }
      }
    }
  };

  // Navigate to next lesson
  const handleNextLesson = () => {
    const info = getCurrentModuleLesson();
    if (!info) return;

    const { module, lessonIndex } = info;
    if (lessonIndex < module.lessons.length - 1) {
      // Next lesson in same module
      const nextLesson = module.lessons[lessonIndex + 1];
      handleSelectLesson(selectedLesson.moduleId, nextLesson.id);
    } else {
      // Next module's first lesson
      const moduleIndex = courseData.modules.findIndex((m) => m.id === selectedLesson.moduleId);
      if (moduleIndex < courseData.modules.length - 1) {
        const nextModule = courseData.modules[moduleIndex + 1];
        if (nextModule.lessons.length > 0) {
          const firstLesson = nextModule.lessons[0];
          handleSelectLesson(nextModule.id, firstLesson.id);
        }
      }
    }
  };

  const hasPreviousLesson = () => {
    if (!selectedLesson) return false;
    const info = getCurrentModuleLesson();
    if (!info) return false;
    const { lessonIndex } = info;
    const moduleIndex = courseData.modules.findIndex((m) => m.id === selectedLesson.moduleId);
    return lessonIndex > 0 || moduleIndex > 0;
  };

  const hasNextLesson = () => {
    if (!selectedLesson) return false;
    const info = getCurrentModuleLesson();
    if (!info) return false;
    const { module, lessonIndex } = info;
    const moduleIndex = courseData.modules.findIndex((m) => m.id === selectedLesson.moduleId);
    return lessonIndex < module.lessons.length - 1 || moduleIndex < courseData.modules.length - 1;
  };

  return (
    <>
      <div style={{ minHeight: "100vh", background: "#f8f9fa" }}>
        {/* Header */}
        <div className="edit-course-header">
          <Container fluid>
            <Row className="align-items-center">
              <Col md={6}>
                <div className="d-flex align-items-center gap-2">
                  <button className="edit-back-btn" onClick={() => navigate(-1)}>
                    Back
                  </button>
                  <div>
                    <h1 className="edit-course-title">{courseData.title}</h1>
                    <p className="edit-instructor-name">{courseData.instructor}</p>
                  </div>
                </div>
              </Col>
              <Col md={6}>
                {/* <div
                  className="d-flex justify-content-end align-items-center"
                  style={{ gap: "0.75rem" }}
                >
                  <span style={{ fontSize: "0.9rem", color: "#333" }}>Progress</span>
                  <span style={{ fontSize: "0.9rem", color: "#333" }}>
                    {Math.round(
                      (courseData.modules.reduce(
                        (acc, mod) => acc + mod.lessons.filter((l) => l.isCompleted).length,
                        0
                      ) /
                        Math.max(
                          courseData.modules.reduce((acc, mod) => acc + mod.lessons.length, 0),
                          1
                        )) *
                        100
                    )}
                    %
                  </span>
                  <div
                    style={{
                      width: "120px",
                      height: "8px",
                      backgroundColor: "#e0e0e0",
                      borderRadius: "10px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        backgroundColor: "#2196f3",
                        transition: "width 0.3s ease",
                        width: `${Math.round(
                          (courseData.modules.reduce(
                            (acc, mod) => acc + mod.lessons.filter((l) => l.isCompleted).length,
                            0
                          ) /
                            Math.max(
                              courseData.modules.reduce((acc, mod) => acc + mod.lessons.length, 0),
                              1
                            )) *
                            100
                        )}%`,
                      }}
                    />
                  </div>
                </div> */}
              </Col>
            </Row>
          </Container>
        </div>

        <Row className="g-0">
          {/* Sidebar */}
          <Col md={4} lg={3}>
            <div className="edit-sidebar">
              <h1 className="edit-sidebar-title">Course's Content</h1>

              {/* Add Module Button */}
              <button className="edit-add-module-btn" onClick={handleAddModule}>
                <span className="edit-add-icon">
                  <FiFolderPlus />
                </span>
                Add Module
              </button>

              {/* Modules */}
              {courseData.modules.map((module) => (
                <div key={module.id} className="edit-section">
                  <div className="edit-section-header">
                    <div className="edit-section-title-row">
                      {editingModule === module.id ? (
                        <Form.Control
                          type="text"
                          className="edit-module-name-input"
                          defaultValue={module.title}
                          autoFocus
                          onBlur={(e) => {
                            handleRenameModule(module.id, e.target.value);
                            setEditingModule(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleRenameModule(module.id, e.target.value);
                              setEditingModule(null);
                            } else if (e.key === "Escape") {
                              setEditingModule(null);
                            }
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <div
                          className="edit-section-title"
                          onDoubleClick={() => setEditingModule(module.id)}
                          title="Double-click to rename"
                        >
                          {module.title}
                        </div>
                      )}
                      <button
                        className="edit-delete-icon"
                        onClick={() => handleDeleteModule(module.id)}
                        title="Delete module"
                      >
                        <MdDeleteOutline />
                      </button>
                    </div>
                    <span className="edit-section-info">{module.lessons.length} lessons</span>
                  </div>

                  {/* Lessons */}
                  {module.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className={`edit-lesson-item ${
                        selectedLesson?.lessonId === lesson.id ? "edit-active" : ""
                      } ${lesson.isCompleted ? "edit-completed" : ""}`}
                      onClick={() => handleSelectLesson(module.id, lesson.id)}
                    >
                      <div className="edit-lesson-header-row">
                        <div className="edit-lesson-left">
                          <div className="edit-lesson-status-icon">
                            {lesson.isCompleted ? (
                              <div className="edit-check-icon">✓</div>
                            ) : (
                              <div className="edit-empty-circle"></div>
                            )}
                          </div>
                          <div className="edit-lesson-type-icon">
                            {lesson.type === "Video"
                              ? "🎥"
                              : lesson.type === "Reading"
                                ? "📄"
                                : "📝"}
                          </div>
                          {editingLesson === lesson.id ? (
                            <Form.Control
                              type="text"
                              className="edit-lesson-name-input"
                              defaultValue={lesson.title}
                              autoFocus
                              onBlur={(e) => {
                                handleRenameLesson(module.id, lesson.id, e.target.value);
                                setEditingLesson(null);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleRenameLesson(module.id, lesson.id, e.target.value);
                                  setEditingLesson(null);
                                } else if (e.key === "Escape") {
                                  setEditingLesson(null);
                                }
                              }}
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <span
                              className="edit-lesson-title-sidebar"
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                setEditingLesson(lesson.id);
                              }}
                              title="Double-click to rename"
                            >
                              {lesson.title}
                            </span>
                          )}
                        </div>
                        <button
                          className="edit-lesson-delete-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteLesson(module.id, lesson.id);
                          }}
                          title="Delete lesson"
                        >
                          <MdDeleteOutline />
                        </button>
                      </div>
                      <div className="edit-lesson-meta-row">
                        <Form.Select
                          className="edit-lesson-type-select-sidebar"
                          value={lesson.type}
                          onChange={(e) => {
                            e.stopPropagation();
                            const newType = e.target.value;

                            // Update courseData with type-specific field changes
                            setCourseData((prev) => ({
                              ...prev,
                              modules: prev.modules.map((m) =>
                                m.id === module.id
                                  ? {
                                      ...m,
                                      lessons: m.lessons.map((l) => {
                                        if (l.id === lesson.id) {
                                          let updatedLesson = { ...l, type: newType };

                                          // Reset type-specific fields based on new type
                                          if (newType === "Video") {
                                            updatedLesson = {
                                              ...updatedLesson,
                                              videoUrl: "",
                                              duration: "10:00",
                                              readingContent: undefined,
                                              dueDate: undefined,
                                              dueTime: undefined,
                                              maxScore: undefined,
                                              latePolicy: undefined,
                                            };
                                          } else if (newType === "Reading") {
                                            updatedLesson = {
                                              ...updatedLesson,
                                              readingContent: "",
                                              duration: "10:00",
                                              videoUrl: undefined,
                                              dueDate: undefined,
                                              dueTime: undefined,
                                              maxScore: undefined,
                                              latePolicy: undefined,
                                            };
                                          } else if (newType === "Assignment") {
                                            updatedLesson = {
                                              ...updatedLesson,
                                              dueDate: "",
                                              dueTime: "23:59",
                                              maxScore: 100,
                                              latePolicy: "accept",
                                              videoUrl: undefined,
                                              readingContent: undefined,
                                              duration: undefined,
                                            };
                                          }

                                          return updatedLesson;
                                        }
                                        return l;
                                      }),
                                    }
                                  : m
                              ),
                            }));

                            // If this lesson is currently selected, update lessonForm too
                            if (
                              selectedLesson?.lessonId === lesson.id &&
                              selectedLesson?.moduleId === module.id
                            ) {
                              setLessonForm((prev) => {
                                let updatedForm = { ...prev, type: newType };

                                // Reset type-specific fields based on new type
                                if (newType === "Video") {
                                  updatedForm = {
                                    ...updatedForm,
                                    videoUrl: "",
                                    duration: "10:00",
                                    readingContent: undefined,
                                    dueDate: undefined,
                                    dueTime: undefined,
                                    maxScore: undefined,
                                    latePolicy: undefined,
                                  };
                                } else if (newType === "Reading") {
                                  updatedForm = {
                                    ...updatedForm,
                                    readingContent: "",
                                    duration: "10:00",
                                    videoUrl: undefined,
                                    dueDate: undefined,
                                    dueTime: undefined,
                                    maxScore: undefined,
                                    latePolicy: undefined,
                                  };
                                } else if (newType === "Assignment") {
                                  updatedForm = {
                                    ...updatedForm,
                                    dueDate: "",
                                    dueTime: "23:59",
                                    maxScore: 100,
                                    latePolicy: "accept",
                                    videoUrl: undefined,
                                    readingContent: undefined,
                                    duration: undefined,
                                  };
                                }

                                return updatedForm;
                              });
                            }
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <option value="Video">Video</option>
                          <option value="Reading">Reading</option>
                          <option value="Assignment">Assignment</option>
                        </Form.Select>
                        <span className="edit-lesson-duration-sidebar">
                          {lesson.type === "Assignment" && lesson.dueDate
                            ? `${new Date(lesson.dueDate).toLocaleDateString("en-GB")}`
                            : lesson.duration || "10:00"}
                        </span>
                      </div>
                      {/* <div
                        className="edit-lesson-upload-row"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectLesson(module.id, lesson.id);
                        }}
                      >
                        <span className="edit-upload-icon-small">⬆</span>
                        <span className="edit-upload-text-small">Upload file, url</span>
                      </div> */}
                    </div>
                  ))}

                  {/* Add Lesson Button */}
                  <button
                    className="edit-add-lesson-btn"
                    onClick={() => handleAddLesson(module.id)}
                  >
                    <span className="edit-add-icon">📄</span>
                    Add New Lesson
                  </button>
                </div>
              ))}
            </div>
          </Col>

          {/* Main Content */}
          <Col md={8} lg={9}>
            <div className="edit-main-content" ref={mainContentRef}>
              {courseData.modules.length === 0 ? (
                // Empty state - no modules
                <div className="edit-empty-state">
                  <div className="edit-empty-icon">😊</div>
                  <h2 className="edit-empty-title">Nothing yet</h2>
                  <p className="edit-empty-text">Create a new module to start</p>
                  <button className="edit-create-module-btn" onClick={handleAddModule}>
                    <span className="edit-add-icon">📁</span>
                    Create new module
                  </button>
                </div>
              ) : !selectedLesson ? (
                // Empty state - no lesson selected
                <div className="edit-empty-state">
                  <div className="edit-empty-icon">📝</div>
                  <h2 className="edit-empty-title">No lesson selected</h2>
                  <p className="edit-empty-text">
                    Select a lesson from the sidebar or create a new one
                  </p>
                </div>
              ) : (
                // Lesson editing form
                <>
                  <div className="edit-lesson-header">
                    {/* Assignment Tabs - moved above title */}
                    {lessonForm.type === "Assignment" && (
                      <div className="edit-assignment-tabs mb-3">
                        <button
                          className={`edit-tab-btn ${assignmentActiveTab === "edit" ? "active" : ""}`}
                          onClick={() => setAssignmentActiveTab("edit")}
                        >
                          Edit Assignment
                        </button>
                        <button
                          className={`edit-tab-btn ${assignmentActiveTab === "grade" ? "active" : ""}`}
                          onClick={() => setAssignmentActiveTab("grade")}
                        >
                          Grade Assignments
                        </button>
                      </div>
                    )}

                    {/* Only show lesson editing form for non-Assignment or Edit tab */}
                    {(lessonForm.type !== "Assignment" || assignmentActiveTab === "edit") && (
                      <>
                        <div className="edit-lesson-category">
                          {getCurrentModuleLesson()?.module?.title || "Module"}
                        </div>
                        <Form.Group className="mb-3">
                          <Form.Control
                            type="text"
                            className="edit-lesson-title-input"
                            value={lessonForm.title}
                            onChange={(e) => handleLessonFormChange("title", e.target.value)}
                            placeholder="Lesson title"
                          />
                        </Form.Group>
                        <div className="edit-lesson-meta">
                          <span className="edit-lesson-type-display">
                            {lessonForm.type === "Video"
                              ? "🎥 Video"
                              : lessonForm.type === "Reading"
                                ? "📄 Reading"
                                : "📝 Assignment"}
                          </span>
                          {lessonForm.type !== "Assignment" && (
                            <>
                              <span>•</span>
                              <Form.Control
                                type="text"
                                className="edit-lesson-duration-input"
                                value={lessonForm.duration}
                                onChange={(e) => handleLessonFormChange("duration", e.target.value)}
                                placeholder="10:00"
                              />
                            </>
                          )}
                          {lessonForm.type === "Assignment" && (
                            <>
                              <span
                                style={{ marginLeft: "20px", fontSize: "1.4rem", color: "#000" }}
                              >
                                Deadline
                              </span>
                              <Form.Control
                                type="date"
                                className="edit-lesson-deadline-date-input"
                                value={lessonForm.dueDate || ""}
                                onChange={(e) => handleLessonFormChange("dueDate", e.target.value)}
                              />
                              <Form.Control
                                type="time"
                                className="edit-lesson-deadline-time-input"
                                value={lessonForm.dueTime || "23:59"}
                                onChange={(e) => handleLessonFormChange("dueTime", e.target.value)}
                              />
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Content Container */}
                  <div className="edit-content-container">
                    {lessonForm.type === "Video" && (
                      <VideoLessonContent
                        lessonForm={lessonForm}
                        onFormChange={handleLessonFormChange}
                        onFileUpload={handleFileUpload}
                        onRemoveFile={handleRemoveFile}
                      />
                    )}

                    {lessonForm.type === "Reading" && (
                      <ReadingLessonContent
                        lessonForm={lessonForm}
                        onFormChange={handleLessonFormChange}
                        onFileUpload={handleFileUpload}
                        onRemoveFile={handleRemoveFile}
                      />
                    )}

                    {lessonForm.type === "Assignment" &&
                      (assignmentActiveTab === "edit" ? (
                        <AssignmentLessonContent
                          lessonForm={lessonForm}
                          onFormChange={handleLessonFormChange}
                          onFileUpload={handleFileUpload}
                          onRemoveFile={handleRemoveFile}
                        />
                      ) : (
                        <div className="edit-assignment-grading-wrapper">
                          <AssignmentGradingDetail
                            lessonForm={lessonForm}
                            courseData={courseData}
                          />
                        </div>
                      ))}
                  </div>

                  {/* Navigation */}
                  <div className="edit-lesson-navigation">
                    <button
                      className={`edit-nav-btn ${!hasPreviousLesson() ? "edit-disabled" : ""}`}
                      onClick={handlePreviousLesson}
                      disabled={!hasPreviousLesson()}
                    >
                      ← Previous lesson
                    </button>
                    <div className="edit-lesson-progress">
                      Lesson {(getCurrentModuleLesson()?.lessonIndex ?? -1) + 1} /{" "}
                      {getCurrentModuleLesson()?.module?.lessons.length || 0} -{" "}
                      {getCurrentModuleLesson()?.module?.title || ""}
                    </div>
                    <button
                      className={`edit-nav-btn edit-next ${!hasNextLesson() ? "edit-disabled" : ""}`}
                      onClick={handleNextLesson}
                      disabled={!hasNextLesson()}
                    >
                      Next lesson →
                    </button>
                  </div>
                </>
              )}
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default EditCourseView;
