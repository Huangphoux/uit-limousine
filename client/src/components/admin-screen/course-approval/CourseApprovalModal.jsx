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

  useEffect(() => {
    if (show && courseData) {
      console.log("[CourseApprovalModal] courseData:", courseData);
    }
  }, [show, courseData]);

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
    price,
    portfolioUrl,
  } = courseData;

  // Prefer `image`, then `coverImage` (some payloads store it under that key)
  const imageSrc = image || courseData.coverImage || null;

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

        {/* Cover Image */}
        {imageSrc ? (
          <div className="mb-3" style={{ borderRadius: 8, overflow: "hidden" }}>
            <img
              src={imageSrc}
              alt={title || "course cover"}
              onError={(e) => {
                e.currentTarget.src = "/images/course-placeholder.svg";
              }}
              style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }}
            />
          </div>
        ) : null}

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

              {/* Price & Portfolio */}
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold" style={{ color: "black" }}>
                      Price
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={price != null ? String(price) : "Not specified"}
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
                      Portfolio URL
                    </Form.Label>
                    {portfolioUrl ? (
                      <div className="d-flex align-items-center">
                        <a
                          href={portfolioUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: "#1976d2" }}
                        >
                          {portfolioUrl}
                        </a>
                      </div>
                    ) : (
                      <div style={{ color: "#6c757d" }}>Not provided</div>
                    )}
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
