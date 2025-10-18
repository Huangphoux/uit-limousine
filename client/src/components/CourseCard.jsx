import { Card, Button } from "react-bootstrap";
import PropTypes from "prop-types";
import { useState } from "react";

const CourseCard = ({ course, onEnroll, onCardClick, darkTheme = true }) => {
  const [imageError, setImageError] = useState(false);

  // Default image placeholder - optimized size for 200px height
  const defaultImage = "/images/course-placeholder.svg";
  const getLevelColor = (level) => {
    switch (level) {
      case "Beginner":
        return "success";
      case "Intermediate":
        return "warning";
      case "Advanced":
        return "danger";
      default:
        return "secondary";
    }
  };

  const handleEnrollClick = (e) => {
    e.stopPropagation(); // Prevent card click when clicking enroll button
    if (onEnroll) {
      onEnroll(course.id, course);
    }
  };

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(course);
    }
  };

  const cardStyles = darkTheme
    ? {
        backgroundColor: "#2a2a2a",
        border: course.enrolled ? "2px solid #007bff" : "1px solid #404040",
        color: "#ffffff",
        cursor: "pointer", // Add pointer cursor for clickable card
        transition: "transform 0.2s ease-in-out", // Smooth hover effect
      }
    : {
        backgroundColor: "#ffffff",
        border: course.enrolled ? "2px solid #007bff" : "1px solid #dee2e6",
        color: "#000000",
        cursor: "pointer", // Add pointer cursor for clickable card
        transition: "transform 0.2s ease-in-out", // Smooth hover effect
      };

  const textColors = darkTheme
    ? {
        provider: "#007bff",
        title: "#ffffff",
        description: "#b0b0b0",
        rating: "#ffffff",
        students: "#b0b0b0",
        duration: "#b0b0b0",
      }
    : {
        provider: "#007bff",
        title: "#000000",
        description: "#6c757d",
        rating: "#000000",
        students: "#6c757d",
        duration: "#6c757d",
      };

  return (
    <Card
      className="h-100 shadow-lg"
      style={cardStyles}
      onClick={handleCardClick}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <div style={{ position: "relative" }}>
        <Card.Img
          variant="top"
          src={imageError || !course.image ? defaultImage : course.image}
          alt={course.title}
          style={{ height: "200px", objectFit: "cover" }}
          onError={() => setImageError(true)}
        />
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            backgroundColor: "#007bff",
            color: "white",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          {course.category}
        </div>
        {course.enrolled && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              backgroundColor: "#28a745",
              color: "white",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            Enrolled
          </div>
        )}
      </div>

      <Card.Body className="d-flex flex-column">
        <div className="mb-2">
          <h6
            className="mb-1"
            style={{
              color: textColors.provider,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {course.provider}
          </h6>
          <Card.Title
            className="h6 fw-bold"
            style={{
              color: textColors.title,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {course.title}
          </Card.Title>
        </div>

        <Card.Text
          className="small mb-3"
          style={{
            color: textColors.description,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {course.description}
        </Card.Text>

        <div className="mb-3">
          <div className="d-flex align-items-center mb-2">
            <span className="me-1" style={{ color: "#ffc107" }}>
              ★
            </span>
            <span className="fw-bold me-2" style={{ color: textColors.rating }}>
              {course.rating}
            </span>
            <span className="small" style={{ color: textColors.students }}>
              👥 {course.students.toLocaleString()}
            </span>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <span className={`badge bg-${getLevelColor(course.level)}`}>{course.level}</span>
            <span className="small" style={{ color: textColors.duration }}>
              ⏱️ {course.duration}
            </span>
          </div>
        </div>

        <div className="mt-auto">
          <Button
            variant={course.enrolled ? "outline-primary" : "primary"}
            size="sm"
            className="w-100"
            onClick={handleEnrollClick}
            disabled={course.enrolled}
          >
            {course.enrolled ? "Enrolled" : "Enroll"}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

CourseCard.propTypes = {
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
    image: PropTypes.string.isRequired,
    enrolled: PropTypes.bool.isRequired,
  }).isRequired,
  onEnroll: PropTypes.func,
  onCardClick: PropTypes.func,
  darkTheme: PropTypes.bool,
};

export default CourseCard;
