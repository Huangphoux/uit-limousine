import React from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { FaEdit, FaEye, FaTrash, FaUsers, FaClock, FaStar } from "react-icons/fa";

const CourseManagementCard = ({ courseData, onEdit, onPublish, onDelete }) => {
  const { title, description, image, enrolledStudents, duration, status, rating } = courseData;

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
      className="h-100 shadow-sm border-0"
      style={{ borderRadius: "12px solid black", backgroundColor: "#EFF6FF" }}
    >
      <div className="position-relative">
        {getStatusBadge()}
        <Card.Img
          variant="top"
          src={image}
          style={{
            height: "140px",
            objectFit: "cover",
            borderRadius: "12px 12px 0 0",
          }}
        />
      </div>

      <Card.Body className="p-2">
        <Card.Title
          className="fw-bold mb-1"
          style={{ fontSize: "16px", color: "#000", fontWeight: "bold" }}
        >
          {title}
        </Card.Title>
        <Card.Text className=" mb-2" style={{ fontSize: "13px", lineHeight: "1.3", color: "#000" }}>
          {description}
        </Card.Text>{" "}
        <div className="mb-2">
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
        <div className="d-flex gap-1">
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
            onClick={() => onPublish && onPublish(courseData)}
            style={{
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: "500",
              padding: "6px 8px",
            }}
          >
            <FaEye className="me-1" size={10} />
            {status === "Published" ? "View" : "Publish"}
          </Button>

          <Button
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
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CourseManagementCard;
