import React from "react";
import { Container, Row, Col, Button, Form, InputGroup, Spinner, Alert } from "react-bootstrap";
import { useState, useEffect } from "react";
import CourseCard from "../components/CourseCard";
import ToastContainer from "../components/ToastContainer";
import CourseDetailModal from "../components/CourseDetailModal";
import { useCourses } from "../hooks/useCourses";
import { useNotificationContext } from "../hooks/useNotificationContext";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;

const NewPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loadingCourseDetail, setLoadingCourseDetail] = useState(false);
  const [courseDetailError, setCourseDetailError] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [lastSearchTerm, setLastSearchTerm] = useState("");
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
  const token = localStorage.getItem("accessToken");
  // Use the custom hook for course management
  const {
    courses,
    loading,
    error,
    fetchCourses,
    enrollInCourse,
    unsubscribeFromCourse,
    searchCourses,
    setCourses,
  } = useCourses([]);

  // Use the custom hook for notifications
  const { notifications, addNotification } = useNotificationContext();
  // Fetch courses from API on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSearch = () => {
    const filtered = searchCourses(searchTerm, courses);
    setFilteredCourses(filtered);
  };
  // ✅ THÊM: Search qua API
  useEffect(() => {
    // Nếu search term thay đổi, hiển thị loading ngay lập tức
    if (searchTerm !== lastSearchTerm) {
      setIsSearching(true);
    }

    const debounceTimer = setTimeout(async () => {
      setLastSearchTerm(searchTerm);

      try {
        await fetchCourses({
          search: searchTerm.trim() || undefined,
          limit: 100,
        });
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        // Delay nhỏ để tránh flicker
        setTimeout(() => {
          setIsSearching(false);
        }, 150);
      }
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleEnroll = async (courseId, course, type) => {
    if (type === "success") {
      if (course.enrolled) {
        addNotification("info", `You are already enrolled in "${course.title}"!`);
        return;
      }
      const result = await enrollInCourse(courseId);
      if (result.success) {
        addNotification("success", `Enrolled in ${course.title}`);
        // Hook already updates courses, so just update filteredCourses to keep them in sync
        setCourses((prev) => prev.map((c) => (c.id === courseId ? { ...c, enrolled: true } : c)));

        // Nếu Modal đang mở, cập nhật luôn object đang chọn
        setSelectedCourse((prev) => ({ ...prev, enrolled: true }));
      } else {
        addNotification("error", `Enrollment failed: ${result.error}`);
      }
    } else if (type === "unsubscribe") {
      // Handle unsubscribe using the hook function
      const result = await unsubscribeFromCourse(courseId);
      if (result.success) {
        setEnrolledCourseIds((prev) => prev.filter((id) => id !== courseId));

        setSelectedCourse((prev) => (prev ? { ...prev, enrolled: false } : null));

        setFilteredCourses((prevFiltered) =>
          prevFiltered.map((c) => (c.id === courseId ? { ...c, enrolled: false } : c))
        );

        addNotification("unsubscribe", course.title);
      }
    } else if (type === "payment") {
      // Handle payment confirmation - update isPaid status
      setCourses((prevCourses) =>
        prevCourses.map((c) => (c.id === courseId ? { ...c, isPaid: true } : c))
      );
      setFilteredCourses((prevFiltered) =>
        prevFiltered.map((c) => (c.id === courseId ? { ...c, isPaid: true } : c))
      );
      addNotification("success", `Payment confirmed for "${course.title}"!`);
    } else {
      // Handle other types of notifications
      addNotification(type, course.title);
    }
  };

  const handleCardClick = async (course) => {
    setShowModal(true);
    setLoadingCourseDetail(true);
    setCourseDetailError(null);
    setSelectedCourse(null);

    try {
      const token = localStorage.getItem("accessToken");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/courses/${course.id}`, {
        method: "GET",
        headers: headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch course details: ${response.statusText}`);
      }

      const result = await response.json();

      // Debug: Log the actual API response
      console.log("API Response:", result);
      // Check if we have a valid course object (API returns course directly, not wrapped in success/data)
      if (result && result.id) {
        // Map API response to the format expected by the modal
        const courseDetail = {
          id: result.id,
          title: result.title,
          provider: result.provider || "Stanford University",
          category: course.category || "General",
          description: result.description || result.shortDesc || "No description available",
          rating: result.rating || 0,
          students: result.students || 0,
          level: result.level || "BEGINNER",
          duration: course.duration || "N/A",
          image: result.coverImage || course.image,
          enrolled: course.enrolled || false,
          instructor: result.instructor?.name || "Unknown Instructor",
          price: result.price || 0,
          isPaid: course.isPaid || false,
          // Additional details from API
          slug: result.slug,
          shortDesc: result.shortDesc,
          language: result.language,
          modules: result.modules || [],
          reviewCount: result.reviews?.length || 0,
          published: result.published,
          publishDate: result.publishDate,
          createdAt: result.createdAt,
          updatedAt: result.updatedAt,
          instructorBio: result.instructor?.bio,
          instructorAvatar: result.instructor?.avatarUrl,
          coverImage: result.coverImage,
        };

        console.log("Mapped Course Detail:", courseDetail);

        setSelectedCourse(courseDetail);
      } else {
        throw new Error("Invalid response format: Missing course ID");
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
      setCourseDetailError(error.message);
      // Fallback to the basic course data from the card
      setSelectedCourse(course);
    } finally {
      setLoadingCourseDetail(false);
    }
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
            .course-item-container {
            transition: all 0.4s ease-in-out;
          }
          .searching-overlay {
            opacity: 1;
            pointer-events: none;
            filter: grayscale(0.5);
          }
          .skeleton-card {
            background: #e9ecef;
            height: 350px;
            border-radius: 1rem;
            position: relative;
            overflow: hidden;
          }
          .skeleton-card::after {
            content: "";
            position: absolute;
            top: 0; right: 0; bottom: 0; left: 0;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
            animation: skeleton-wave 1.5s infinite;
          }
          @keyframes skeleton-wave {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
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
            background: "#f8f9fa",
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
                      <strong className="home-card-error">Error loading courses</strong>
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
                  You have enrolled in{" "}
                  {courses.filter((course) => course && course.enrolled).length} courses
                </div>
              </div>
            </Col>
          </Row>

          {/* Courses Grid */}
          <Row
            className={`courses-grid ${isSearching ? "searching-overlay" : ""}`}
            style={{ transition: "opacity 0.3s" }}
          >
            {" "}
            {loading && courses.length === 0
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Col key={i} lg={4} md={6} className="mb-4">
                    <div className="skeleton-card" />
                  </Col>
                ))
              : // HIỂN THỊ DANH SÁCH KHÓA HỌC
                courses
                  .filter((course) => course && course.id)
                  .map((course) => (
                    <Col
                      key={course.id}
                      lg={4}
                      md={6}
                      className="mb-4 course-item-container"
                      style={{
                        animation: `fadeInUp 0.5s ease-out forwards`,
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
          {courses.length === 0 && !loading && (
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
          {isSearching && courses.length > 0 && (
            <div className="text-center mt-3">
              <Spinner animation="grow" size="sm" variant="primary" />
              <span className="ms-2 text-muted">Updating results...</span>
            </div>
          )}

          {/* No Results - Chỉ hiện khi thực sự không còn gì và không đang loading */}
          {courses.length === 0 && !loading && !isSearching && (
            <Row className="mt-5 no-results">...</Row>
          )}
        </Container>

        {/* Course Detail Modal */}
        <CourseDetailModal
          course={selectedCourse}
          show={showModal}
          onHide={handleCloseModal}
          onEnroll={handleEnroll}
          loading={loadingCourseDetail}
          error={courseDetailError}
        />
      </div>
    </>
  );
};

export default NewPage;
