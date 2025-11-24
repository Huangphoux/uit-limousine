import React from "react";
import { Container, Row, Col, Button, Form, InputGroup, Spinner, Alert } from "react-bootstrap";
import { useState, useEffect } from "react";
import CourseCard from "../components/CourseCard";
import ToastContainer from "../components/ToastContainer";
import CourseDetailModal from "../components/CourseDetailModal";
import { useCourses, defaultCourses } from "../hooks/useCourses";
import { useNotificationContext } from "../hooks/useNotificationContext";

const NewPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Use the custom hook for course management
  const { courses, loading, error, fetchCourses, enrollInCourse, searchCourses } =
    useCourses(defaultCourses);

  // Use the custom hook for notifications
  const { notifications, addNotification } = useNotificationContext();

  // Initialize filtered courses
  useEffect(() => {
    setFilteredCourses(courses);
  }, [courses]);

  // Uncomment this to fetch courses from API on component mount
  // useEffect(() => {
  //   fetchCourses();
  // }, []);

  // Debounced search effect - triggers 1 second after user stops typing
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm.trim() === "") {
        // If search is empty, show all courses
        setFilteredCourses(courses);
      } else {
        // Perform search after 1 second delay
        const filtered = searchCourses(searchTerm, courses);
        setFilteredCourses(filtered);
      }
    }, 1000);

    // Cleanup: clear the timeout if user types again before 1 second
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, courses, searchCourses]);

  const handleSearch = () => {
    const filtered = searchCourses(searchTerm, courses);
    setFilteredCourses(filtered);
  };

  const handleEnroll = async (courseId, course, type) => {
    if (type === "success") {
      if (course.enrolled) {
        addNotification("info", `You are already enrolled in "${course.title}"!`);
        return;
      }
      const result = await enrollInCourse(courseId);
      if (result.success) {
        addNotification(type, course.title);
        setFilteredCourses((prevFiltered) =>
          prevFiltered.map((c) => (c.id === courseId ? { ...c, enrolled: true } : c))
        );
        setShowModal(false); // Close detail modal if open
      } else {
        addNotification("error", `Failed to enroll: ${result.error}`);
      }
    } else {
      // Handle unsubscribe logic if needed, for now just show notification
      addNotification(type, course.title);
      // You might want to call an API to unsubscribe here
    }
  };

  const handleCardClick = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTimeout(() => {
      setSelectedCourse(null);
    }, 300);
  };

  return (
    <>
      {/* Toast Notifications */}
      <ToastContainer notifications={notifications} />

      {/* Custom Styles */}
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          .page-background {
            background: linear-gradient(-45deg, #f8f9fa, #ffffff, #f0f4f8, #e8f1f9);
            background-size: 400% 400%;
            animation: gradientShift 15s ease infinite;
          }

          .header-section {
            animation: fadeInUp 0.8s ease-out;
          }

          .search-section {
            animation: fadeInUp 0.8s ease-out 0.2s backwards;
          }

          .courses-grid {
            animation: fadeInUp 0.8s ease-out 0.4s backwards;
          }

          .gradient-text {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-shadow: none;
          }

          .search-input {
            transition: all 0.3s ease;
          }

          .search-input:focus {
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.25) !important;
            border-color: #667eea !important;
          }

          .search-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            transition: all 0.3s ease;
            font-weight: 600;
          }

          .search-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
            background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
          }

          .stats-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            background: rgba(102, 126, 234, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 50px;
            border: 1px solid rgba(102, 126, 234, 0.2);
            font-size: 0.875rem;
            color: #495057;
            margin-right: 1rem;
            margin-bottom: 1rem;
            font-weight: 500;
          }

          .feature-icon {
            width: 20px;
            height: 20px;
            fill: #667eea;
          }

          .no-results {
            animation: fadeInUp 0.6s ease-out;
          }

          .loading-spinner {
            animation: fadeInUp 0.6s ease-out;
          }

          .error-alert {
            animation: fadeInUp 0.6s ease-out;
            border-radius: 1rem;
            border: none;
            box-shadow: 0 4px 20px rgba(220, 53, 69, 0.3);
          }
        `}
      </style>

      <div className="page-background" style={{ minHeight: "100vh", color: "#212529" }}>
        <Container
          style={{
            maxWidth: "1400px",
            paddingLeft: "40px",
            paddingRight: "40px",
            paddingTop: "60px",
            paddingBottom: "60px",
          }}
        >
          {/* Header Section */}
          <Row className="mb-5 header-section">
            <Col>
              <div className="mb-3">
                <h1
                  className="fw-bold mb-3"
                  style={{
                    fontSize: "3.5rem",
                    letterSpacing: "-0.02em",
                    lineHeight: "1.2",
                  }}
                >
                  <span className="gradient-text">Discover</span>{" "}
                  <span style={{ color: "#212529" }}>Your Next Course</span>
                </h1>
                <p
                  className="fs-4 mb-4"
                  style={{
                    color: "#6c757d",
                    maxWidth: "600px",
                    lineHeight: "1.6",
                  }}
                >
                  Explore thousands of courses and transform your career with expert-led learning
                </p>
              </div>

              {/* Stats Badges */}
              <div className="d-flex flex-wrap">
                <div className="stats-badge">
                  <svg className="feature-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                  </svg>
                  <span>{courses.length}+ Courses</span>
                </div>
                <div className="stats-badge">
                  <svg className="feature-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  <span>Expert Instructors</span>
                </div>
                <div className="stats-badge">
                  <svg className="feature-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Certified Programs</span>
                </div>
              </div>
            </Col>
          </Row>

          {/* Search Section */}
          <Row className="mb-4 search-section">
            <Col lg={10} xl={8}>
              <InputGroup
                size="lg"
                style={{
                  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
                  borderRadius: "50px",
                }}
              >
                <>
                  <style>
                    {`
                    .search-input::placeholder {
                      color: #495057; /* màu xám đậm dễ đọc */
                      opacity: 1; /* tránh bị mờ nhạt */
                    }
                  `}
                  </style>

                  <Form.Control
                    type="text"
                    placeholder="Search for courses, skills, or topics..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                    style={{
                      backgroundColor: "#ffffff",
                      border: "2px solid #e9ecef",
                      borderRadius: "50px 0 0 50px",
                      color: "#212529",
                      padding: "1rem 1.5rem",
                      fontSize: "1.1rem",
                    }}
                  />
                </>

                <Button
                  className="search-btn"
                  onClick={handleSearch}
                  style={{
                    borderRadius: "0 50px 50px 0",
                    paddingLeft: "2.5rem",
                    paddingRight: "2.5rem",
                    fontSize: "1.1rem",
                  }}
                >
                  <svg
                    style={{ width: "20px", height: "20px", marginRight: "0.5rem" }}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Search
                </Button>
              </InputGroup>
            </Col>
          </Row>

          {/* Loading State */}
          {loading && (
            <Row className="mb-4 loading-spinner">
              <Col className="text-center py-5">
                <Spinner
                  animation="border"
                  variant="primary"
                  style={{ width: "3rem", height: "3rem" }}
                />
                <p className="mt-3 fs-5" style={{ color: "#6c757d" }}>
                  Loading amazing courses for you...
                </p>
              </Col>
            </Row>
          )}

          {/* Error State */}
          {error && (
            <Row className="mb-4">
              <Col lg={10} xl={8}>
                <Alert variant="danger" className="error-alert">
                  <div className="d-flex align-items-center">
                    <svg
                      style={{ width: "24px", height: "24px", marginRight: "1rem" }}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <strong>Error loading courses</strong>
                      <p className="mb-0 mt-1">{error}</p>
                    </div>
                  </div>
                </Alert>
              </Col>
            </Row>
          )}

          {/* Enrolled Courses Counter */}
          <Row className="mb-4">
            <Col>
              <div
                className="d-flex"
                style={{
                  animation: "fadeInUp 0.8s ease-out 0.3s backwards",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#20c997",
                    color: "white",
                    padding: "12px 24px",
                    borderRadius: "25px",
                    fontSize: "16px",
                    fontWeight: "600",
                    boxShadow: "0 4px 12px rgba(32, 201, 151, 0.3)",
                  }}
                >
                  You have enrolled in {courses.filter((course) => course.enrolled).length} courses
                </div>
              </div>
            </Col>
          </Row>

          {/* Courses Grid */}
          <Row className="courses-grid">
            {filteredCourses.map((course, index) => (
              <Col
                key={course.id}
                lg={4}
                md={6}
                className="mb-4"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s backwards`,
                }}
              >
                <CourseCard
                  course={course}
                  onEnroll={handleEnroll}
                  onCardClick={handleCardClick}
                  darkTheme={true}
                />
              </Col>
            ))}
          </Row>

          {/* No Results */}
          {filteredCourses.length === 0 && !loading && (
            <Row className="mt-5 no-results">
              <Col className="text-center py-5">
                <div
                  style={{
                    fontSize: "5rem",
                    marginBottom: "1.5rem",
                    opacity: 0.6,
                  }}
                >
                  🔍
                </div>
                <h3 className="fw-bold mb-3" style={{ color: "#212529", fontSize: "2rem" }}>
                  No courses found
                </h3>
                <p style={{ color: "#6c757d", fontSize: "1.1rem" }}>
                  Try searching with different keywords or{" "}
                  <span
                    onClick={() => {
                      setSearchTerm("");
                      setFilteredCourses(courses);
                    }}
                    style={{
                      color: "#667eea",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                  >
                    browse all courses
                  </span>
                </p>
              </Col>
            </Row>
          )}
        </Container>

        {/* Course Detail Modal */}
        <CourseDetailModal
          course={selectedCourse}
          show={showModal}
          onHide={handleCloseModal}
          onEnroll={handleEnroll}
        />
      </div>
    </>
  );
};

export default NewPage;
