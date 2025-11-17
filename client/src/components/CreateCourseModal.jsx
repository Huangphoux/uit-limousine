import React, { useState } from "react";
import { Modal, Form, Button, Row, Col, InputGroup } from "react-bootstrap";
import { FaTimes, FaUpload } from "react-icons/fa";

const CreateCourseModal = ({ show, onClose, onSave }) => {
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
      onSave(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
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
    setErrors({});
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

  return (
    <>
      <style>
        {`
          .create-course-modal .form-control::placeholder,
          .create-course-modal .form-select::placeholder {
            color: #666666 !important;
            opacity: 1 !important;
          }
          .create-course-modal .form-control::-webkit-input-placeholder,
          .create-course-modal .form-select::-webkit-input-placeholder {
            color: #666666 !important;
            opacity: 1 !important;
          }
          .create-course-modal .form-control::-moz-placeholder,
          .create-course-modal .form-select::-moz-placeholder {
            color: #666666 !important;
            opacity: 1 !important;
          }
          .create-course-modal .form-control:-ms-input-placeholder,
          .create-course-modal .form-select:-ms-input-placeholder {
            color: #666666 !important;
            opacity: 1 !important;
          }
        `}
      </style>
      <Modal show={show} onHide={handleClose} size="lg" centered className="create-course-modal">
        <Modal.Header
          className="border-0 pb-0 d-flex justify-content-between align-items-center"
          style={{ backgroundColor: "white", color: "black", position: "relative" }}
        >
          <Modal.Title className="fw-bold fs-4" style={{ color: "black" }}>
            Create new course
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
            Fill in the basic information about your courses, you can add the lesson detail later.
          </p>

          <Form onSubmit={handleSubmit}>
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
                  <Form.Control.Feedback type="invalid">{errors.courseName}</Form.Control.Feedback>
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
                    onClick={() => document.getElementById("avatar-upload").click()}
                  >
                    <FaUpload className="me-2" style={{ color: "#a0aec0" }} />
                    <span style={{ color: "#a0aec0" }}>
                      {formData.avatar ? formData.avatar.name : "Browse your computer"}
                    </span>
                  </div>
                  <input
                    id="avatar-upload"
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
                  <Form.Control.Feedback type="invalid">{errors.category}</Form.Control.Feedback>
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
                Create courses
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CreateCourseModal;
