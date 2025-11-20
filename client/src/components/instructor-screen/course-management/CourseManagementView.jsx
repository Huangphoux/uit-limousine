import React from "react";
import { Row, Col, Form, Button, Spinner, Card } from "react-bootstrap";
import { FaSearch, FaPlus, FaBook, FaChartLine, FaFileAlt, FaUsers } from "react-icons/fa";
import CourseManagementCard from "./CourseManagementCard";

const CourseManagementView = ({
  searchQuery,
  setSearchQuery,
  courses,
  filteredCourses,
  setFilteredCourses,
  loading,
  onCreateCourse,
  onEditCourse,
  onPublishCourse,
  onDeleteCourse,
}) => {
  // Calculate dynamic stats values
  const calculateCourseStats = () => {
    const totalCourses = courses.length;
    const publishedCourses = courses.filter(
      (course) => course.status?.toLowerCase() === "published"
    ).length;
    const draftCourses = courses.filter(
      (course) => course.status?.toLowerCase() === "draft"
    ).length;
    const totalStudents = courses.reduce((sum, course) => sum + (course.enrolledStudents || 0), 0);

    return {
      totalCourses,
      publishedCourses,
      draftCourses,
      totalStudents,
    };
  };

  // Get calculated stats
  const courseStats = calculateCourseStats();

  const courseManagementStats = [
    {
      title: "Total Courses",
      value: courseStats.totalCourses.toString(),
      icon: <FaBook className="text-white" />,
      bgColor: "rgba(13, 110, 253, 0.6)",
    },
    {
      title: "Published",
      value: courseStats.publishedCourses.toString(),
      icon: <FaChartLine className="text-white" />,
      bgColor: "#28a745",
    },
    {
      title: "Drafts",
      value: courseStats.draftCourses.toString(),
      icon: <FaFileAlt className="text-white" />,
      bgColor: "orange",
    },
    {
      title: "Students",
      value: courseStats.totalStudents.toString(),
      icon: <FaUsers className="text-white" />,
      bgColor: "rgba(232, 47, 161, 0.7)",
    },
  ];
  const handleManualSearch = () => {
    // Manual search trigger
    const filtered = courses.filter(
      (course) =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCourses(filtered);
  };

  return (
    <>
      {/* Stats Cards */}
      <Row className="mb-4 stats-section">
        {courseManagementStats.map((stat, index) => (
          <Col key={index} xs={12} sm={6} md={3} className="mb-3">
            <Card
              className="h-100 shadow-sm border-0"
              style={{
                backgroundColor: "#bfeff9",
                borderRadius: "12px",
              }}
            >
              <Card.Body className="p-3 d-flex align-items-center justify-content-between">
                <div>
                  <div className="small text-black">{stat.title}</div>
                  <div className="fs-2 fw-bold text-black mb-0">{stat.value}</div>
                </div>
                <div
                  className="rounded d-flex align-items-center justify-content-center"
                  style={{
                    backgroundColor: stat.bgColor,
                    minWidth: "56px",
                    minHeight: "56px",
                    fontSize: "1.5rem",
                  }}
                >
                  {stat.icon}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Search and Create Button */}
      <Row className="mb-4 align-items-center search-section">
        <Col md={8}>
          <div className="d-flex">
            <div className="position-relative flex-grow-1">
              <Form.Control
                id="course-search-input"
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input-custom"
                style={{
                  color: "#000",
                  backgroundColor: "#ADD8E6",
                  border: "1px solid #e9ecef",
                  borderRadius: "8px 0 0 8px",
                  height: "50px",
                  fontSize: "16px",
                  paddingLeft: "16px",
                }}
              />
            </div>
            <Button
              variant="primary"
              onClick={handleManualSearch}
              style={{
                borderRadius: "0 8px 8px 0",
                height: "50px",
                minWidth: "60px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
              }}
            >
              <FaSearch />
            </Button>
          </div>
        </Col>
        <Col md={4} className="text-end">
          <Button
            variant="primary"
            onClick={onCreateCourse}
            className="d-flex align-items-center ms-auto"
            style={{
              borderRadius: "8px",
              height: "50px",
              fontSize: "16px",
              padding: "12px 20px",
            }}
          >
            <FaPlus className="me-2" />
            Create New Course
          </Button>
        </Col>
      </Row>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-5 loading-spinner">
          <Spinner animation="border" variant="primary" style={{ width: "3rem", height: "3rem" }} />
          <div className="mt-3">
            <h5 style={{ color: "#6c757d" }}>Loading your courses...</h5>
          </div>
        </div>
      ) : (
        <>
          {/* Course Cards */}
          {filteredCourses.length > 0 ? (
            <Row className="g-4 courses-grid">
              {filteredCourses.map((course, index) => (
                <Col
                  md={4}
                  key={course.id}
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.15}s backwards`,
                  }}
                >
                  <div className="course-management-card">
                    <CourseManagementCard
                      courseData={course}
                      onEdit={onEditCourse}
                      onPublish={onPublishCourse}
                      onDelete={onDeleteCourse}
                    />
                  </div>
                </Col>
              ))}
            </Row>
          ) : (
            /* Empty State */
            <div className="text-center py-5" style={{ animation: "fadeInUp 0.6s ease-out" }}>
              <div className="mb-4">
                {searchQuery.trim() ? (
                  <div
                    style={{
                      fontSize: "5rem",
                      marginBottom: "1.5rem",
                      opacity: 0.6,
                    }}
                  >
                    🔍
                  </div>
                ) : (
                  <FaBook size={80} className="text-muted" />
                )}
              </div>
              <h5 className="mb-3" style={{ color: "black" }}>
                {searchQuery.trim() ? "No courses found" : "No courses yet"}
              </h5>
              <p className="mb-4" style={{ color: "black" }}>
                {searchQuery.trim() ? (
                  <>
                    Try searching with different keywords or{" "}
                    <span
                      onClick={() => setSearchQuery("")}
                      style={{
                        color: "#667eea",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                    >
                      clear search
                    </span>
                  </>
                ) : (
                  "Start by creating your first course"
                )}
              </p>
              {!searchQuery.trim() && (
                <Button
                  variant="dark"
                  onClick={onCreateCourse}
                  className="d-flex align-items-center mx-auto"
                  style={{ borderRadius: "8px" }}
                >
                  <FaPlus className="me-2" />
                  Create New Course
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default CourseManagementView;
