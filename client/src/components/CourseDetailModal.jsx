import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

const CourseDetailModal = ({ course, show, onHide, onEnroll }) => {
  const [isEnrolled, setIsEnrolled] = useState(course?.enrolled || false);
  const [isPaid, setIsPaid] = useState(course?.isPaid || false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const navigate = useNavigate();

  // Sync local state with course prop when course changes
  useEffect(() => {
    if (course) {
      setIsEnrolled(course.enrolled || false);
      setIsPaid(course.isPaid || false);
    }
  }, [course]);

  if (!course) return null;

  const handlePayment = async () => {
    setIsProcessingPayment(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsPaid(true);
      setIsProcessingPayment(false);

      // TODO: Call API to update payment status
      console.log("Payment confirmed for course:", course.id);

      // Optionally notify parent component
      if (onEnroll) {
        onEnroll(course.id, { ...course, isPaid: true }, "payment");
      }
    }, 1500);
  };

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

          {/* Price Section */}
          {course.price !== undefined && course.price !== null && (
            <div className="mb-4">
              <div className="d-flex align-items-center gap-2 mb-2">
                <svg
                  style={{ width: "20px", height: "20px", color: "#495057" }}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                    clipRule="evenodd"
                  />
                </svg>
                <h5
                  className="mb-0"
                  style={{ fontWeight: "700", color: "#212529", fontSize: "1.125rem" }}
                >
                  Giá khóa học
                </h5>
              </div>
              <div
                className="d-flex align-items-center gap-3"
                style={{
                  padding: "1rem",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "0.75rem",
                  border: "2px solid #e9ecef",
                }}
              >
                <span
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: "700",
                    color: course.price === 0 ? "#28a745" : "#007bff",
                  }}
                >
                  {course.price === 0 ? "FREE" : `${course.price.toLocaleString()}VNĐ`}
                </span>
                {course.isPaid ? (
                  <span
                    style={{
                      padding: "0.25rem 0.75rem",
                      backgroundColor: "#d4edda",
                      color: "#155724",
                      borderRadius: "1rem",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                    }}
                  >
                    ✓ Đã thanh toán
                  </span>
                ) : course.price > 0 ? (
                  <span
                    style={{
                      padding: "0.25rem 0.75rem",
                      backgroundColor: "#fff3cd",
                      color: "#856404",
                      borderRadius: "1rem",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                    }}
                  >
                    Chưa thanh toán
                  </span>
                ) : null}
              </div>
            </div>
          )}

          {/* Payment Methods Section - Only show if not paid and price > 0 */}
          {course.price > 0 && !isPaid && (
            <div className="mb-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <svg
                  style={{ width: "20px", height: "20px", color: "#495057" }}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path
                    fillRule="evenodd"
                    d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <h5
                  className="mb-0"
                  style={{ fontWeight: "700", color: "#212529", fontSize: "1.125rem" }}
                >
                  Phương thức thanh toán
                </h5>
              </div>
              <div className="d-flex flex-column gap-2">
                <div
                  style={{
                    padding: "1rem",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "0.5rem",
                    border: "1px solid #dee2e6",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      backgroundColor: "#007bff",
                      borderRadius: "0.5rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "700",
                    }}
                  >
                    💳
                  </div>
                  <div>
                    <div style={{ fontWeight: "600", color: "#212529" }}>Credit/Debit Card</div>
                    <div style={{ fontSize: "0.875rem", color: "#6c757d" }}>
                      Visa, Mastercard, AmEx
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    padding: "1rem",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "0.5rem",
                    border: "1px solid #dee2e6",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      backgroundColor: "#00457C",
                      borderRadius: "0.5rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "700",
                    }}
                  >
                    PP
                  </div>
                  <div>
                    <div style={{ fontWeight: "600", color: "#212529" }}>PayPal</div>
                    <div style={{ fontSize: "0.875rem", color: "#6c757d" }}>Fast & secure</div>
                  </div>
                </div>
              </div>

              {/* Payment Confirm Button */}
              <div className="mt-3">
                <Button
                  variant="success"
                  size="lg"
                  className="w-100"
                  onClick={handlePayment}
                  disabled={isProcessingPayment}
                  style={{
                    fontWeight: "700",
                    borderRadius: "0.75rem",
                    padding: "0.875rem",
                    backgroundColor: isProcessingPayment ? "#6c757d" : "#28a745",
                    borderColor: isProcessingPayment ? "#6c757d" : "#28a745",
                  }}
                >
                  {isProcessingPayment ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Processing...
                    </>
                  ) : (
                    "✓ Confirm Payment"
                  )}
                </Button>
              </div>
            </div>
          )}
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
            <>
              {course.price > 0 && !isPaid ? (
                <div className="w-100">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-100 mb-2"
                    disabled
                    style={{
                      fontWeight: "700",
                      borderRadius: "0.75rem",
                      padding: "0.875rem",
                      opacity: 0.6,
                      cursor: "not-allowed",
                    }}
                  >
                    🔒 Enroll Now (Payment Required)
                  </Button>
                  <small style={{ color: "#6c757d", display: "block", textAlign: "center" }}>
                    Please complete payment to enroll
                  </small>
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
            </>
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
    price: PropTypes.number,
    isPaid: PropTypes.bool,
  }),
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onEnroll: PropTypes.func.isRequired,
};

export default CourseDetailModal;
