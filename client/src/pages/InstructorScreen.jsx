import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { FaBook, FaChartLine, FaFileAlt, FaUsers, FaSearch, FaPlus } from "react-icons/fa";
import Header from "../components/Header";
import CreateCourseModal from "../components/CreateCourseModal";
import CourseManagementCard from "../components/CourseManagementCard";

const InstructorScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("course-management"); // "assignment-grading" or "course-management"
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Sample course data
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "Coding basic",
      description: "Learn how to code",
      image: "public/images/course-placeholder.svg",
      enrolledStudents: 0,
      duration: "3 months",
      status: "Draft",
      rating: 0,
    },
    {
      id: 2,
      title: "Advanced JavaScript",
      description: "Master advanced JavaScript concepts",
      image: "public/images/course-placeholder.svg",
      enrolledStudents: 25,
      duration: "2 months",
      status: "Published",
      rating: 4.5,
    },
  ]);

  const placeholderStyle = {
    "--placeholder-color": "#ddd",
  };

  const handleCreateCourse = () => {
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
  };

  const handleSaveCourse = (courseData) => {
    // Handle save course logic here
    console.log("New course data:", courseData);
    // You can add API call to save the course data
    // For now, just close the modal
    setShowCreateModal(false);
  };

  const handleEditCourse = (courseData) => {
    console.log("Edit course:", courseData);
    // Add edit course logic here
  };

  const handlePublishCourse = (courseData) => {
    console.log("Publish course:", courseData);
    // Add publish course logic here
  };

  const handleDeleteCourse = (courseData) => {
    console.log("Delete course:", courseData);
    // Add delete course logic here
    setCourses(courses.filter((course) => course.id !== courseData.id));
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
  };

  const courseManagementStats = [
    {
      title: "Total Courses",
      value: "0",
      icon: <FaBook className="text-primary" />,
      bgColor: "rgba(13, 110, 253, 0.6)",
    },
    {
      title: "Published",
      value: "0",
      icon: <FaChartLine className="text-success" />,
      bgColor: "rgba(25, 135, 84, 0.6)",
    },
    {
      title: "Drafts",
      value: "0",
      icon: <FaFileAlt className="text-yellow" />,
      bgColor: "orange",
    },
    {
      title: "Students",
      value: "0",
      icon: <FaUsers className="text-black" />,
      bgColor: "rgba(232, 47, 161, 0.7)",
    },
  ];

  const assignmentGradingStats = [
    {
      title: "Waiting",
      value: "0",
      icon: <FaFileAlt className="text-dark" />,
      bgColor: "#FFA500", // Orange
    },
    {
      title: "Published",
      value: "0",
      icon: <FaChartLine className="text-white" />,
      bgColor: "#32CD32", // Green
    },
    {
      title: "Denied",
      value: "0",
      icon: <FaFileAlt className="text-white" />,
      bgColor: "#FF4500", // Red-Orange
    },
    {
      title: "Courses",
      value: "0",
      icon: <FaBook className="text-white" />,
      bgColor: "#1E90FF", // Blue
    },
  ];

  return (
    <>
      <style>
        {`
          #course-search-input::placeholder {
            color: #000 !important;
            opacity: 0.6 !important;
          }
          #course-search-input::-webkit-input-placeholder {
            color: #000 !important;
            opacity: 0.6 !important;
          }
          #course-search-input::-moz-placeholder {
            color: #000 !important;
            opacity: 0.6 !important;
          }
          #course-search-input:-ms-input-placeholder {
            color: #000 !important;
            opacity: 0.6 !important;
          }
          input#course-search-input::placeholder {
            color: #000 !important;
            opacity: 0.6 !important;
          }
        `}
      </style>
      <div>
        <Header />

        {/* Main Content */}
        <Container
          fluid
          className="pt-5 mt-4"
          style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
        >
          {/* Tab Navigation */}
          <div className="mb-4 d-flex justify-content-center">
            <div
              className="d-flex rounded-3 p-1 shadow-sm"
              style={{
                backgroundColor: "#D9D9D9",
                border: "1px solid #e9ecef",
                height: "60px",
                width: "90vw",
              }}
            >
              <div className="flex-fill">
                <div
                  className={`text-center d-flex align-items-center justify-content-center h-100 rounded-3 transition-all ${
                    activeTab === "assignment-grading"
                      ? "bg-white text-dark shadow-sm"
                      : "text-dark bg-transparent"
                  }`}
                  onClick={() => handleTabSwitch("assignment-grading")}
                  style={{
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    fontWeight: activeTab === "assignment-grading" ? "600" : "500",
                  }}
                >
                  <span style={{ fontSize: "20px", fontWeight: "bold" }}>Grade Assignments</span>
                </div>
              </div>
              <div className="flex-fill">
                <div
                  className={`text-center d-flex align-items-center justify-content-center h-100 rounded-3 transition-all ${
                    activeTab === "course-management"
                      ? "bg-white text-dark shadow-sm"
                      : "text-dark bg-transparent"
                  }`}
                  onClick={() => handleTabSwitch("course-management")}
                  style={{
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    fontWeight: activeTab === "course-management" ? "600" : "500",
                  }}
                >
                  <span style={{ fontSize: "20px", fontWeight: "bold" }}>Course Management</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <Row className="mb-2">
            {(activeTab === "course-management"
              ? courseManagementStats
              : assignmentGradingStats
            ).map((card, index) => (
              <Col md={3} key={index} className="mb-3">
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

          {/* Content Section */}
          <Row>
            <Col md={12}>
              <Card className="border-0 shadow-sm" style={{ backgroundColor: "white" }}>
                <Card.Body className="p-4" style={{ color: "black" }}>
                  {/* Course Management */}
                  {activeTab === "course-management" && (
                    <>
                      {/* Search and Create Button */}
                      <Row className="mb-4 align-items-center">
                        <Col md={8}>
                          <div className="position-relative">
                            <FaSearch
                              className="position-absolute"
                              style={{
                                left: "12px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                zIndex: 2,
                                color: "black",
                              }}
                            />
                            <Form.Control
                              id="course-search-input"
                              type="text"
                              placeholder="Search courses..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="ps-5 search-input-custom"
                              style={{
                                color: "#000",
                                backgroundColor: "#ADD8E6",
                                border: "1px solid #e9ecef",
                                borderRadius: "8px",
                                height: "50px",
                                fontSize: "16px",
                              }}
                            />
                          </div>
                        </Col>
                        <Col md={4} className="text-end">
                          <Button
                            variant="primary"
                            onClick={handleCreateCourse}
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

                      {/* Course Cards */}
                      {courses.length > 0 ? (
                        <Row className="g-4">
                          {courses.map((course) => (
                            <Col md={4} key={course.id}>
                              <CourseManagementCard
                                courseData={course}
                                onEdit={handleEditCourse}
                                onPublish={handlePublishCourse}
                                onDelete={handleDeleteCourse}
                              />
                            </Col>
                          ))}
                        </Row>
                      ) : (
                        /* Empty State */
                        <div className="text-center py-5">
                          <div className="mb-4">
                            <FaBook size={80} className="text-muted" />
                          </div>
                          <h5 className="mb-3" style={{ color: "black" }}>
                            No courses yet
                          </h5>
                          <p className="mb-4" style={{ color: "black" }}>
                            Start by creating your first course
                          </p>
                          <Button
                            variant="dark"
                            onClick={handleCreateCourse}
                            className="d-flex align-items-center mx-auto"
                            style={{ borderRadius: "8px" }}
                          >
                            <FaPlus className="me-2" />
                            Create New Course
                          </Button>
                        </div>
                      )}
                    </>
                  )}

                  {/* Assignment-grading */}
                  {activeTab === "assignment-grading" && (
                    <>
                      <div className="mb-4">
                        <h4 className="mb-3" style={{ color: "black" }}>
                          📝 Grade Assignments
                        </h4>
                        <p style={{ color: "black" }}>Grade and evaluate student assignments</p>
                      </div>

                      {/* Assignment Grading Content */}
                      <div className="text-center py-5">
                        <div className="mb-4">
                          <FaFileAlt size={80} className="text-muted" style={{ opacity: 0.3 }} />
                        </div>
                        <h5 className="mb-3" style={{ color: "black" }}>
                          No assignments to grade
                        </h5>
                        <p className="mb-4" style={{ color: "black" }}>
                          Student assignments will appear here after they submit their work
                        </p>
                        <Button
                          variant="outline-primary"
                          disabled
                          className="d-flex align-items-center mx-auto"
                          style={{ borderRadius: "8px" }}
                        >
                          📋 Assignment List
                        </Button>
                      </div>
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Create Course Modal */}
      <CreateCourseModal
        show={showCreateModal}
        onClose={handleCloseModal}
        onSave={handleSaveCourse}
      />
    </>
  );
};

export default InstructorScreen;
