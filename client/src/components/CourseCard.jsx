import { Card, Button } from "react-bootstrap";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CourseCard = ({ course, onCardClick }) => {
  const [imageError, setImageError] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(course.enrolled || false);
  const navigate = useNavigate();

  // Sync local state with course prop when course changes
  useEffect(() => {
    setIsEnrolled(course.enrolled || false);
  }, [course.enrolled]);

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

  // const handleEnrollClick = (e) => {
  //   e.stopPropagation(); // Prevent card click when clicking enroll button
  //   setIsEnrolled(true); // Immediately update local state to show new buttons
  //   if (onEnroll) {
  //     onEnroll(course.id, course, "success");
  //   }
  // };

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(course);
    }
  };

  const cardStyles = {
    backgroundColor: "#ffffff",
    border: isEnrolled ? "2px solid #667eea" : "1px solid #e9ecef",
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

          .view-course-btn-gradient {
            background: #008236
            border: none;
            transition: all 0.3s ease;
          }
          
          .view-course-gradient:hover:not(:disabled) {
            background: #025f29ff
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

      <Card className="h-100 course-card-hover" style={cardStyles} onClick={handleCardClick}>
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
          {isEnrolled && (
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
            {/* Provider + Instructor */}
            {(() => {
              const instructorName =
                typeof course.instructor === "string"
                  ? course.instructor
                  : course.instructor?.name || course.instructor?.fullName || "";
              return (
                <div
                  className="mb-1 d-flex align-items-center"
                  style={{ justifyContent: "space-between" }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h6
                      className="mb-0"
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
                    <div style={{ fontSize: "0.72rem", color: "#6c757d" }}>
                      {course.category || ""}
                    </div>
                  </div>

                  {instructorName && (
                    <div style={{ marginLeft: "12px", textAlign: "right" }}>
                      <div
                        style={{
                          fontSize: "0.95rem",
                          fontWeight: 700,
                          color: "#343a40",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "220px",
                        }}
                      >
                        {instructorName}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
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
              <span
                className="fw-bold me-2"
                style={{ color: textColors.rating, fontSize: "0.95rem" }}
              >
                {course.rating}
              </span>
              <span className="small" style={{ color: textColors.students, fontSize: "0.85rem" }}>
                👥 {(course.students || course.enrollmentCount || 0).toLocaleString()}
              </span>
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <span
                className={`badge bg-${getLevelColor(course.level)}`}
                style={{ fontSize: "0.75rem", padding: "0.35rem 0.65rem" }}
              >
                {course.level || "N/A"}
              </span>
              <span className="small" style={{ color: textColors.duration, fontSize: "0.85rem" }}>
                ⏱️ {course.duration || "N/A"}
              </span>
            </div>
          </div>

          {/* <div className="mt-auto">
            {isEnrolled ? (
              <div className="d-flex flex-column gap-2">
                <Button
                  variant="success"
                  size="sm"
                  className="w-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Navigate to course content page
                    navigate(`/course/${course.id}`);
                  }}
                  style={{
                    fontWeight: "600",
                    padding: "0.6rem 1rem",
                    borderRadius: "0.5rem",
                    backgroundColor: "#28a745",
                    borderColor: "#28a745",
                  }}
                >
                  View courses
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  className="w-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle unsubscribe action
                    setIsEnrolled(false); // Reset local state to show enroll button again
                    console.log("Unsubscribe clicked for:", course.title);
                    if (onEnroll) {
                      // You might want to pass a different callback for unsubscribe
                      onEnroll(course.id, course, "unsubscribe");
                    }
                  }}
                  style={{
                    fontWeight: "600",
                    padding: "0.6rem 1rem",
                    borderRadius: "0.5rem",
                    backgroundColor: "#dc3545",
                    borderColor: "#dc3545",
                  }}
                >
                  Unsubscribe
                </Button>
              </div>
            ) : (
              <Button
                variant="primary"
                size="sm"
                className="w-100 enroll-btn-gradient"
                onClick={handleEnrollClick}
                style={{
                  fontWeight: "600",
                  padding: "0.6rem 1rem",
                  borderRadius: "0.5rem",
                }}
              >
                Enroll Now
              </Button>
            )}
          </div> */}
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
    instructor: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  }).isRequired,
  onEnroll: PropTypes.func,
  onCardClick: PropTypes.func,
  darkTheme: PropTypes.bool,
};

export default CourseCard;
