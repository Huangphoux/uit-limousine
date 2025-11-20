import React, { useState, useEffect } from "react";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import { FaSearch, FaClock, FaTimes, FaBook } from "react-icons/fa";
import ApprovalCourseCard from "./ApprovalCourseCard";

const CourseApprovingScreen = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  courses,
  setCourses,
  loading,
  filteredCourses,
  setFilteredCourses,
}) => {
  // Filter and search functionality
  useEffect(() => {
    let filtered = courses;

    // Filter by status
    if (statusFilter !== "All") {
      filtered = filtered.filter((course) => course.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredCourses(filtered);
  }, [searchQuery, statusFilter, courses, setFilteredCourses]);

  // Handle course approval
  const handleApproveCourse = async (courseData) => {
    console.log("Approving course:", courseData);

    try {
      // Update course status to approved/published
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === courseData.id ? { ...course, status: "Approved" } : course
        )
      );

      // TODO: Add API call here to update the course status on the backend
      // await updateCourseStatus(courseData.id, 'Approved');

      console.log(`Course "${courseData.title}" has been approved successfully`);
    } catch (error) {
      console.error("Error approving course:", error);
      // TODO: Handle error (show toast, revert state, etc.)
    }
  };

  // Handle course denial
  const handleDenyCourse = async (courseData, reason = "") => {
    console.log("Denying course:", courseData, "Reason:", reason);

    try {
      // Update course status to denied with reason
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === courseData.id
            ? { ...course, status: "Denied", denialReason: reason }
            : course
        )
      );

      // TODO: Add API call here to update the course status on the backend
      // await updateCourseStatus(courseData.id, 'Denied', reason);

      console.log(`Course "${courseData.title}" has been denied successfully`);
    } catch (error) {
      console.error("Error denying course:", error);
      // TODO: Handle error (show toast, revert state, etc.)
    }
  };

  // Calculate Course Approval stats
  const calculateCourseApprovalStats = () => {
    const waitingCourses = courses.filter((course) => course.status === "Waiting").length;
    const deniedCourses = courses.filter((course) => course.status === "Denied").length;
    const totalCourses = courses.length;

    return {
      waitingCourses,
      deniedCourses,
      totalCourses,
    };
  };

  const courseApprovalStats = calculateCourseApprovalStats();

  const courseApprovalStatsCards = [
    {
      title: "Courses",
      value: courseApprovalStats.totalCourses.toString(),
      icon: <FaBook className="text-white" />,
      bgColor: "#007BFF",
    },
    {
      title: "Waiting",
      value: courseApprovalStats.waitingCourses.toString(),
      icon: <FaClock className="text-white" />,
      bgColor: "#FFA500",
    },
    {
      title: "Denied",
      value: courseApprovalStats.deniedCourses.toString(),
      icon: <FaTimes className="text-white" />,
      bgColor: "#DC3545",
    },
  ];

  return (
    <div>
      {/* Stats Cards */}
      <Row className="mb-2 stats-section">
        {courseApprovalStatsCards.map((card, index) => (
          <Col md={4} key={index} className="mb-3">
            <Card className="h-100 border-0 shadow-sm" style={{ backgroundColor: "#BBEDF9" }}>
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="text-black mb-2">{card.title}</h6>
                    <h2 className="mb-0 fw-bold text-black">{card.value}</h2>
                  </div>
                  <div
                    className="rounded p-3 d-flex align-items-center justify-content-center"
                    style={{
                      backgroundColor: card.bgColor,
                      minWidth: "56px",
                      minHeight: "56px",
                    }}
                  >
                    {React.cloneElement(card.icon, { size: 24 })}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Search and Filter Section */}
      <Row className="mb-4 align-items-center search-section">
        <Col md={8}>
          <div className="d-flex">
            <div className="position-relative flex-grow-1">
              <Form.Control
                id="course-search-input"
                type="text"
                placeholder="Find courses, instructors..."
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
        <Col md={4}>
          <div className="d-flex gap-2 justify-content-end">
            {["All", "Waiting", "Denied"].map((filter) => (
              <Button
                key={filter}
                variant={statusFilter === filter ? "dark" : "outline-secondary"}
                onClick={() => setStatusFilter(filter)}
                style={{
                  fontSize: "14px",
                  padding: "8px 16px",
                  borderRadius: "20px",
                }}
              >
                {filter}
              </Button>
            ))}
          </div>
        </Col>
      </Row>

      {/* Course Cards or Empty State */}
      {loading ? (
        <div className="text-center py-5 loading-spinner">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading pending courses...</p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-5">
          <div className="mb-4">
            <div
              style={{
                fontSize: "5rem",
                marginBottom: "1.5rem",
                opacity: 0.6,
              }}
            >
              😔
            </div>
          </div>
          <h5 className="mb-3" style={{ color: "black" }}>
            No courses yet
          </h5>
          <p className="mb-4" style={{ color: "black" }}>
            No courses match your current search and filter criteria.
          </p>
        </div>
      ) : (
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
                <ApprovalCourseCard
                  courseData={course}
                  onApprove={handleApproveCourse}
                  onDeny={handleDenyCourse}
                />
              </div>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default CourseApprovingScreen;
