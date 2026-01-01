import React from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import {
  FaEdit,
  FaEye,
  FaTrash,
  FaUsers,
  FaClock,
  FaDollarSign,
  FaExclamationCircle,
  FaPaperPlane,
  FaEyeSlash,
} from "react-icons/fa";
import { toast } from "sonner";

const CourseManagementCard = ({ courseData, onEdit, onPublish }) => {
  const {
    title,
    description,
    image,
    coverImage,
    avatar,
    enrolledStudents,
    enrollmentCount,
    students,
    duration,
    status,
    rating,
    durationWeeks,
    durationDays,
    durationHours,
    price,
    category,
  } = courseData;

  // Normalize image source: prefer `image`, then `coverImage`, then `avatar`.
  const API_BASE_URL = import.meta.env.VITE_API_URL || "";
  let imageSrc = image || coverImage || avatar || null;
  if (imageSrc && typeof imageSrc === "string" && imageSrc.startsWith("/")) {
    imageSrc = `${API_BASE_URL}${imageSrc}`;
  }
  if (!imageSrc) imageSrc = "/images/course-placeholder.svg";

  // Format enrolled students with fallbacks and localized formatting
  const formatEnrolledStudents = () => {
    const raw = enrolledStudents ?? enrollmentCount ?? students ?? 0;
    if (!raw || Number(raw) === 0) return "N/A";
    try {
      return Number(raw).toLocaleString();
    } catch (e) {
      console.log(e);
      return String(raw);
    }
  };

  // Helper function to build a composite duration string (e.g. "2w 3d 4h")
  const getLongestDuration = (full = false) => {
    const weeks = parseInt(durationWeeks) || 0;
    const days = parseInt(durationDays) || 0;
    const hours = parseInt(durationHours) || 0;

    const parts = [];
    if (weeks > 0) parts.push(`${weeks}w`);
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);

    if (parts.length > 0) {
      return full ? parts.join(" ") : parts[0];
    }

    // If individual fields absent, try to return the free-form duration string
    if (duration) return duration;

    return "Duration not specified";
  };

  const getStatusBadge = () => {
    const getBadgeConfig = () => {
      switch (status?.toLowerCase()) {
        case "published":
          return {
            bgColor: "#28a745", // Green
            textColor: "white",
            icon: null,
            text: "Published",
          };
        case "draft":
          return {
            bgColor: "#fd7e14", // Orange
            textColor: "white",
            icon: <FaEdit size={10} className="me-1" />,
            text: "Draft",
          };
        case "wait for approval":
        case "waiting":
        case "pending":
          return {
            bgColor: "#ffc107", // Yellow/Orange
            textColor: "black",
            icon: <FaClock size={10} className="me-1" />,
            text: "Wait for approval",
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
    <Card
      className="h-100 shadow-sm border-0"
      style={{
        borderRadius: "12px",
        backgroundColor: "#EFF6FF",
        transition: "all 0.3s ease",
        border: "1px solid #e9ecef",
        minHeight: "380px",
        maxHeight: "380px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="position-relative">
        {getStatusBadge()}
        <Card.Img
          variant="top"
          src={imageSrc}
          onError={(e) => (e.currentTarget.src = "/images/course-placeholder.svg")}
          style={{
            height: "140px",
            objectFit: "cover",
            borderRadius: "12px 12px 0 0",
          }}
        />
        {/* Category Badge */}
        {category && (
          <span
            className="badge position-absolute"
            style={{
              left: "10px",
              top: "10px",
              fontSize: "11px",
              fontWeight: "600",
              backgroundColor: "rgba(0,0,0,0.6)",
              color: "white",
              padding: "4px 8px",
              borderRadius: "12px",
            }}
          >
            {category}
          </span>
        )}
      </div>

      <Card.Body className="p-2" style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <Card.Title
          className="fw-bold mb-1"
          style={{
            fontSize: "16px",
            color: "#000",
            fontWeight: "bold",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            minHeight: "38px",
            maxHeight: "38px",
          }}
        >
          {title}
        </Card.Title>
        <Card.Text
          className="mb-2"
          style={{
            fontSize: "13px",
            lineHeight: "1.3",
            color: "#000",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            minHeight: "34px",
            maxHeight: "34px",
          }}
        >
          {description}
        </Card.Text>{" "}
        <div className="mb-2">
          <Row className="g-1">
            <Col xs={6}>
              <div className="d-flex flex-column" style={{ color: "#000" }}>
                <div className="d-flex align-items-center">
                  <FaUsers className=" me-1" size={12} />
                  <span className="small text-black" title={formatEnrolledStudents()}>
                    {formatEnrolledStudents()}
                  </span>
                </div>

                {price != null && (
                  <div className="mt-1 d-flex align-items-center">
                    <FaDollarSign className="me-1" size={12} />
                    <strong
                      className="small text-black"
                      style={{ color: "#495057", fontSize: "14px" }}
                    >
                      {Number(price) === 0
                        ? "Free"
                        : new Intl.NumberFormat(undefined, {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 2,
                          }).format(Number(price))}
                    </strong>
                  </div>
                )}
              </div>
            </Col>

            <Col xs={6}>
              <div className="d-flex align-items-center justify-content-end">
                <FaClock className=" me-1 text-black" size={12} />
                <span className="small text-black" title={getLongestDuration(true)}>
                  {getLongestDuration(true)}
                </span>
              </div>
            </Col>
          </Row>
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
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                maxHeight: "40px",
              }}
            >
              <strong>Reason:</strong> {courseData.denialReason}
            </div>
          </div>
        )}
        <div className="d-flex gap-1" style={{ marginTop: "auto" }}>
          {/* Edit Button */}
          <Button
            variant={
              status?.toLowerCase() === "wait for approval" ||
              status?.toLowerCase() === "waiting" ||
              status?.toLowerCase() === "pending"
                ? "outline-secondary"
                : "outline-primary"
            }
            size="sm"
            className="flex-fill d-flex align-items-center justify-content-center"
            onClick={() => onEdit && onEdit(courseData)}
            disabled={
              status?.toLowerCase() === "wait for approval" ||
              status?.toLowerCase() === "waiting" ||
              status?.toLowerCase() === "pending"
            }
            style={{
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: "500",
              padding: "6px 8px",
              opacity:
                status?.toLowerCase() === "wait for approval" ||
                status?.toLowerCase() === "waiting" ||
                status?.toLowerCase() === "pending"
                  ? 0.5
                  : 1,
            }}
          >
            <FaEdit className="me-1" size={10} />
            Edit
          </Button>

          {/* Publish/Hide/Resend Button */}
          <Button
            variant={
              status?.toLowerCase() === "denied"
                ? "outline-info"
                : status?.toLowerCase() === "published"
                  ? "outline-secondary"
                  : status?.toLowerCase() === "wait for approval" ||
                      status?.toLowerCase() === "waiting" ||
                      status?.toLowerCase() === "pending"
                    ? "outline-secondary"
                    : "outline-success"
            }
            size="sm"
            className="flex-fill d-flex align-items-center justify-content-center"
            onClick={() => {
              if (status?.toLowerCase() === "denied") {
                // Resend for approval
                onPublish && onPublish({ ...courseData, action: "resend" });
              } else if (status?.toLowerCase() === "published") {
                // Hide/Unpublish the course
                onPublish && onPublish({ ...courseData, action: "hide" });
              } else if (status?.toLowerCase() === "draft") {
                // Publish the draft course
                onPublish && onPublish({ ...courseData, action: "publish" });
              } else {
                // Default publish action
                onPublish && onPublish({ ...courseData, action: "publish" });
              }
            }}
            disabled={
              status?.toLowerCase() === "wait for approval" ||
              status?.toLowerCase() === "waiting" ||
              status?.toLowerCase() === "pending"
            }
            style={{
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: "500",
              padding: "6px 8px",
              opacity:
                status?.toLowerCase() === "wait for approval" ||
                status?.toLowerCase() === "waiting" ||
                status?.toLowerCase() === "pending"
                  ? 0.5
                  : 1,
            }}
          >
            {status?.toLowerCase() === "denied" ? (
              <>
                <FaPaperPlane className="me-1" size={10} />
                Resend
              </>
            ) : status?.toLowerCase() === "published" ? (
              <>
                <FaEyeSlash className="me-1" size={10} />
                Hide
              </>
            ) : (
              <>
                <FaEye className="me-1" size={10} />
                Publish
              </>
            )}
          </Button>

          {/* Delete Button */}
          {/* <Button
            variant={
              status?.toLowerCase() === "wait for approval" ||
              status?.toLowerCase() === "waiting" ||
              status?.toLowerCase() === "pending"
                ? "outline-secondary"
                : "outline-danger"
            }
            size="sm"
            className="d-flex align-items-center justify-content-center"
            onClick={() => onDelete && onDelete(courseData)}
            disabled={
              status?.toLowerCase() === "wait for approval" ||
              status?.toLowerCase() === "waiting" ||
              status?.toLowerCase() === "pending"
            }
            style={{
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: "500",
              padding: "6px 8px",
              minWidth: "32px",
              opacity:
                status?.toLowerCase() === "wait for approval" ||
                status?.toLowerCase() === "waiting" ||
                status?.toLowerCase() === "pending"
                  ? 0.5
                  : 1,
            }}
          >
            <FaTrash size={10} />
          </Button> */}
        </div>
      </Card.Body>
    </Card>
  );
};

export default CourseManagementCard;
