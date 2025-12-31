import { useState, useRef, useEffect } from "react";
import { Container, Row, Col, Button, Form, Modal } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { FiFolderPlus } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";

import VideoLessonContent from "./VideoLessonContent";
import ReadingLessonContent from "./ReadingLessonContent";
import AssignmentLessonContent from "./AssignmentLessonContent";
import AssignmentGradingDetail from "./AssignmentGradingDetail";

import "./EditCourseView.css";
import { toast } from "sonner";
const API_URL = import.meta.env.VITE_API_URL;

const EditCourseView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mainContentRef = useRef(null);
  const [assignmentActiveTab, setAssignmentActiveTab] = useState("edit");
  const [showCourseSettingsModal, setShowCourseSettingsModal] = useState(false);

  const [courseData, setCourseData] = useState({
    title: "Demo Course",
    instructor: "Instructor Name",
    modules: [],
  });
  const [loading, setLoading] = useState(false);

  const fetchCourseDetails = async (courseId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const userStr = localStorage.getItem("user");
      const user = JSON.parse(userStr);

      // Fetch course materials
      const materialsResponse = await fetch(`${API_URL}/courses/${courseId}/materials`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const materialsResult = await materialsResponse.json();

      if (!materialsResponse.ok) {
        throw new Error(materialsResult.message || "Failed to load course materials");
      }

      // Fetch course details
      const courseResponse = await fetch(`${API_URL}/courses/${courseId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const courseResult = await courseResponse.json();

      if (!courseResponse.ok) {
        throw new Error("Failed to load course details");
      }

      const course = courseResult.data || courseResult;
      const materials = materialsResult.data;

      // Normalize modules and lessons
      const normalizedModules = (materials.modules || []).map((m) => ({
        id: m.id,
        title: m.title,
        position: m.order ?? m.position,
        lessons: (m.lessons || []).map((l) => {
          // Map content type
          const lessonType = mapContentTypeToUI(l.type || l.contentType);

          // Convert duration to MM:SS format
          const durationSec = l.duration || l.durationSec || 600;
          const duration = `${Math.floor(durationSec / 60)}:${String(durationSec % 60).padStart(2, "0")}`;

          const lesson = {
            id: l.id,
            title: l.title,
            type: lessonType,
            description: l.content || l.description || "",
            duration: duration,
            isCompleted: l.isCompleted || false,
          };

          // Handle VIDEO type
          if (lessonType === "Video" && l.mediaUrl) {
            lesson.videoUrl = l.mediaUrl;
          }

          // Handle READING type
          if (lessonType === "Reading" && l.content) {
            lesson.readingContent = l.content;
          }

          // Handle ASSIGNMENT type - use nested assignment data if available
          if (lessonType === "Assignment") {
            lesson.assignmentId = l.assignmentId;

            // Use nested assignment data from API response
            if (l.assignment) {
              const assignment = l.assignment;
              lesson.description = assignment.description || "";
              lesson.maxPoints = assignment.maxPoints || 100;
              lesson.maxScore = assignment.maxPoints || 100;

              // Map dueDate
              if (assignment.dueDate) {
                const dueDateTime = new Date(assignment.dueDate);
                lesson.dueDate = dueDateTime.toISOString().split("T")[0]; // YYYY-MM-DD
                lesson.dueTime = dueDateTime.toTimeString().slice(0, 5); // HH:MM
              }
            }
          }

          return lesson;
        }),
      }));

      setCourseData({
        id: course.id,
        title: course.title || "Untitled Course",
        description: course.description || course.shortDesc || "",
        instructor: course.instructor?.name || course.instructor?.fullName || "Instructor Name",
        image: course.coverImage || course.thumbnail || course.image || "",
        status: course.published ? "published" : "draft",
        modules: normalizedModules,
        level: course.level || "",
        language: course.language,
        price: course.price,
        rating: course.rating,
        enrollmentCount: course.enrolledStudents || course.enrollmentCount || course.students || 0,
      });
    } catch (error) {
      console.error("Error fetching course:", error);
      toast.error("Failed to load course details: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  // Load course data from navigation state or fetch from API
  useEffect(() => {
    if (location.state?.courseData) {
      const course = location.state.courseData;

      // If we have a course ID, fetch full details from API
      if (course.id) {
        fetchCourseDetails(course.id);
      } else {
        // Fallback: use data from navigation state
        setCourseData({
          id: course.id,
          title: course.title,
          description: course.description,
          instructor: "Instructor Name",
          image: course.image,
          status: course.status,
          modules: course.modules || [],
        });
      }
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

  // Map between backend contentType values and UI labels
  const mapContentTypeToUI = (contentType) => {
    if (!contentType) return "Video";
    const ct = String(contentType).toLowerCase();
    if (ct === "video") return "Video";
    if (ct === "article") return "Reading";
    if (ct === "file" || ct === "assignment") return "Assignment";
    return ct.charAt(0).toUpperCase() + ct.slice(1);
  };

  const mapUIToContentType = (uiType) => {
    if (!uiType) return "video";
    if (uiType === "Video") return "video";
    if (uiType === "Reading") return "article";
    if (uiType === "Assignment") return "assignment";
    return String(uiType).toLowerCase();
  };

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
      console.log(
        "Selecting lesson:",
        lesson.title,
        "videoUrl:",
        lesson.videoUrl,
        "mediaUrl:",
        lesson.mediaUrl
      );
      setSelectedLesson({ moduleId, lessonId });
      setLessonForm(lesson);
      if (lesson.type === "Assignment") {
        setAssignmentActiveTab("edit");
      }
    }
  };

  // Update lesson form
  const handleLessonFormChange = (field, value) => {
    // Validate dueDate for Assignment lessons - must be in the future
    if (field === "dueDate" && value) {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        toast.error("Due date must be in the future");
        return;
      }
    }

    // Validate combined dueDate and dueTime
    if (field === "dueTime" && value) {
      const dueDate = lessonForm.dueDate;
      if (dueDate) {
        const selectedDateTime = new Date(dueDate + "T" + value);
        const now = new Date();

        if (selectedDateTime <= now) {
          toast.error("Due date and time must be in the future");
          return;
        }
      }
    }

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
  const lessonFilesRef = useRef({}); // key = lessonId, value = array of File objects

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!lessonFilesRef.current[selectedLesson.lessonId]) {
      lessonFilesRef.current[selectedLesson.lessonId] = [];
    }
    lessonFilesRef.current[selectedLesson.lessonId].push(...files);

    // Update state with metadata only (for UI)
    handleLessonFormChange("files", [
      ...(lessonForm.files || []),
      ...files.map((file) => ({
        filename: file.name,
        mimeType: file.type,
        id: undefined,
        lessonId: selectedLesson.lessonId,
      })),
    ]);
  };

  // Remove file
  const handleRemoveFile = (index) => {
    const newFiles = lessonForm.files.filter((_, i) => i !== index);
    handleLessonFormChange("files", newFiles);
  };

  const uploadLessonFiles = async (lessonId, files) => {
    const token = localStorage.getItem("accessToken");
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file, file.name);
    });

    const response = await fetch(`${API_URL}/lessons/${lessonId}/resources`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload files");
    }

    return response.json(); // returns uploaded file info (id, url, etc.)
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

  const handleSaveCourse = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      const userStr = localStorage.getItem("user");

      if (!token || !userStr) {
        toast.error("Please login first to update course.");
        return;
      }

      const user = JSON.parse(userStr);
      const authId = user.id;

      // Deep snapshot for logging
      const course = JSON.parse(JSON.stringify(courseData));

      // Create Assignment resources for NEW assignment lessons only
      // Existing assignments will be updated via the course update endpoint
      for (const module of course.modules || []) {
        for (const lesson of module.lessons || []) {
          if (lesson.type === "Assignment" && !lesson.assignmentId) {
            // build assignment payload
            const assignmentPayload = {
              courseId: course.id,
              title: lesson.title || "Assignment",
              description: lesson.description || lesson.content || "",
              dueDate:
                lesson.dueDate && lesson.dueTime
                  ? new Date(lesson.dueDate + "T" + lesson.dueTime).toISOString()
                  : undefined,
              maxPoints: lesson.maxScore || lesson.maxPoints || 100,
            };

            // Create new assignment
            console.log(
              "Creating assignment for lesson",
              lesson.id || lesson.title,
              assignmentPayload
            );

            const resp = await fetch(`${API_URL}/assignments`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(assignmentPayload),
            });

            const created = await resp.json();
            if (!resp.ok) {
              const err =
                created?.data ||
                created?.error?.message ||
                created?.message ||
                "Failed to create assignment";
              throw new Error(err);
            }

            // Try to extract assignment id from common response shapes
            const assignmentId =
              created?.data?.id ||
              created?.id ||
              created?.assignment?.id ||
              (created?.data?.assignment && created.data.assignment.id);
            if (!assignmentId) {
              console.warn("Assignment created but id not found in response:", created);
            } else {
              lesson.assignmentId = assignmentId;
              // ensure lesson contentType set to 'assignment'
              lesson.contentType = "assignment";
            }
          }
        }
      }

      console.log("Save Course Debug:");
      console.log("- User ID (authId):", authId);
      console.log("- Course ID:", course.id);
      console.log("- Full courseData snapshot:", course);

      // Prepare modules data for backend - transform to match backend schema
      const modulesData = course.modules.map((module, moduleIndex) => ({
        id: module.id,
        title: module.title,
        position: moduleIndex,
        lessons: (module.lessons || []).map((lesson, lessonIndex) => {
          console.log("Processing lesson for save:", lesson.title, "Type:", lesson.type);
          console.log("- videoUrl:", lesson.videoUrl);
          console.log("- readingContent:", lesson.readingContent);

          // Determine mediaUrl based on lesson type
          let mediaUrl = null;
          if (lesson.type === "Video" && lesson.videoUrl) {
            mediaUrl = lesson.videoUrl;
            console.log("- Setting mediaUrl for Video:", mediaUrl);
          }

          // For reading lessons, use readingContent in content field
          let content = lesson.description || lesson.content || "";
          if (lesson.type === "Reading" && lesson.readingContent) {
            content = lesson.readingContent;
            console.log("- Setting content for Reading:", content.substring(0, 50));
          }

          const lessonData = {
            id: lesson.id,
            title: lesson.title,
            content: content,
            mediaUrl: mediaUrl || undefined,
            contentType: mapUIToContentType(lesson.type) || "video",
            assignmentId: lesson.assignmentId ? lesson.assignmentId : undefined,
            durationSec: lesson.duration ? parseDurationToSeconds(lesson.duration) : null,
            position: lessonIndex,
          };

          // ✅ THÊM: Luôn gửi assignment fields cho lesson type Assignment
          if (lesson.type === "Assignment") {
            // DueDate
            if (lesson.dueDate) {
              const dueTimeStr = lesson.dueTime || "23:59";
              lessonData.dueDate = new Date(lesson.dueDate + "T" + dueTimeStr).toISOString();
            }

            // MaxPoints
            lessonData.maxPoints = lesson.maxScore || lesson.maxPoints || 100;
          }

          console.log("- Final lesson data:", lessonData);
          return lessonData;
        }),
      }));

      // Backend now accepts: authId, id, title, description, price, level, language, coverImage, modules
      const payload = {
        authId,
        id: course.id,
        title: course.title || "Untitled Course",
        description: course.description || "",
        price: typeof course.price === "number" ? course.price : Number(course.price) || 0,
        level: course.level || null,
        language: course.language || null,
        coverImage: course.thumbnail || course.image || course.coverImage || null,
        modules: modulesData,
      };

      console.log("Sending payload:", payload);

      const response = await fetch(`${API_URL}/courses/${courseData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Save response:", data);

      if (!response.ok) {
        const errorMessage =
          data.data || data.error?.message || data.message || "Update course failed";
        throw new Error(errorMessage);
      }

      for (const module of course.modules || []) {
        console.log(module);
        for (const lesson of module.lessons || []) {
          const realFiles = lessonFilesRef.current[lesson.id] || [];
          if (realFiles.length > 0) {
            await uploadLessonFiles(lesson.id, realFiles);
          }
        }
      }

      toast.success("Course updated successfully!");
      // signal parent page to refresh course list
      try {
        localStorage.setItem("courses_needs_refresh", "1");
      } catch (e) {
        /* ignore */
        console.log(e);
      }
      navigate(-1);
    } catch (error) {
      console.error("Error saving course:", error);
      toast.error("Failed to update course: " + error.message);
    }
  };

  // Helper function to parse duration string to seconds
  const parseDurationToSeconds = (duration) => {
    if (typeof duration === "number") return duration;
    if (!duration || typeof duration !== "string") return null;

    const parts = duration.split(":");
    if (parts.length === 2) {
      // Format: MM:SS
      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    } else if (parts.length === 3) {
      // Format: HH:MM:SS
      return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
    }
    return null;
  };

  return (
    <>
      <div style={{ minHeight: "100vh", background: "#f8f9fa" }}>
        {/* Loading State */}
        {loading && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(255, 255, 255, 0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
            }}
          >
            <div className="text-center">
              <div
                className="spinner-border text-primary"
                role="status"
                style={{ width: "3rem", height: "3rem" }}
              >
                <span className="visually-hidden">Loading...</span>
              </div>
              <div className="mt-3">
                <h5 style={{ color: "#6c757d" }}>Loading course details...</h5>
              </div>
            </div>
          </div>
        )}

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
                <div
                  className="d-flex justify-content-end align-items-center"
                  style={{ gap: "0.75rem" }}
                >
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => setShowCourseSettingsModal(true)}
                    style={{
                      padding: "0.5rem 1rem",
                      borderRadius: "0.375rem",
                      fontWeight: "500",
                    }}
                  >
                    <i className="bi bi-gear me-1"></i>
                    Course Settings
                  </button>
                  <button className="edit-save-btn" onClick={(e) => handleSaveCourse(e)}>
                    Save
                  </button>
                </div>
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

      {/* Course Settings Modal */}
      <Modal
        show={showCourseSettingsModal}
        onHide={() => setShowCourseSettingsModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Course Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Course Title *</Form.Label>
              <Form.Control
                className="edit-course-modal-form-control"
                type="text"
                placeholder="Enter course title"
                value={courseData.title || ""}
                onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                className="edit-course-modal-form-control"
                as="textarea"
                rows={4}
                placeholder="Enter course description"
                value={courseData.description || ""}
                onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price ($)</Form.Label>
                  <Form.Control
                    className="edit-course-modal-form-control"
                    type="number"
                    placeholder="0"
                    min="0"
                    step="0.01"
                    value={courseData.price || 0}
                    onChange={(e) =>
                      setCourseData({ ...courseData, price: parseFloat(e.target.value) || 0 })
                    }
                  />
                  <Form.Text className="text-muted">Set to 0 for free course</Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Level</Form.Label>
                  <Form.Select
                    className="edit-course-modal-form-control"
                    value={courseData.level || "Beginner"}
                    onChange={(e) => setCourseData({ ...courseData, level: e.target.value })}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Language</Form.Label>
                  <Form.Control
                    className="edit-course-modal-form-control"
                    type="text"
                    placeholder="e.g., English, Vietnamese"
                    value={courseData.language || ""}
                    onChange={(e) => setCourseData({ ...courseData, language: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Thumbnail URL</Form.Label>
                  <Form.Control
                    type="text"
                    className="edit-course-modal-form-control"
                    placeholder="https://example.com/image.jpg"
                    value={courseData.thumbnail || courseData.image || ""}
                    onChange={(e) =>
                      setCourseData({
                        ...courseData,
                        thumbnail: e.target.value,
                        image: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>

            {(courseData.thumbnail || courseData.image) && (
              <div className="mb-3 text-center">
                <img
                  src={courseData.thumbnail || courseData.image}
                  alt="Course thumbnail preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "200px",
                    borderRadius: "0.375rem",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCourseSettingsModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setShowCourseSettingsModal(false);
              toast.success("Course settings updated! Don't forget to save.");
            }}
          >
            Apply Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditCourseView;
