import React from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { FaEdit, FaEye, FaTrash, FaUsers, FaClock, FaStar } from "react-icons/fa";

const CourseManagementCard = ({ courseData, onEdit, onPublish }) => {
  const { title, description, image, enrolledStudents, duration, status, rating } = courseData;
  const defaultImage = "images/course-placeholder.svg";

  const getStatusBadge = () => {
    return (
      <span
        className={`badge ${status === "Published" ? "bg-success" : "bg-danger"} position-absolute`}
        style={{
          top: "10px",
          right: "10px",
          fontSize: "12px",
          fontWeight: "600",
        }}
      >
        {status}
      </span>
    );
  };

  const getRatingStars = () => {
    return (
      <div className="d-flex align-items-center">
        <FaStar className="text-warning me-1" size={14} />
        <span className="text-black small">{rating}</span>
      </div>
    );
  };

  return (
    <Card
      className="h-100 shadow-sm border-0 d-flex flex-column"
      style={{
        borderRadius: "12px",
        backgroundColor: "#EFF6FF",
        minHeight: "400px",
        maxHeight: "400px",
      }}
    >
      <div className="position-relative" style={{ flexShrink: 0 }}>
        {getStatusBadge()}
        <Card.Img
          variant="top"
          src={image ? image : defaultImage}
          style={{
            height: "140px",
            objectFit: "cover",
            borderRadius: "12px 12px 0 0",
          }}
        />
      </div>

      <Card.Body className="p-2 d-flex flex-column" style={{ flex: 1, overflow: "hidden" }}>
        <Card.Title
          className="fw-bold mb-1"
          style={{
            fontSize: "16px",
            color: "#000",
            fontWeight: "bold",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: "2",
            WebkitBoxOrient: "vertical",
            height: "40px",
            flexShrink: 0,
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
            WebkitLineClamp: "2",
            WebkitBoxOrient: "vertical",
            height: "33px",
            flexShrink: 0,
          }}
        >
          {description}
        </Card.Text>{" "}
        <div className="mb-2" style={{ flexShrink: 0 }}>
          <Row className="g-1">
            <Col xs={6}>
              <div className="d-flex align-items-center" style={{ color: "#000" }}>
                <FaUsers className=" me-1" size={12} />
                <span className="small text-black">{enrolledStudents}</span>
              </div>
            </Col>
            <Col xs={6}>
              <div className="d-flex align-items-center">
                <FaClock className=" me-1 text-black" size={12} />
                <span className="small text-black ">{duration}</span>
              </div>
            </Col>
          </Row>

          <div className="mt-1">{getRatingStars()}</div>
        </div>
        <div className="d-flex gap-1 mt-auto" style={{ flexShrink: 0 }}>
          <Button
            variant="outline-primary"
            size="sm"
            className="flex-fill d-flex align-items-center justify-content-center"
            onClick={() => onEdit && onEdit(courseData)}
            style={{
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: "500",
              padding: "6px 8px",
            }}
          >
            <FaEdit className="me-1" size={10} />
            Edit
          </Button>

          <Button
            variant="outline-success"
            size="sm"
            className="flex-fill d-flex align-items-center justify-content-center"
            onClick={() =>
              onPublish &&
              onPublish({ ...courseData, action: status === "Published" ? "hide" : "publish" })
            }
            style={{
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: "500",
              padding: "6px 8px",
            }}
          >
            <FaEye className="me-1" size={10} />
            {status === "Published" ? "Hide" : "Publish"}
          </Button>

          {/* <Button
            variant="outline-danger"
            size="sm"
            className="d-flex align-items-center justify-content-center"
            onClick={() => onDelete && onDelete(courseData)}
            style={{
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: "500",
              padding: "6px 8px",
              minWidth: "32px",
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
