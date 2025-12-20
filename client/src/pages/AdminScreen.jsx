import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import Header from "../components/Header";
import CourseApprovingScreen from "../components/admin-screen/course-approval/CourseApprovingScreen";
import UserManagementView from "../components/admin-screen/user-management/UserManagementView";
import { toast } from "sonner";

const AdminScreen = () => {
  const [activeTab, setActiveTab] = useState("course-approval"); // "course-approval" or "user-management"
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [filteredCourses, setFilteredCourses] = useState([]);

  const [courses, setCourses] = useState([]);

  const API_BASE_URL = "http://localhost:3000/admin"; // hoặc URL backend của bạn

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/courses`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }

      const result = await response.json();

      if (result.status === "success") {
        // Transform API data to match component format
        const transformedCourses = result.data.courses.map((course) => ({
          id: course.id,
          title: course.title,
          description: "", // API không có field này
          instructor: course.instructor.name || "Unknown",
          submittedDate: new Date(course.createdAt).toISOString().split("T")[0],
          status: course.published ? "Approved" : "Waiting",
          estimatedDuration: "", // Tính từ modules nếu cần
          category: course.category || "Uncategorized",
          image: course.coverImage || "https://via.placeholder.com/300x200",
          modules: course.modules.map((module) => ({
            id: module.id,
            title: module.title,
            description: "",
            duration: "", // Tính từ lessons nếu cần
            lessons: module.lessons.map((lesson) => ({
              id: lesson.id,
              title: lesson.title,
              type: lesson.contentType,
              duration: lesson.durationSec ? `${Math.floor(lesson.durationSec / 60)} minutes` : "",
              content: "",
            })),
          })),
        }));

        setCourses(transformedCourses);
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
      // Có thể set error state ở đây
    } finally {
      setLoading(false);
    }
  };

  // Thay thế useEffect cũ:
  useEffect(() => {
    fetchCourses();
  }, []);

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
  };
  // Initialize filtered courses
  useEffect(() => {
    setFilteredCourses(courses);
  }, [courses]);

  // Handle Approve từ Frontend
  const handleApproveCourse = async (courseData) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/courses/${courseData.id}/update-publish-status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({
            action: "APPROVE",
          }),
        }
      );

      if (response.ok) {
        fetchCourses();
        toast.success("Course Approved!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Deny từ Frontend
  const handleRejectCourse = async (courseData, reason) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/courses/${courseData.id}/update-publish-status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({
            action: "REJECT",
            reason: reason,
          }),
        }
      );

      if (response.ok) {
        fetchCourses();
        toast.success("Course Rejected!");
      }
    } catch (err) {
      console.error(err);
    }
  };
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

          .admin-page-background {
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
        <Container fluid className="pt-5 mt-4 admin-page-background" style={{ minHeight: "100vh" }}>
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
                    activeTab === "course-approval"
                      ? "bg-white text-dark shadow-sm"
                      : "text-dark bg-transparent"
                  }`}
                  onClick={() => handleTabSwitch("course-approval")}
                  style={{
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    fontWeight: activeTab === "course-approval" ? "600" : "500",
                  }}
                >
                  <span style={{ fontSize: "20px", fontWeight: "bold" }}>Course Approval</span>
                </div>
              </div>
              <div className="flex-fill">
                <div
                  className={`text-center d-flex align-items-center justify-content-center h-100 rounded-3 transition-all ${
                    activeTab === "user-management"
                      ? "bg-white text-dark shadow-sm"
                      : "text-dark bg-transparent"
                  }`}
                  onClick={() => handleTabSwitch("user-management")}
                  style={{
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    fontWeight: activeTab === "user-management" ? "600" : "500",
                  }}
                >
                  <span style={{ fontSize: "20px", fontWeight: "bold" }}>User Management</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <Row>
            <Col md={12}>
              <Card className="border-0 shadow-sm" style={{ backgroundColor: "white" }}>
                <Card.Body className="p-4" style={{ color: "black" }}>
                  {/* Course Approval Content */}
                  {activeTab === "course-approval" && (
                    <CourseApprovingScreen
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      statusFilter={statusFilter}
                      setStatusFilter={setStatusFilter}
                      courses={courses}
                      setCourses={setCourses}
                      loading={loading}
                      filteredCourses={filteredCourses}
                      setFilteredCourses={setFilteredCourses}
                      onApproveCourse={handleApproveCourse}
                      onRejectCourse={handleRejectCourse}
                    />
                  )}

                  {/* User Management Content */}
                  {activeTab === "user-management" && <UserManagementView />}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default AdminScreen;
