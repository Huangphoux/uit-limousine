import { Card, Button } from "react-bootstrap";
import PropTypes from "prop-types";
import { useState } from "react";

const CourseCard = ({ course, onEnroll, onCardClick }) => {
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

  const cardStyles = {
    backgroundColor: "#ffffff",
    border: course.enrolled ? "2px solid #667eea" : "1px solid #e9ecef",
    color: "#212529",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
  };

  const textColors = {
    provider: "#667eea",
    title: "#212529",
    description: "#6c757d",
    rating: "#212529",
    students: "#6c757d",
    duration: "#6c757d",
  };

  return (
    <>
      <style>
        {`
          .course-card-hover:hover {
            transform: translateY(-8px);
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
          }
          
          .enroll-btn-gradient {
            background: #0d6efd
            border: none;
            transition: all 0.3s ease;
          }
          
          .enroll-btn-gradient:hover:not(:disabled) {
            background: #0b5ed7
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
          }
          
          .enrolled-badge {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            animation: pulse 2s ease-in-out infinite;
          }
          
          @keyframes pulse {
            0%, 100% {
              box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
            }
            50% {
              box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
            }
          }
          
          .category-badge {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
        `}
      </style>
      
      <Card
        className="h-100 course-card-hover"
        style={cardStyles}
        onClick={handleCardClick}
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
            className="category-badge"
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              color: "white",
              padding: "6px 12px",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: "600",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
            }}
          >
            {course.category}
          </div>
          {course.enrolled && (
            <div
              className="enrolled-badge"
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                color: "white",
                padding: "6px 12px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: "600",
              }}
            >
              ✓ Enrolled
            </div>
          )}
        </div>

        <Card.Body className="d-flex flex-column" style={{ padding: "1.25rem" }}>
          <div className="mb-2">
            <h6
              className="mb-1"
              style={{
                color: textColors.provider,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontSize: "0.875rem",
                fontWeight: "600",
              }}
            >
              {course.provider}
            </h6>
            <Card.Title
              className="fw-bold"
              style={{
                color: textColors.title,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontSize: "1.1rem",
                marginBottom: "0.5rem",
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
              fontSize: "0.875rem",
            }}
          >
            {course.description}
          </Card.Text>

          <div className="mb-3">
            <div className="d-flex align-items-center mb-2">
              <span className="me-1" style={{ color: "#fbbf24", fontSize: "1.1rem" }}>
                ★
              </span>
              <span className="fw-bold me-2" style={{ color: textColors.rating, fontSize: "0.95rem" }}>
                {course.rating}
              </span>
              <span className="small" style={{ color: textColors.students, fontSize: "0.85rem" }}>
                👥 {course.students.toLocaleString()}
              </span>
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <span className={`badge bg-${getLevelColor(course.level)}`} style={{ fontSize: "0.75rem", padding: "0.35rem 0.65rem" }}>
                {course.level}
              </span>
              <span className="small" style={{ color: textColors.duration, fontSize: "0.85rem" }}>
                ⏱️ {course.duration}
              </span>
            </div>
          </div>

          <div className="mt-auto">
            <Button
              variant={course.enrolled ? "outline-secondary" : "primary"}
              size="sm"
              className={course.enrolled ? "w-100" : "w-100 enroll-btn-gradient"}
              onClick={handleEnrollClick}
              disabled={course.enrolled}
              style={{
                fontWeight: "600",
                padding: "0.6rem 1rem",
                borderRadius: "0.5rem",
              }}
            >
              {course.enrolled ? "✓ Enrolled" : "Enroll Now"}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </>
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