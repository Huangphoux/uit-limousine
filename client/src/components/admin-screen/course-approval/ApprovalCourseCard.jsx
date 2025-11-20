import React, { useState } from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import {
  FaUser,
  FaClock,
  FaStar,
  FaExclamationCircle,
  FaCheckCircle,
  FaTimes,
  FaCalendarAlt,
  FaEye,
} from "react-icons/fa";
import CourseApprovalModal from "./CourseApprovalModal";

// CSS styles for hover effect and card border radius
const buttonStyles = `
  .view-approve-btn {
    transition: all 0.3s ease;
  }
  .view-approve-btn:hover {
    background-color: #1976d2 !important;
    border-color: #1976d2 !important;
    color: white !important;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
  }
  .view-approve-btn:active {
    transform: translateY(0px);
  }
  .approval-card-wrapper {
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
    background: transparent;
  }
  .approval-card-wrapper:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  .approval-course-card {
    border-radius: 12px !important;
    overflow: hidden !important;
    border: 1px solid #e9ecef !important;
    margin: 0 !important;
  }
  .approval-course-card .card-img-top {
    border-radius: 12px 12px 0 0 !important;
    margin: 0 !important;
    border: none !important;
  }
  .approval-image-container {
    border-radius: 12px 12px 0 0 !important;
    overflow: hidden !important;
    margin: 0 !important;
    padding: 0 !important;
  }
`;

const ApprovalCourseCard = ({ courseData, onApprove, onDeny }) => {
  const [showModal, setShowModal] = useState(false);

  const {
    title,
    description,
    image,
    instructor,
    submittedDate,
    estimatedDuration,
    status,
    category,
    durationWeeks,
    durationDays,
    durationHours,
  } = courseData;

  // Helper function to get the longest duration unit
  const getLongestDuration = () => {
    const weeks = parseInt(durationWeeks) || 0;
    const days = parseInt(durationDays) || 0;
    const hours = parseInt(durationHours) || 0;

    if (weeks > 0) return `${weeks} week${weeks !== 1 ? "s" : ""}`;
    if (days > 0) return `${days} day${days !== 1 ? "s" : ""}`;
    if (hours > 0) return `${hours} hour${hours !== 1 ? "s" : ""}`;

    // Fallback to original estimatedDuration if individual fields are not available
    return estimatedDuration || "Duration not specified";
  };

  const handleViewAndApprove = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const getStatusBadge = () => {
    const getBadgeConfig = () => {
      switch (status?.toLowerCase()) {
        case "waiting":
        case "pending":
          return {
            bgColor: "#ffc107", // Yellow/Orange
            textColor: "black",
            icon: <FaClock size={10} className="me-1" />,
            text: "Waiting",
          };
        case "denied":
        case "rejected":
          return {
            bgColor: "#dc3545", // Red
            textColor: "white",
            icon: <FaExclamationCircle size={10} className="me-1" />,
            text: "Denied",
          };
        default:
          return {
            bgColor: "#6c757d", // Gray
            textColor: "white",
            icon: null,
            text: status || "Unknown",
          };
      }
    };

    const config = getBadgeConfig();

    return (
      <span
        className="badge position-absolute d-flex align-items-center"
        style={{
          top: "10px",
          right: "10px",
          fontSize: "11px",
          fontWeight: "600",
          backgroundColor: config.bgColor,
          color: config.textColor,
          padding: "4px 8px",
          borderRadius: "12px",
        }}
      >
        {config.icon}
        {config.text}
      </span>
    );
  };

  return (
    <>
      <style>{buttonStyles}</style>
      <div className="approval-card-wrapper h-100">
        <Card
          className="h-100 shadow-sm approval-course-card"
          style={{
            backgroundColor: "#EFF6FF",
          }}
        >
          <div className="position-relative approval-image-container">
            {getStatusBadge()}
            <Card.Img
              variant="top"
              src={image || "public/images/course-placeholder.svg"}
              style={{
                height: "140px",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>

          <Card.Body className="p-2 d-flex flex-column" style={{ minHeight: "200px" }}>
            <div className="flex-grow-1">
              <Card.Title
                className="fw-bold mb-1"
                style={{ fontSize: "16px", color: "#000", fontWeight: "bold" }}
              >
                {title}
              </Card.Title>
              <Card.Text
                className="mb-2"
                style={{
                  fontSize: "13px",
                  lineHeight: "1.3",
                  color: "#000",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {description}
              </Card.Text>

              <div className="mb-2">
                <Row className="g-1">
                  <Col xs={12}>
                    <div className="d-flex align-items-center mb-1" style={{ color: "#000" }}>
                      <FaUser className="me-1" size={12} />
                      <span className="small text-black">{instructor}</span>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="d-flex align-items-center">
                      <FaClock className="me-1 text-black" size={12} />
                      <span className="small text-black">{getLongestDuration()}</span>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="d-flex align-items-center">
                      <FaCalendarAlt className="me-1 text-black" size={12} />
                      <span className="small text-black">{submittedDate}</span>
                    </div>
                  </Col>
                </Row>

                {category && (
                  <div className="mt-1">
                    <span
                      className="badge"
                      style={{
                        backgroundColor: "#e9ecef",
                        color: "#495057",
                        fontSize: "10px",
                        fontWeight: "500",
                      }}
                    >
                      {category}
                    </span>
                  </div>
                )}
              </div>

              {/* Denial Reason Box */}
              {status?.toLowerCase() === "denied" && courseData.denialReason && (
                <div className="mb-2">
                  <div
                    className="p-2 rounded"
                    style={{
                      backgroundColor: "#f8d7da",
                      border: "1px solid #f5c6cb",
                      fontSize: "12px",
                      color: "#721c24",
                    }}
                  >
                    <strong>Reason:</strong> {courseData.denialReason}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom section - always positioned at bottom */}
            <div className="mt-auto">
              {/* Action Button - Show for Waiting status */}
              {status?.toLowerCase() === "waiting" && (
                <div className="d-flex">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="w-100 d-flex align-items-center justify-content-center view-approve-btn"
                    onClick={handleViewAndApprove}
                    style={{
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: "500",
                      padding: "8px 12px",
                      backgroundColor: "#e3f2fd",
                      borderColor: "#1976d2",
                      color: "#1976d2",
                    }}
                  >
                    <FaEye className="me-1" size={10} />
                    View and approve
                  </Button>
                </div>
              )}

              {/* Show status message for denied courses */}
              {status?.toLowerCase() === "denied" && (
                <div className="text-center">
                  <small style={{ color: "rgba(0, 0, 0, 0.5)" }}>Course has been denied</small>
                </div>
              )}
            </div>
          </Card.Body>

          {/* Course Approval Modal */}
          <CourseApprovalModal
            show={showModal}
            onClose={handleCloseModal}
            onApprove={onApprove}
            onDeny={onDeny}
            courseData={courseData}
          />
        </Card>
      </div>
    </>
  );
};

export default ApprovalCourseCard;
