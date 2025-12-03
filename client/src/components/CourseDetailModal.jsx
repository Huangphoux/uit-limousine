import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

const CourseDetailModal = ({ course, show, onHide, onEnroll }) => {
  const [isEnrolled, setIsEnrolled] = useState(course?.enrolled || false);
  const navigate = useNavigate();

  // Sync local state with course prop when course changes
  useEffect(() => {
    if (course) {
      setIsEnrolled(course.enrolled || false);
    }
  }, [course]);

  if (!course) return null;

  const handleEnroll = () => {
    setIsEnrolled(true); // Update local state
    if (onEnroll) {
      onEnroll(course.id, course, "success"); // Call parent handler
    }
    // Close modal after enrollment will be handled by parent
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "Beginner":
        return "text-success";
      case "Intermediate":
        return "text-warning";
      case "Advanced":
        return "text-danger";
      default:
        return "text-secondary";
    }
  };

  return (
    <>
      {/* Custom CSS for animations */}
      <style>
        {`
          .course-modal-backdrop {
            background-color: rgba(0, 0, 0, 0.6) !important;
            animation: fadeIn 0.2s ease-out;
          }
          
          .course-modal-dialog {
            animation: slideUp 0.3s ease-out;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
          
          .course-modal-content {
            border-radius: 1.5rem 1.5rem 0 0;
            border: none;
            background-color: #ffffff !important;
          }
          
          @media (min-width: 576px) {
            .course-modal-content {
              border-radius: 1.5rem;
            }
            
            .course-modal-dialog {
              margin: 1.75rem auto;
            }
          }
          
          .modal.show .modal-dialog {
            display: flex;
            align-items: flex-end;
          }
          
          @media (min-width: 576px) {
            .modal.show .modal-dialog {
              align-items: center;
            }
          }
        `}
      </style>

      <Modal
        show={show}
        onHide={onHide}
        centered
        size="lg"
        backdropClassName="course-modal-backdrop"
        dialogClassName="course-modal-dialog"
        contentClassName="course-modal-content"
      >
        {/* Header */}
        <Modal.Header className="border-bottom" style={{ padding: "1rem 1.5rem" }}>
          <Modal.Title
            className="w-100"
            style={{ fontSize: "0.875rem", color: "#6c757d", fontWeight: "500" }}
          >
            Course Details
          </Modal.Title>
          <Button
            variant="light"
            onClick={onHide}
            className="p-1"
            style={{
              border: "none",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
            }}
          >
            <FaTimes />
          </Button>
        </Modal.Header>

        {/* Body */}
        <Modal.Body style={{ padding: "1.5rem", maxHeight: "70vh", overflowY: "auto" }}>
          {/* Provider with Icon */}
          <div className="d-flex align-items-center gap-2 mb-3">
            <div
              className="d-flex align-items-center justify-content-center"
              style={{
                backgroundColor: "#e7f3ff",
                padding: "0.5rem",
                borderRadius: "0.5rem",
                width: "40px",
                height: "40px",
              }}
            >
              <svg
                style={{ width: "24px", height: "24px", color: "#007bff" }}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
            </div>
            <div>
              <h5
                className="mb-0"
                style={{ color: "#007bff", fontWeight: "600", fontSize: "1.125rem" }}
              >
                {course.provider}
              </h5>
            </div>
          </div>

          {/* Course Title */}
          <h2 className="mb-2" style={{ fontSize: "1.5rem", fontWeight: "700", color: "#212529" }}>
            {course.title}
          </h2>

          {/* Lecturer */}
          <p className="mb-4" style={{ color: "#6c757d", fontSize: "1rem" }}>
            Lecturer: {course.instructor || course.provider}
          </p>

          {/* Stats Row */}
          <div className="d-flex flex-wrap gap-3 mb-4">
            {/* Rating */}
            <div className="d-flex align-items-center gap-1">
              <span style={{ color: "#ffc107", fontSize: "1.125rem" }}>★</span>
              <span style={{ fontWeight: "600", color: "#212529" }}>{course.rating}</span>
              <span style={{ color: "#6c757d", fontSize: "0.875rem" }}>
                ({course.students.toLocaleString()})
              </span>
            </div>

            {/* Students */}
            <div className="d-flex align-items-center gap-1">
              <svg
                style={{ width: "20px", height: "20px", color: "#007bff" }}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <span style={{ fontWeight: "500", color: "#495057" }}>
                {course.students.toLocaleString()}
              </span>
            </div>

            {/* Duration */}
            <div className="d-flex align-items-center gap-1">
              <svg
                style={{ width: "20px", height: "20px", color: "#28a745" }}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              <span style={{ fontWeight: "500", color: "#495057" }}>{course.duration}</span>
            </div>

            {/* Level */}
            <div className="d-flex align-items-center gap-1">
              <svg
                style={{ width: "20px", height: "20px", color: "#6f42c1" }}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className={`fw-semibold ${getLevelColor(course.level)}`}>{course.level}</span>
            </div>
          </div>

          {/* About Section */}
          <div className="mb-4">
            <div className="d-flex align-items-center gap-2 mb-2">
              <svg
                style={{ width: "20px", height: "20px", color: "#495057" }}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <h5
                className="mb-0"
                style={{ fontWeight: "700", color: "#212529", fontSize: "1.125rem" }}
              >
                About this course
              </h5>
            </div>
            <p style={{ color: "#6c757d", lineHeight: "1.6", fontSize: "1rem" }}>
              {course.description}
            </p>
          </div>
        </Modal.Body>

        {/* Footer */}
        <Modal.Footer className="border-top" style={{ padding: "1rem 1.5rem" }}>
          {isEnrolled ? (
            <div className="d-flex gap-3 w-100">
              <Button
                variant="success"
                size="lg"
                className="flex-fill"
                onClick={() => {
                  // Navigate to course content page
                  navigate(`/course/${course.id}`);
                  onHide(); // Close modal after navigation
                }}
                style={{
                  fontWeight: "700",
                  borderRadius: "0.75rem",
                  padding: "0.875rem",
                  backgroundColor: "#28a745",
                  borderColor: "#28a745",
                  color: "white",
                }}
              >
                View Course
              </Button>
              <Button
                variant="outline-secondary"
                size="lg"
                className="flex-fill"
                onClick={() => {
                  // Handle unsubscribe action
                  setIsEnrolled(false); // Reset local state
                  console.log("Unsubscribe clicked for:", course.title);
                  if (onEnroll) {
                    onEnroll(course.id, course, "unsubscribe");
                  }
                }}
                style={{
                  fontWeight: "700",
                  borderRadius: "0.75rem",
                  padding: "0.875rem",
                  backgroundColor: "red",
                  borderColor: "#6c757d",
                  color: "#000",
                }}
              >
                Unsubscribe
              </Button>
            </div>
          ) : (
            <Button
              variant="primary"
              size="lg"
              className="w-100"
              onClick={handleEnroll}
              style={{
                fontWeight: "700",
                borderRadius: "0.75rem",
                padding: "0.875rem",
              }}
            >
              Enroll Now
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

CourseDetailModal.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    provider: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    students: PropTypes.number.isRequired,
    level: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    image: PropTypes.string,
    enrolled: PropTypes.bool.isRequired,
    instructor: PropTypes.string,
  }),
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onEnroll: PropTypes.func.isRequired,
};

export default CourseDetailModal;
