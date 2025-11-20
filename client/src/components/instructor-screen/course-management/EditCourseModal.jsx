import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col, InputGroup, Card, Badge } from "react-bootstrap";
import {
  FaTimes,
  FaUpload,
  FaSave,
  FaPlus,
  FaTrash,
  FaChevronUp,
  FaChevronDown,
  FaBars,
  FaVideo,
  FaFile,
  FaLink,
} from "react-icons/fa";

const EditCourseModal = ({ show, onClose, onSave, courseData }) => {
  const [activeTab, setActiveTab] = useState("basic-info");
  const [formData, setFormData] = useState({
    courseName: "",
    description: "",
    category: "",
    level: "",
    durationWeeks: "",
    durationDays: "",
    durationHours: "",
    organization: "",
    language: "Tiếng Việt",
    requirement: "",
    avatar: null,
  });

  const [errors, setErrors] = useState({});
  const [modules, setModules] = useState([
    {
      id: 1,
      name: "New Module",
      lessons: [],
      expanded: true,
    },
  ]);
  const [urlInputMode, setUrlInputMode] = useState({});
  const [tempUrl, setTempUrl] = useState("");

  const categories = [
    "Programming",
    "Web Development",
    "Mobile Development",
    "Data Science",
    "Machine Learning",
    "Design",
    "Business",
    "Marketing",
    "Language Learning",
    "Photography",
    "Music",
    "Health & Fitness",
  ];

  const levels = ["Beginner", "Intermediate", "Advanced", "All Levels"];

  const organizations = [
    "Stanford University",
    "MIT",
    "Harvard University",
    "University of California",
    "Google",
    "Microsoft",
    "Amazon",
    "Meta",
    "IBM",
    "Coursera",
    "Udacity",
    "edX",
  ];

  const languages = [
    "Tiếng Việt",
    "English",
    "Spanish",
    "French",
    "German",
    "Chinese",
    "Japanese",
    "Korean",
  ];

  // Initialize form data when courseData changes
  useEffect(() => {
    if (courseData && show) {
      setFormData({
        courseName: courseData.title || "",
        description: courseData.description || "",
        category: courseData.category || "",
        level: courseData.level || "",
        durationWeeks: courseData.durationWeeks || "",
        durationDays: courseData.durationDays || "",
        durationHours: courseData.durationHours || "",
        organization: courseData.organization || "",
        language: courseData.language || "Tiếng Việt",
        requirement: courseData.requirement || "",
        avatar: courseData.avatar || null,
      });

      // Initialize modules from courseData or set default
      if (courseData.modules && courseData.modules.length > 0) {
        setModules(courseData.modules);
      } else {
        setModules([
          {
            id: 1,
            name: "New Module",
            lessons: [],
            expanded: true,
          },
        ]);
      }
    }
  }, [courseData, show]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.courseName.trim()) {
      newErrors.courseName = "Course name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.level) {
      newErrors.level = "Level is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Combine courseData with updated formData and modules
      const updatedCourseData = {
        ...courseData,
        title: formData.courseName,
        description: formData.description,
        category: formData.category,
        level: formData.level,
        durationWeeks: formData.durationWeeks,
        durationDays: formData.durationDays,
        durationHours: formData.durationHours,
        organization: formData.organization,
        language: formData.language,
        requirement: formData.requirement,
        avatar: formData.avatar,
        modules: modules,
      };

      onSave(updatedCourseData);
      handleClose();
    }
  };

  const handleClose = () => {
    setActiveTab("basic-info");
    setErrors({});
    setModules([
      {
        id: 1,
        name: "New Module",
        lessons: [],
        expanded: true,
      },
    ]);
    onClose();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        avatar: file,
      }));
    }
  };

  // Module and Lesson Management Functions
  const addModule = () => {
    const newModule = {
      id: Date.now(),
      name: "New Module",
      lessons: [],
      expanded: true,
    };
    setModules([...modules, newModule]);
  };

  const deleteModule = (moduleId) => {
    setModules(modules.filter((module) => module.id !== moduleId));
  };

  const updateModuleName = (moduleId, newName) => {
    setModules(
      modules.map((module) => (module.id === moduleId ? { ...module, name: newName } : module))
    );
  };

  const toggleModuleExpansion = (moduleId) => {
    setModules(
      modules.map((module) =>
        module.id === moduleId ? { ...module, expanded: !module.expanded } : module
      )
    );
  };

  const addLesson = (moduleId) => {
    const newLesson = {
      id: Date.now(),
      name: "New lesson 1",
      type: "Video",
      duration: "20 mins",
      content: "",
    };

    setModules(
      modules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              lessons: [
                ...module.lessons,
                {
                  ...newLesson,
                  name: `New lesson ${module.lessons.length + 1}`,
                },
              ],
            }
          : module
      )
    );
  };

  const deleteLesson = (moduleId, lessonId) => {
    setModules(
      modules.map((module) =>
        module.id === moduleId
          ? { ...module, lessons: module.lessons.filter((lesson) => lesson.id !== lessonId) }
          : module
      )
    );
  };

  const updateLessonName = (moduleId, lessonId, newName) => {
    setModules(
      modules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              lessons: module.lessons.map((lesson) =>
                lesson.id === lessonId ? { ...lesson, name: newName } : lesson
              ),
            }
          : module
      )
    );
  };

  const updateLessonType = (moduleId, lessonId, newType) => {
    setModules(
      modules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              lessons: module.lessons.map((lesson) =>
                lesson.id === lessonId ? { ...lesson, type: newType } : lesson
              ),
            }
          : module
      )
    );
  };

  const updateLessonDuration = (moduleId, lessonId, newDuration) => {
    setModules(
      modules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              lessons: module.lessons.map((lesson) =>
                lesson.id === lessonId ? { ...lesson, duration: newDuration } : lesson
              ),
            }
          : module
      )
    );
  };

  const updateLessonContent = (moduleId, lessonId, newContent) => {
    setModules(
      modules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              lessons: module.lessons.map((lesson) =>
                lesson.id === lessonId ? { ...lesson, content: newContent } : lesson
              ),
            }
          : module
      )
    );
  };

  const updateLessonUrl = (moduleId, lessonId, newUrl) => {
    setModules(
      modules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              lessons: module.lessons.map((lesson) =>
                lesson.id === lessonId ? { ...lesson, url: newUrl } : lesson
              ),
            }
          : module
      )
    );
  };

  const handleAddContent = (moduleId, lessonId) => {
    setUrlInputMode({ moduleId, lessonId });
    setTempUrl("");
  };

  const handleSaveUrl = () => {
    if (tempUrl && tempUrl.trim()) {
      updateLessonUrl(urlInputMode.moduleId, urlInputMode.lessonId, tempUrl.trim());
    }
    setUrlInputMode({});
    setTempUrl("");
  };

  const handleCancelUrl = () => {
    setUrlInputMode({});
    setTempUrl("");
  };

  return (
    <>
      <style>
        {`
          .edit-course-modal .form-control::placeholder,
          .edit-course-modal .form-select::placeholder {
            color: #666666 !important;
            opacity: 1 !important;
          }
          .edit-course-modal .form-control::-webkit-input-placeholder,
          .edit-course-modal .form-select::-webkit-input-placeholder {
            color: #666666 !important;
            opacity: 1 !important;
          }
          .edit-course-modal .form-control::-moz-placeholder,
          .edit-course-modal .form-select::-moz-placeholder {
            color: #666666 !important;
            opacity: 1 !important;
          }
          .edit-course-modal .form-control:-ms-input-placeholder,
          .edit-course-modal .form-select:-ms-input-placeholder {
            color: #666666 !important;
            opacity: 1 !important;
          }
          
          .edit-modal-tab-section {
            animation: fadeInUp 0.8s ease-out;
          }
        `}
      </style>

      <Modal show={show} onHide={handleClose} size="lg" centered className="edit-course-modal">
        <Modal.Header
          className="border-0 pb-0 d-flex justify-content-between align-items-center"
          style={{ backgroundColor: "white", color: "black", position: "relative" }}
        >
          <Modal.Title className="fw-bold fs-4" style={{ color: "black" }}>
            Edit course: {courseData?.title || "Course"}
          </Modal.Title>
          <Button
            variant="outline-secondary"
            className="btn-close-custom border-0 p-2"
            onClick={handleClose}
            style={{
              borderRadius: "8px",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              top: "10px",
              right: "15px",
            }}
          >
            <FaTimes />
          </Button>
        </Modal.Header>

        <Modal.Body className="pt-2" style={{ backgroundColor: "white", color: "black" }}>
          <p className="mb-4" style={{ color: "#666666" }}>
            Manage course's info and lesson content.
          </p>

          {/* Tab Navigation */}
          <div className="mb-4 d-flex justify-content-center edit-modal-tab-section">
            <div
              className="d-flex rounded-3 p-1 shadow-sm"
              style={{
                backgroundColor: "#D9D9D9",
                border: "1px solid #e9ecef",
                height: "45px",
                width: "100%",
                maxWidth: "500px",
              }}
            >
              <div className="flex-fill">
                <div
                  className={`text-center d-flex align-items-center justify-content-center h-100 rounded-3 transition-all ${
                    activeTab === "basic-info"
                      ? "bg-white text-dark shadow-sm"
                      : "text-dark bg-transparent"
                  }`}
                  onClick={() => setActiveTab("basic-info")}
                  style={{
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    fontWeight: activeTab === "basic-info" ? "600" : "500",
                  }}
                >
                  <span style={{ fontSize: "16px", fontWeight: "bold" }}>Basic information</span>
                </div>
              </div>
              <div className="flex-fill">
                <div
                  className={`text-center d-flex align-items-center justify-content-center h-100 rounded-3 transition-all ${
                    activeTab === "lesson-content"
                      ? "bg-white text-dark shadow-sm"
                      : "text-dark bg-transparent"
                  }`}
                  onClick={() => setActiveTab("lesson-content")}
                  style={{
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    fontWeight: activeTab === "lesson-content" ? "600" : "500",
                  }}
                >
                  <span style={{ fontSize: "16px", fontWeight: "bold" }}>Lesson content</span>
                </div>
              </div>
            </div>
          </div>

          <Form onSubmit={handleSubmit}>
            {/* Basic Information Tab */}
            {activeTab === "basic-info" && (
              <>
                <Row>
                  <Col md={7}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold" style={{ color: "black" }}>
                        Course's name <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ex: Machine Learning for beginner"
                        value={formData.courseName}
                        onChange={(e) => handleInputChange("courseName", e.target.value)}
                        isInvalid={!!errors.courseName}
                        style={{
                          backgroundColor: "white",
                          border: "1px solid #e9ecef",
                          borderRadius: "8px",
                          padding: "12px 16px",
                          color: "black",
                        }}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.courseName}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={5}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold" style={{ color: "black" }}>
                        Course's avatar
                      </Form.Label>
                      <div
                        className="d-flex align-items-center justify-content-center border rounded"
                        style={{
                          backgroundColor: "white",
                          height: "56px",
                          borderRadius: "8px",
                          cursor: "pointer",
                          border: "2px dashed #e9ecef",
                        }}
                        onClick={() => document.getElementById("avatar-upload-edit").click()}
                      >
                        <FaUpload className="me-2" style={{ color: "#a0aec0" }} />
                        <span style={{ color: "#a0aec0" }}>
                          {formData.avatar
                            ? typeof formData.avatar === "string"
                              ? "Browse your computer"
                              : formData.avatar.name
                            : "Browse your computer"}
                        </span>
                      </div>
                      <input
                        id="avatar-upload-edit"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold" style={{ color: "black" }}>
                    Description <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Write a short description about this course"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    isInvalid={!!errors.description}
                    style={{
                      backgroundColor: "white",
                      border: "1px solid #e9ecef",
                      borderRadius: "8px",
                      padding: "12px 16px",
                      resize: "vertical",
                      color: "black",
                    }}
                  />
                  <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold" style={{ color: "black" }}>
                        Category <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Select
                        value={formData.category}
                        onChange={(e) => handleInputChange("category", e.target.value)}
                        isInvalid={!!errors.category}
                        style={{
                          backgroundColor: "white",
                          border: "1px solid #e9ecef",
                          borderRadius: "8px",
                          padding: "12px 16px",
                          color: "black",
                        }}
                      >
                        <option value="">Choose category</option>
                        {categories.map((category, index) => (
                          <option key={index} value={category}>
                            {category}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.category}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold" style={{ color: "black" }}>
                        Level <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Select
                        value={formData.level}
                        onChange={(e) => handleInputChange("level", e.target.value)}
                        isInvalid={!!errors.level}
                        style={{
                          backgroundColor: "white",
                          border: "1px solid #e9ecef",
                          borderRadius: "8px",
                          padding: "12px 16px",
                          color: "black",
                        }}
                      >
                        <option value="">Choose level</option>
                        {levels.map((level, index) => (
                          <option key={index} value={level}>
                            {level}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">{errors.level}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold" style={{ color: "black" }}>
                    Duration
                  </Form.Label>
                  <Row>
                    <Col xs={4}>
                      <InputGroup>
                        <Form.Control
                          type="number"
                          placeholder="6"
                          min="1"
                          max="52"
                          value={formData.durationWeeks}
                          onChange={(e) => handleInputChange("durationWeeks", e.target.value)}
                          style={{
                            backgroundColor: "white",
                            border: "1px solid #e9ecef",
                            borderRadius: "8px 0 0 8px",
                            padding: "12px 16px",
                            color: "black",
                          }}
                        />
                        <InputGroup.Text
                          style={{
                            backgroundColor: "#e9ecef",
                            border: "1px solid #e9ecef",
                            borderRadius: "0 8px 8px 0",
                            color: "black",
                          }}
                        >
                          weeks
                        </InputGroup.Text>
                      </InputGroup>
                    </Col>
                    <Col xs={4}>
                      <InputGroup>
                        <Form.Control
                          type="number"
                          placeholder="30"
                          min="1"
                          max="365"
                          value={formData.durationDays}
                          onChange={(e) => handleInputChange("durationDays", e.target.value)}
                          style={{
                            backgroundColor: "white",
                            border: "1px solid #e9ecef",
                            borderRadius: "8px 0 0 8px",
                            padding: "12px 16px",
                            color: "black",
                          }}
                        />
                        <InputGroup.Text
                          style={{
                            backgroundColor: "#e9ecef",
                            border: "1px solid #e9ecef",
                            borderRadius: "0 8px 8px 0",
                            color: "black",
                          }}
                        >
                          days
                        </InputGroup.Text>
                      </InputGroup>
                    </Col>
                    <Col xs={4}>
                      <InputGroup>
                        <Form.Control
                          type="number"
                          placeholder="40"
                          min="1"
                          max="500"
                          value={formData.durationHours}
                          onChange={(e) => handleInputChange("durationHours", e.target.value)}
                          style={{
                            backgroundColor: "white",
                            border: "1px solid #e9ecef",
                            borderRadius: "8px 0 0 8px",
                            padding: "12px 16px",
                            color: "black",
                          }}
                        />
                        <InputGroup.Text
                          style={{
                            backgroundColor: "#e9ecef",
                            border: "1px solid #e9ecef",
                            borderRadius: "0 8px 8px 0",
                            color: "black",
                          }}
                        >
                          hours
                        </InputGroup.Text>
                      </InputGroup>
                    </Col>
                  </Row>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold" style={{ color: "black" }}>
                    Organization
                  </Form.Label>
                  <Form.Select
                    value={formData.organization}
                    onChange={(e) => handleInputChange("organization", e.target.value)}
                    style={{
                      backgroundColor: "white",
                      border: "1px solid #e9ecef",
                      borderRadius: "8px",
                      padding: "12px 16px",
                      color: "black",
                    }}
                  >
                    <option value="">Ex: Stanford University</option>
                    {organizations.map((org, index) => (
                      <option key={index} value={org}>
                        {org}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold" style={{ color: "black" }}>
                    Language
                  </Form.Label>
                  <Form.Select
                    value={formData.language}
                    onChange={(e) => handleInputChange("language", e.target.value)}
                    style={{
                      backgroundColor: "white",
                      border: "1px solid #e9ecef",
                      borderRadius: "8px",
                      padding: "12px 16px",
                      color: "black",
                    }}
                  >
                    {languages.map((lang, index) => (
                      <option key={index} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold" style={{ color: "black" }}>
                    Requirement
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Ex: Have learned Python before"
                    value={formData.requirement}
                    onChange={(e) => handleInputChange("requirement", e.target.value)}
                    style={{
                      backgroundColor: "white",
                      border: "1px solid #e9ecef",
                      borderRadius: "8px",
                      padding: "12px 16px",
                      resize: "vertical",
                      color: "black",
                    }}
                  />
                </Form.Group>
              </>
            )}

            {/* Lesson Content Tab */}
            {activeTab === "lesson-content" && (
              <>
                {/* Module Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="mb-0" style={{ color: "black", fontWeight: "600" }}>
                    Module ({modules.length})
                  </h5>
                  <Button
                    variant="dark"
                    size="sm"
                    className="d-flex align-items-center"
                    onClick={addModule}
                    style={{
                      borderRadius: "8px",
                      fontWeight: "600",
                      padding: "8px 16px",
                    }}
                  >
                    <FaPlus className="me-2" />
                    Add Module
                  </Button>
                </div>

                {/* Modules List */}
                {modules.map((module, moduleIndex) => (
                  <Card
                    key={module.id}
                    className="mb-3"
                    style={{
                      border: "1px solid #e9ecef",
                      borderRadius: "12px",
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    {/* Module Header */}
                    <Card.Header
                      className="d-flex justify-content-between align-items-center"
                      style={{
                        backgroundColor: "#f8f9fa",
                        border: "none",
                        borderRadius: "12px 12px 0 0",
                        padding: "15px 20px",
                      }}
                    >
                      <div className="d-flex align-items-center flex-grow-1">
                        <FaBars className="me-3" style={{ color: "#6c757d" }} />
                        <span style={{ fontWeight: "600", color: "black", marginRight: "15px" }}>
                          Module {moduleIndex + 1}:
                        </span>
                        <Badge
                          bg="light"
                          text="dark"
                          className="me-3"
                          style={{
                            fontSize: "12px",
                            padding: "5px 10px",
                            borderRadius: "15px",
                          }}
                        >
                          <FaFile className="me-1" />
                          {module.lessons.length} Lesson{module.lessons.length !== 1 ? "s" : ""}
                        </Badge>
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => toggleModuleExpansion(module.id)}
                          className="p-0 ms-auto me-3"
                          style={{ color: "#6c757d" }}
                        >
                          {module.expanded ? <FaChevronUp /> : <FaChevronDown />}
                        </Button>
                      </div>
                    </Card.Header>

                    {/* Module Content */}
                    {module.expanded && (
                      <Card.Body style={{ padding: "20px" }}>
                        {/* Module Name Input */}
                        <div className="mb-3">
                          <Form.Label className="fw-semibold" style={{ color: "black" }}>
                            Module's name
                          </Form.Label>
                          <div className="d-flex align-items-center">
                            <Form.Control
                              type="text"
                              value={module.name}
                              onChange={(e) => updateModuleName(module.id, e.target.value)}
                              placeholder="Module name"
                              style={{
                                backgroundColor: "white",
                                border: "1px solid #e9ecef",
                                borderRadius: "8px",
                                padding: "10px 15px",
                                color: "black",
                                marginRight: "10px",
                              }}
                            />
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => deleteModule(module.id)}
                              style={{
                                padding: "8px 12px",
                                borderRadius: "8px",
                              }}
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        </div>

                        {/* Lessons */}
                        {module.lessons.map((lesson, lessonIndex) => (
                          <Card
                            key={lesson.id}
                            className="mb-3"
                            style={{
                              border: "1px solid #e9ecef",
                              borderRadius: "8px",
                              backgroundColor: "white",
                            }}
                          >
                            <Card.Body style={{ padding: "15px" }}>
                              {/* Lesson Header */}
                              <Form.Label className="fw-semibold" style={{ color: "black" }}>
                                Lesson {lessonIndex + 1}: Name
                              </Form.Label>
                              <div className="d-flex align-items-center mb-3">
                                <Form.Control
                                  type="text"
                                  value={lesson.name}
                                  onChange={(e) =>
                                    updateLessonName(module.id, lesson.id, e.target.value)
                                  }
                                  placeholder="Lesson name"
                                  style={{
                                    backgroundColor: "transparent",
                                    padding: "5px 10px",
                                    color: "#007bff",
                                    fontWeight: "600",
                                    fontSize: "16px",
                                    marginRight: "10px",
                                    border: "1px solid #e9ecef",
                                  }}
                                />
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => deleteLesson(module.id, lesson.id)}
                                  style={{
                                    padding: "5px 8px",
                                    borderRadius: "6px",
                                  }}
                                >
                                  <FaTrash />
                                </Button>
                              </div>

                              {/* Lesson Type and Duration */}
                              <Row className="mb-3">
                                <Col md={6}>
                                  <Form.Select
                                    value={lesson.type}
                                    onChange={(e) =>
                                      updateLessonType(module.id, lesson.id, e.target.value)
                                    }
                                    style={{
                                      backgroundColor: "white",
                                      border: "1px solid #e9ecef",
                                      borderRadius: "6px",
                                      padding: "8px 12px",
                                      color: "#007bff",
                                      fontWeight: "500",
                                    }}
                                  >
                                    <option value="Video">Video</option>
                                    <option value="Document">Document</option>
                                    <option value="Quiz">Quiz</option>
                                    <option value="Assignment">Assignment</option>
                                  </Form.Select>
                                </Col>
                                <Col md={6}>
                                  <Form.Control
                                    type="text"
                                    value={lesson.duration}
                                    onChange={(e) =>
                                      updateLessonDuration(module.id, lesson.id, e.target.value)
                                    }
                                    placeholder="20 mins"
                                    style={{
                                      backgroundColor: "white",
                                      border: "1px solid #e9ecef",
                                      borderRadius: "6px",
                                      padding: "8px 12px",
                                      color: "#007bff",
                                      fontWeight: "500",
                                    }}
                                  />
                                </Col>
                              </Row>

                              {/* Add File/Video/URL */}
                              {lesson.type === "Document" ||
                              lesson.type === "Quiz" ||
                              lesson.type === "Assignment" ? (
                                <Form.Control
                                  as="textarea"
                                  rows={10}
                                  value={lesson.content || ""}
                                  onChange={(e) =>
                                    updateLessonContent(module.id, lesson.id, e.target.value)
                                  }
                                  placeholder="Enter document URL, quiz link, or assignment details"
                                  style={{
                                    backgroundColor: "white",
                                    border: "1px solid #e9ecef",
                                    borderRadius: "8px",
                                    padding: "10px 15px",
                                    color: "black",
                                    resize: "vertical",
                                  }}
                                />
                              ) : (
                                <>
                                  {/* Video URL Input */}
                                  {lesson.url ? (
                                    <div className="mb-3">
                                      <Form.Label
                                        className="fw-semibold"
                                        style={{ color: "black", fontSize: "14px" }}
                                      >
                                        Video URL
                                      </Form.Label>
                                      <div className="d-flex align-items-center">
                                        <Form.Control
                                          type="url"
                                          value={lesson.url}
                                          onChange={(e) =>
                                            updateLessonUrl(module.id, lesson.id, e.target.value)
                                          }
                                          placeholder="https://www.youtube.com/watch?v=..."
                                          style={{
                                            backgroundColor: "white",
                                            border: "1px solid #e9ecef",
                                            borderRadius: "6px",
                                            padding: "8px 12px",
                                            color: "black",
                                            marginRight: "10px",
                                          }}
                                        />
                                        <Button
                                          variant="outline-secondary"
                                          size="sm"
                                          onClick={() => updateLessonUrl(module.id, lesson.id, "")}
                                          style={{
                                            padding: "8px 12px",
                                            borderRadius: "6px",
                                          }}
                                        >
                                          <FaTimes />
                                        </Button>
                                      </div>
                                    </div>
                                  ) : urlInputMode.moduleId === module.id &&
                                    urlInputMode.lessonId === lesson.id ? (
                                    <div className="mb-3">
                                      <Form.Label
                                        className="fw-semibold"
                                        style={{ color: "black", fontSize: "14px" }}
                                      >
                                        Enter Video URL
                                      </Form.Label>
                                      <Form.Control
                                        type="url"
                                        value={tempUrl}
                                        onChange={(e) => setTempUrl(e.target.value)}
                                        placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/..."
                                        autoFocus
                                        style={{
                                          backgroundColor: "white",
                                          border: "1px solid #007bff",
                                          borderRadius: "6px",
                                          padding: "8px 12px",
                                          color: "black",
                                          marginBottom: "10px",
                                        }}
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter") handleSaveUrl();
                                          if (e.key === "Escape") handleCancelUrl();
                                        }}
                                      />
                                      <div className="d-flex gap-2">
                                        <Button
                                          variant="primary"
                                          size="sm"
                                          onClick={handleSaveUrl}
                                          disabled={!tempUrl.trim()}
                                          style={{
                                            borderRadius: "6px",
                                            fontWeight: "500",
                                            padding: "6px 12px",
                                          }}
                                        >
                                          Save URL
                                        </Button>
                                        <Button
                                          variant="outline-secondary"
                                          size="sm"
                                          onClick={handleCancelUrl}
                                          style={{
                                            borderRadius: "6px",
                                            fontWeight: "500",
                                            padding: "6px 12px",
                                          }}
                                        >
                                          Cancel
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <Button
                                      variant="outline-primary"
                                      className="w-100 d-flex align-items-center justify-content-center"
                                      style={{
                                        borderRadius: "8px",
                                        padding: "10px",
                                        border: "2px dashed #007bff",
                                        backgroundColor: "transparent",
                                        color: "#007bff",
                                        fontWeight: "500",
                                      }}
                                      onClick={() => handleAddContent(module.id, lesson.id)}
                                    >
                                      <FaLink className="me-2" />
                                      Add video URL
                                    </Button>
                                  )}
                                </>
                              )}
                            </Card.Body>
                          </Card>
                        ))}

                        {/* Add New Lesson Button */}
                        <Button
                          variant="primary"
                          className="w-100 d-flex align-items-center justify-content-center"
                          onClick={() => addLesson(module.id)}
                          style={{
                            borderRadius: "8px",
                            padding: "12px",
                            backgroundColor: "#17a2b8",
                            border: "none",
                            fontWeight: "600",
                          }}
                        >
                          <FaPlus className="me-2" />
                          Add new lesson
                        </Button>
                      </Card.Body>
                    )}
                  </Card>
                ))}
              </>
            )}

            <div className="d-flex justify-content-end">
              <Button
                type="submit"
                variant="dark"
                size="lg"
                className="px-4 py-2"
                style={{
                  borderRadius: "8px",
                  fontWeight: "600",
                  minWidth: "150px",
                }}
              >
                Save changes
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EditCourseModal;
