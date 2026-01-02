import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col, InputGroup } from "react-bootstrap";
import { FaTimes, FaUpload } from "react-icons/fa";
import { toast } from "sonner";
const API_URL = import.meta.env.VITE_API_URL;

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
    price: "",
  });

  const [previewUrl, setPreviewUrl] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        // Get token and user info from localStorage
        const token = localStorage.getItem("accessToken");
        const userStr = localStorage.getItem("user");

        if (!token || !userStr) {
          toast.error("Please login first to create a course.");
          return;
        }

        const user = JSON.parse(userStr);
        const instructorId = user.id;

        // Build multipart form data to send file + fields
        const fd = new FormData();
        fd.append("title", formData.courseName);
        fd.append("description", formData.description);
        fd.append("category", formData.category);
        fd.append("level", formData.level);
        if (formData.durationWeeks) fd.append("durationWeeks", formData.durationWeeks);
        if (formData.durationDays) fd.append("durationDays", formData.durationDays);
        if (formData.durationHours) fd.append("durationHours", formData.durationHours);
        fd.append("organization", formData.organization || "");
        fd.append("language", formData.language || "");
        fd.append("requirement", formData.requirement || "");
        fd.append("price", formData.price || 0);
        fd.append("instructorId", instructorId);
        if (formData.avatar) fd.append("avatar", formData.avatar);

        const response = await fetch(`${API_URL}/admin/courses`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: fd,
        });

        if (response.status === 403) {
          // fallback for non-admins: upload image (if any) then call instructor apply with JSON + extra fields
          if (formData.avatar) {
            const uploadFd = new FormData();
            uploadFd.append("file", formData.avatar);
            const uploadRes = await fetch(`${API_URL}/media/upload`, {
              method: "POST",
              body: uploadFd,
            });

            if (!uploadRes.ok) {
              const u = await uploadRes.json().catch(() => ({}));
              throw new Error(u.data || u.message || "Image upload failed");
            }

            const uploadJson = await uploadRes.json();
            const fileUrl = uploadJson?.data?.fileUrl || uploadJson?.fileUrl;

            // Send instructor application with extra fields embedded
            const applyPayload = {
              applicantId: instructorId,
              requestedCourseTitle: formData.courseName,
              requestedCourseSummary: formData.description,
              // portfolioUrl isn't collected in this form; keep empty and put requirement in meta
              portfolioUrl: "",
              coverImage: fileUrl,
              meta: JSON.stringify({
                category: formData.category,
                level: formData.level,
                durationWeeks: formData.durationWeeks,
                durationDays: formData.durationDays,
                durationHours: formData.durationHours,
                organization: formData.organization,
                language: formData.language,
                price: formData.price,
                requirement: formData.requirement,
              }),
            };

            console.log("[CreateCourseModal] calling /instructor/apply with:", applyPayload);

            const applyRes = await fetch(`${API_URL}/instructor/apply`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(applyPayload),
            });

            const applyJson = await applyRes.json();
            if (!applyRes.ok) {
              throw new Error(applyJson.error || applyJson.message || "Apply failed");
            }

            toast.success("Application submitted successfully.");
            onSave({ ...formData, coverImage: fileUrl });
            handleClose();
            return;
          } else {
            // no avatar — call apply directly
            const applyPayload = {
              applicantId: instructorId,
              requestedCourseTitle: formData.courseName,
              requestedCourseSummary: formData.description,
              // no portfolio input in the form — leave empty
              portfolioUrl: "",
              meta: JSON.stringify({
                category: formData.category,
                level: formData.level,
                durationWeeks: formData.durationWeeks,
                durationDays: formData.durationDays,
                durationHours: formData.durationHours,
                organization: formData.organization,
                language: formData.language,
                price: formData.price,
                requirement: formData.requirement,
              }),
            };

            console.log("[CreateCourseModal] calling /instructor/apply with:", applyPayload);

            const applyRes = await fetch(`${API_URL}/instructor/apply`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(applyPayload),
            });

            const applyJson = await applyRes.json();
            if (!applyRes.ok) {
              throw new Error(applyJson.error || applyJson.message || "Apply failed");
            }

            toast.success("Application submitted successfully.");
            onSave({ ...formData });
            handleClose();
            return;
          }
        }

        const data = await response.json();

        console.log(data);

        if (!response.ok) {
          const errorMessage =
            data.data || data.error?.message || data.message || "Create course failed";
          throw new Error(errorMessage);
        }

        // Show success message
        toast.success("Course created successfully.");

        // Pass a shallow snapshot so parent receives a stable copy
        const snapshot = { ...formData };
        const course = data?.data || data;
        snapshot.coverImage = course?.coverImage || course?.image || null;
        console.log("Created course response:", course);
        onSave(snapshot);
        // Reset UI and close modal
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
        }
        handleClose();
      } catch (error) {
        console.log(error);
        toast.error("Failed to create course: " + error.message);
      }
    }
  };

  const handleClose = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }

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
      price: "",
    });
    setErrors({});
    onClose();
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("file selected:", file, file?.name);
    if (file) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      setFormData((prev) => {
        const next = {
          ...prev,
          avatar: file,
        };
        console.log("formData after set:", next);
        return next;
      });
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
            {/* Cover / Avatar header (full width) */}
            <div
              className="mb-4 position-relative"
              style={{
                height: 220,
                borderRadius: 8,
                overflow: "hidden",
                backgroundColor: "#f6f8fa",
              }}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="cover preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              ) : (
                <div
                  className="d-flex flex-column align-items-center justify-content-center text-muted"
                  style={{ height: "100%" }}
                  onClick={() => document.getElementById("avatar-upload").click()}
                >
                  <FaUpload size={28} />
                  <div style={{ marginTop: 8 }}>Add course cover image</div>
                </div>
              )}

              {/* Overlay buttons */}
              <div style={{ position: "absolute", top: 10, right: 10, display: "flex", gap: 8 }}>
                {previewUrl && (
                  <Button
                    variant="light"
                    size="sm"
                    onClick={() => {
                      // remove avatar
                      if (previewUrl) {
                        URL.revokeObjectURL(previewUrl);
                        setPreviewUrl(null);
                      }
                      setFormData((prev) => ({ ...prev, avatar: null }));
                    }}
                  >
                    Remove
                  </Button>
                )}
                <Button
                  variant="light"
                  size="sm"
                  onClick={() => document.getElementById("avatar-upload").click()}
                >
                  {previewUrl ? "Replace" : "Add"}
                </Button>
              </div>

              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>

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

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold" style={{ color: "black" }}>
                Price
              </Form.Label>
              <Form.Control
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                style={{
                  backgroundColor: "white",
                  border: "1px solid #e9ecef",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  color: "black",
                }}
              />
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
