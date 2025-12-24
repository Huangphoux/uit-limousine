import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col, Badge, Card, InputGroup } from "react-bootstrap";
import {
  FaTimes,
  FaCheckCircle,
  FaUser,
  FaClock,
  FaCalendarAlt,
  FaBook,
  FaBars,
  FaChevronUp,
  FaChevronDown,
  FaFile,
  FaVideo,
  FaExternalLinkAlt,
} from "react-icons/fa";

// Helper function to extract YouTube video ID from URL
const getYouTubeVideoId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

// YouTube embed component
const YouTubeEmbed = ({ url, title }) => {
  const videoId = getYouTubeVideoId(url);

  if (!videoId) {
    return (
      <div className="alert alert-warning d-flex align-items-center">
        <FaExternalLinkAlt className="me-2" />
        <div>
          <strong>Video URL:</strong>
          <a href={url} target="_blank" rel="noopener noreferrer" className="ms-2">
            {url}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-3">
      <div className="ratio ratio-16x9" style={{ borderRadius: "8px", overflow: "hidden" }}>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title || "Video content"}
          allowFullScreen
          style={{
            border: "none",
            borderRadius: "8px",
          }}
        />
      </div>
      <div className="mt-2 d-flex align-items-center text-muted" style={{ fontSize: "12px" }}>
        <FaExternalLinkAlt className="me-1" />
        <a href={url} target="_blank" rel="noopener noreferrer">
          Open in YouTube
        </a>
      </div>
    </div>
  );
};

