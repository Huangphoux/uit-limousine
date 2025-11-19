import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FaBook, FaChartLine, FaFileAlt, FaUsers, FaRegClock } from "react-icons/fa";
import Header from "../components/Header";
import CreateCourseModal from "../components/CreateCourseModal";
import EditCourseModal from "../components/instructor-screen/course-management/EditCourseModal";
import CourseManagementView from "../components/instructor-screen/course-management/CourseManagementView";
import AssignmentGradingView from "../components/instructor-screen/grade-assignment/AssignmentGradingView";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

const InstructorScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("course-management"); // "assignment-grading" or "course-management"
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filteredCourses, setFilteredCourses] = useState([]);

  // Course Management Part
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
      durationWeeks: "12",
      durationDays: "90",
      durationHours: "180",
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
      durationWeeks: "8",
      durationDays: "60",
      durationHours: "120",
    },
    {
      id: 3,
      title: "React Fundamentals",
      description: "Learn the basics of React development",
      image: "public/images/course-placeholder.svg",
      enrolledStudents: 12,
      duration: "6 weeks",
      status: "Wait for approval",
      rating: 0,
      durationWeeks: "6",
      durationDays: "42",
      durationHours: "90",
    },
    {
      id: 4,
      title: "Python for Beginners",
      description: "Introduction to Python programming",
      image: "public/images/course-placeholder.svg",
      enrolledStudents: 0,
      duration: "4 months",
      status: "Denied",
      rating: 0,
      denialReason: "abc",
      durationWeeks: "16",
      durationDays: "120",
      durationHours: "240",
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
    setSelectedCourse(courseData);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedCourse(null);
  };

  const handleSaveEditedCourse = (updatedCourseData) => {
    // Update the course in the courses array
    setCourses((prevCourses) =>
      prevCourses.map((course) => (course.id === updatedCourseData.id ? updatedCourseData : course))
    );
    console.log("Course updated:", updatedCourseData);
    // You can add API call to update the course data here
  };

  const handlePublishCourse = (courseDataWithAction) => {
    const { action, ...courseData } = courseDataWithAction;

    switch (action) {
      case "resend":
        // Handle resending denied course
        break;
      case "hide":
        // Handle hiding published course
        break;
      case "publish":
        // Handle publishing draft course
        break;
    }
  };

  const handleDeleteCourse = (courseData) => {
    console.log("Delete course:", courseData);
    // Add delete course logic here
    setCourses(courses.filter((course) => course.id !== courseData.id));
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
  };

  // Initialize filtered courses
  useEffect(() => {
    setFilteredCourses(courses);
  }, [courses]);

  // Simulate loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Debounced search effect - triggers 1 second after user stops typing
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery.trim() === "") {
        // If search is empty, show all courses
        setFilteredCourses(courses);
      } else {
        // Perform search after 1 second delay
        const filtered = courses.filter(
          (course) =>
            course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.status.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredCourses(filtered);
      }
    }, 1000);

    // Cleanup: clear the timeout if user types again before 1 second
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, courses]);

  return (
    <>
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

          .instructor-page-background {
            background: linear-gradient(-45deg, #f8f9fa, #ffffff, #f0f4f8, #e8f1f9);
            background-size: 400% 400%;
            animation: gradientShift 15s ease infinite;
          }

          .tab-section {
            animation: fadeInUp 0.8s ease-out;
          }

          .stats-section {
            animation: fadeInUp 0.8s ease-out 0.2s backwards;
          }

          .search-section {
            animation: fadeInUp 0.8s ease-out 0.4s backwards;
          }

          .courses-grid {
            animation: fadeInUp 0.8s ease-out 0.6s backwards;
          }

          .course-management-card {
            transition: all 0.3s ease;
            cursor: pointer;
          }

          .course-management-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
          }

          .loading-spinner {
            animation: fadeInUp 0.6s ease-out;
          }

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
          className="pt-5 mt-4 instructor-page-background"
          style={{ minHeight: "100vh" }}
        >
          {/* Tab Navigation */}
          <div className="mb-4 d-flex justify-content-center tab-section">
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

          {/* Content Section */}
          <Row>
            <Col md={12}>
              <Card className="border-0 shadow-sm" style={{ backgroundColor: "white" }}>
                <Card.Body className="p-4" style={{ color: "black" }}>
                  {/* Course Management */}
                  {activeTab === "course-management" && (
                    <CourseManagementView
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      courses={courses}
                      filteredCourses={filteredCourses}
                      setFilteredCourses={setFilteredCourses}
                      loading={loading}
                      onCreateCourse={handleCreateCourse}
                      onEditCourse={handleEditCourse}
                      onPublishCourse={handlePublishCourse}
                      onDeleteCourse={handleDeleteCourse}
                    />
                  )}

                  {/* Assignment Grading */}
                  {activeTab === "assignment-grading" && (
                    <AssignmentGradingView courses={courses} />
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

      {/* Edit Course Modal */}
      <EditCourseModal
        show={showEditModal}
        onClose={handleCloseEditModal}
        onSave={handleSaveEditedCourse}
        courseData={selectedCourse}
      />
    </>
  );
};

export default InstructorScreen;