const CourseApprovalModal = ({ show, onClose, onApprove, onDeny, courseData }) => {
  const [activeTab, setActiveTab] = useState("basic-info");
  const [denialReasonInput, setDenialReasonInput] = useState("");
  const [expandedModules, setExpandedModules] = useState({});

  // Initialize expanded state for all modules when courseData changes
  useEffect(() => {
    if (courseData && courseData.modules && courseData.modules.length > 0) {
      const initialExpandedState = {};
      courseData.modules.forEach((module) => {
        initialExpandedState[module.id] = true; // Start with all modules expanded
      });

      setExpandedModules(initialExpandedState);
    }
  }, [courseData]);

  if (!courseData) return null;

  const {
    title,
    description,
    instructor,
    submittedDate,
    estimatedDuration,
    status,
    category,
    image,
    modules = [],
    organization,
    level,
    language,
    requirement,
    denialReason,
    durationWeeks,
    durationDays,
    durationHours,
  } = courseData;

  const handleApprove = () => {
    onApprove(courseData);
    onClose();
  };

  const handleDeny = () => {
    onDeny(courseData, denialReasonInput.trim());
    onClose();
  };

  const toggleModuleExpansion = (moduleId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  return (
    <Modal show={show} onHide={onClose} size="lg" centered className="edit-course-modal">
      <Modal.Header
        className="border-0 pb-0 d-flex justify-content-between align-items-center"
        style={{ backgroundColor: "white", color: "black", position: "relative" }}
      >
        <Modal.Title className="fw-bold fs-4" style={{ color: "black" }}>
          Course Approval Review: {title || "Course"}
        </Modal.Title>
        <Button
          variant="outline-secondary"
          className="btn-close-custom border-0 p-2"
          onClick={onClose}
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
          Review course details and lesson content for approval.
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

        <Form>
          {/* Basic Information Tab */}
          {activeTab === "basic-info" && (
            <>
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold" style={{ color: "black" }}>
                      Course's name <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={title || ""}
                      readOnly
                      style={{
                        backgroundColor: "#f8f9fa",
                        border: "1px solid #e9ecef",
                        borderRadius: "8px",
                        padding: "12px 16px",
                        color: "black",
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold" style={{ color: "black" }}>
                      Description <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      value={description || ""}
                      readOnly
                      style={{
                        backgroundColor: "#f8f9fa",
                        border: "1px solid #e9ecef",
                        borderRadius: "8px",
                        padding: "12px 16px",
                        color: "black",
                        resize: "none",
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold" style={{ color: "black" }}>
                      Category <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={category || ""}
                      readOnly
                      style={{
                        backgroundColor: "#f8f9fa",
                        border: "1px solid #e9ecef",
                        borderRadius: "8px",
                        padding: "12px 16px",
                        color: "black",
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold" style={{ color: "black" }}>
                      Level <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={level || ""}
                      readOnly
                      style={{
                        backgroundColor: "#f8f9fa",
                        border: "1px solid #e9ecef",
                        borderRadius: "8px",
                        padding: "12px 16px",
                        color: "black",
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold" style={{ color: "black" }}>
                      Duration
                    </Form.Label>
                    <Row>
                      <Col xs={4}>
                        <InputGroup>
                          <Form.Control
                            type="text"
                            value={durationWeeks || ""}
                            readOnly
                            style={{
                              backgroundColor: "#f8f9fa",
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
                            type="text"
                            value={durationDays || ""}
                            readOnly
                            style={{
                              backgroundColor: "#f8f9fa",
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
                            type="text"
                            value={durationHours || ""}
                            readOnly
                            style={{
                              backgroundColor: "#f8f9fa",
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
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold" style={{ color: "black" }}>
                      Organization
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={organization || ""}
                      readOnly
                      style={{
                        backgroundColor: "#f8f9fa",
                        border: "1px solid #e9ecef",
                        borderRadius: "8px",
                        padding: "12px 16px",
                        color: "black",
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold" style={{ color: "black" }}>
                      Language
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={language || ""}
                      readOnly
                      style={{
                        backgroundColor: "#f8f9fa",
                        border: "1px solid #e9ecef",
                        borderRadius: "8px",
                        padding: "12px 16px",
                        color: "black",
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold" style={{ color: "black" }}>
                      Instructor
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={instructor || ""}
                      readOnly
                      style={{
                        backgroundColor: "#f8f9fa",
                        border: "1px solid #e9ecef",
                        borderRadius: "8px",
                        padding: "12px 16px",
                        color: "black",
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold" style={{ color: "black" }}>
                      Submission Date
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={submittedDate || ""}
                      readOnly
                      style={{
                        backgroundColor: "#f8f9fa",
                        border: "1px solid #e9ecef",
                        borderRadius: "8px",
                        padding: "12px 16px",
                        color: "black",
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold" style={{ color: "black" }}>
                      Requirement
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={requirement || ""}
                      readOnly
                      style={{
                        backgroundColor: "#f8f9fa",
                        border: "1px solid #e9ecef",
                        borderRadius: "8px",
                        padding: "12px 16px",
                        color: "black",
                        resize: "none",
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold" style={{ color: "black" }}>
                      Denied reason (if have)
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={denialReasonInput}
                      onChange={(e) => setDenialReasonInput(e.target.value)}
                      placeholder="Enter reason for denial if needed..."
                      style={{
                        backgroundColor: "white",
                        border: "1px solid #e9ecef",
                        borderRadius: "8px",
                        padding: "12px 16px",
                        color: "black",
                        resize: "none",
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Status and Denial Reason */}
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold" style={{ color: "black" }}>
                      Status
                    </Form.Label>
                    <div>
                      <Badge
                        bg={
                          status?.toLowerCase() === "waiting"
                            ? "warning"
                            : status?.toLowerCase() === "approved"
                              ? "success"
                              : "danger"
                        }
                        style={{ fontSize: "14px", padding: "8px 16px" }}
                      >
                        {status}
                      </Badge>
                    </div>
                  </Form.Group>
                </Col>
                {denialReason && (
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold text-danger">
                        Previous Denial Reason
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={denialReason}
                        readOnly
                        style={{
                          backgroundColor: "#f8d7da",
                          border: "1px solid #f5c6cb",
                          borderRadius: "8px",
                          padding: "12px 16px",
                          color: "#721c24",
                          resize: "none",
                        }}
                      />
                    </Form.Group>
                  </Col>
                )}
              </Row>
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
              </div>

              {/* Modules List - Read Only */}
              {modules.length > 0 ? (
                modules.map((module, moduleIndex) => (
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
                          Module {moduleIndex + 1}: {module.title || module.name}
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
                          {module.lessons?.length || 0} Lesson
                          {module.lessons?.length !== 1 ? "s" : ""}
                        </Badge>
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => toggleModuleExpansion(module.id)}
                          className="p-0 ms-auto me-3"
                          style={{ color: "#6c757d" }}
                        >
                          {expandedModules[module.id] ? <FaChevronUp /> : <FaChevronDown />}
                        </Button>
                      </div>
                    </Card.Header>

                    {/* Module Content - Lessons */}
                    {expandedModules[module.id] && (
                      <Card.Body style={{ padding: "20px" }}>
                        {module.lessons && module.lessons.length > 0 ? (
                          module.lessons.map((lesson, lessonIndex) => (
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
                                {/* Lesson Name */}
                                <div className="mb-3">
                                  <Form.Label className="fw-semibold" style={{ color: "black" }}>
                                    Lesson {lessonIndex + 1}: {lesson.title || lesson.name}
                                  </Form.Label>
                                </div>

                                {/* Lesson Type and Duration */}
                                <Row className="mb-3">
                                  <Col md={6}>
                                    <Form.Group>
                                      <Form.Label
                                        className="fw-semibold"
                                        style={{ color: "black", fontSize: "14px" }}
                                      >
                                        Type
                                      </Form.Label>
                                      <div className="d-flex align-items-center">
                                        {lesson.type === "Video" && (
                                          <FaVideo className="me-2 text-primary" />
                                        )}
                                        {lesson.type === "Document" && (
                                          <FaFile className="me-2 text-info" />
                                        )}
                                        <Badge
                                          bg={lesson.type === "Video" ? "primary" : "info"}
                                          style={{ fontSize: "12px" }}
                                        >
                                          {lesson.type}
                                        </Badge>
                                      </div>
                                    </Form.Group>
                                  </Col>
                                  <Col md={6}>
                                    <Form.Group>
                                      <Form.Label
                                        className="fw-semibold"
                                        style={{ color: "black", fontSize: "14px" }}
                                      >
                                        Duration
                                      </Form.Label>
                                      <div style={{ color: "#6c757d", fontSize: "14px" }}>
                                        {lesson.duration || "Not specified"}
                                      </div>
                                    </Form.Group>
                                  </Col>
                                </Row>

                                {/* Lesson Content */}
                                {lesson.content && (
                                  <Form.Group className="mb-3">
                                    <Form.Label
                                      className="fw-semibold"
                                      style={{ color: "black", fontSize: "14px" }}
                                    >
                                      Content
                                    </Form.Label>
                                    <Form.Control
                                      as="textarea"
                                      rows={3}
                                      value={lesson.content}
                                      readOnly
                                      style={{
                                        backgroundColor: "#f8f9fa",
                                        border: "1px solid #e9ecef",
                                        borderRadius: "6px",
                                        padding: "8px 12px",
                                        color: "black",
                                        resize: "none",
                                        fontSize: "14px",
                                      }}
                                    />
                                  </Form.Group>
                                )}

                                {/* Video Content - YouTube Embed */}
                                {lesson.url && lesson.type === "Video" && (
                                  <Form.Group>
                                    <Form.Label
                                      className="fw-semibold"
                                      style={{ color: "black", fontSize: "14px" }}
                                    >
                                      Video Content
                                    </Form.Label>
                                    <YouTubeEmbed
                                      url={lesson.url}
                                      title={lesson.name || lesson.title}
                                    />
                                  </Form.Group>
                                )}
                              </Card.Body>
                            </Card>
                          ))
                        ) : (
                          <div className="text-center text-muted py-3">
                            <p>No lessons found in this module</p>
                          </div>
                        )}
                      </Card.Body>
                    )}
                  </Card>
                ))
              ) : (
                <div className="text-center text-muted py-5">
                  <FaFile size={48} className="mb-3" style={{ color: "#dee2e6" }} />
                  <p>No modules found for this course</p>
                </div>
              )}
            </>
          )}
        </Form>

        {/* Action Buttons */}
        <div
          className="d-flex justify-content-end gap-3 mt-4 pt-3"
          style={{ borderTop: "1px solid #e9ecef" }}
        >
          <Button
            variant="outline-secondary"
            onClick={onClose}
            style={{
              borderRadius: "8px",
              fontWeight: "500",
              padding: "10px 24px",
              border: "1px solid #6c757d",
            }}
          >
            Cancel
          </Button>

          {status?.toLowerCase() === "waiting" && (
            <>
              <Button
                variant="outline-danger"
                onClick={handleDeny}
                style={{
                  borderRadius: "8px",
                  fontWeight: "500",
                  padding: "10px 24px",
                  border: "1px solid #dc3545",
                  color: "#dc3545",
                }}
              >
                <FaTimes className="me-2" size={12} />
                Deny Course
              </Button>
              <Button
                variant="success"
                onClick={handleApprove}
                style={{
                  borderRadius: "8px",
                  fontWeight: "500",
                  padding: "10px 24px",
                  backgroundColor: "#28a745",
                  border: "1px solid #28a745",
                }}
              >
                <FaCheckCircle className="me-2" size={12} />
                Approve Course
              </Button>
            </>
          )}

          {status?.toLowerCase() === "denied" && (
            <Button
              variant="success"
              onClick={handleApprove}
              style={{
                borderRadius: "8px",
                fontWeight: "500",
                padding: "10px 24px",
                backgroundColor: "#28a745",
                border: "1px solid #28a745",
              }}
            >
              <FaCheckCircle className="me-2" size={12} />
              Approve Course
            </Button>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default CourseApprovalModal;
