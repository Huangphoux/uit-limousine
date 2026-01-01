import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaBook, FaChartLine, FaFileAlt, FaUsers, FaRegClock } from "react-icons/fa";
import { toast } from "sonner";
import CreateCourseModal from "../components/CreateCourseModal";
import EditCourseModal from "../components/instructor-screen/course-management/EditCourseModal";
import CourseManagementView from "../components/instructor-screen/course-management/CourseManagementView";
import AssignmentGradingView from "../components/instructor-screen/grade-assignment/AssignmentGradingView";
import { useCourses } from "../hooks/useCourses";

const InstructorScreen = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  // const [activeTab, setActiveTab] = useState("course-management");
  // "assignment-grading" or "course-management"
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [filteredCourses, setFilteredCourses] = useState([]);

  // Course Management Part
  // Sample course data
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

  useEffect(() => {
    const maybeUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (!maybeUser?.id) {
      console.warn(
        "InstructorScreen: no user id found in localStorage; skipping instructor-only fetch"
      );
      return;
    }
    fetchCourses({ onlyMyCourses: true, instructorId: maybeUser.id });
  }, []);

  // Refresh courses when returning from edit page
  useEffect(() => {
    const checkAndRefresh = () => {
      try {
        const flag = localStorage.getItem("courses_needs_refresh");
        const maybeUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (flag === "1") {
          if (!maybeUser?.id) {
            console.warn("checkAndRefresh: no user id found; skipping instructor-only fetch");
          } else {
            fetchCourses({ onlyMyCourses: true, instructorId: maybeUser.id });
          }
          localStorage.removeItem("courses_needs_refresh");
        }
      } catch (e) {
        // ignore
        console.log(e);
      }
    };

    window.addEventListener("focus", checkAndRefresh);
    // run once in case already flagged
    checkAndRefresh();
    return () => window.removeEventListener("focus", checkAndRefresh);
  }, [fetchCourses]);

  const placeholderStyle = {
    "--placeholder-color": "#ddd",
  };

  const handleCreateCourse = () => {
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
  };

  const handleSaveCourse = async (courseData) => {
    // Handle save course logic here
    console.log(
      "New course data:",
      courseData,
      "avatar:",
      courseData.avatar,
      courseData.avatar?.name
    );

    try {
      // Optimistically add the course to instructor's local list so UI updates immediately
      const tempId = courseData.id || `temp-${Date.now()}`;
      const optimistic = {
        id: tempId,
        title: courseData.courseName || courseData.title || "Untitled Course",
        description: courseData.description || "",
        coverImage: courseData.coverImage || courseData.thumbnail || null,
        price: Number(courseData.price) || 0,
        level: courseData.level || null,
        language: courseData.language || null,
        category: courseData.category || null,
        instructor: JSON.parse(localStorage.getItem("user") || "{}")?.name || "You",
        status: "draft",
      };

      // Close modal and refresh instructor's courses from server
      setShowCreateModal(false);

      // Signal other pages to refresh (NewPage will listen)
      try {
        localStorage.setItem("courses_needs_refresh", "1");
      } catch (e) {
        console.log(e);
      }
      window.dispatchEvent(new Event("courses_updated"));

      const maybeUser = JSON.parse(localStorage.getItem("user") || "{}");
      if (!maybeUser?.id) {
        console.warn("handleSaveCourse: no user id found; skipping fetch");
        return;
      }
      await fetchCourses({ onlyMyCourses: true, instructorId: maybeUser.id });
    } catch (err) {
      console.error("Error handling saved course:", err);
    }
  };

  const handleEditCourse = (courseData) => {
    console.log("Edit course:", courseData);
    navigate("/instructor/edit-course", { state: { courseData } });
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

  const handlePublishCourse = async (courseDataWithAction) => {
    const { action, ...courseData } = courseDataWithAction;

    console.log("handlePublishCourse - action:", action);
    console.log("handlePublishCourse - courseData:", courseData);

    try {
      const token = localStorage.getItem("accessToken");
      const API_URL = import.meta.env.VITE_API_URL;

      if (!token) {
        console.error("No access token found");
        return;
      }

      // Prepare payload with only backend-expected fields
      const payload = {
        title: courseData.title || "",
        price: courseData.price || 0,
      };

      // Only add optional fields if they have values
      if (courseData.description) {
        payload.description = courseData.description;
      }
      if (courseData.level) {
        payload.level = courseData.level;
      }
      if (courseData.language) {
        payload.language = courseData.language;
      }
      if (courseData.image || courseData.coverImage) {
        payload.coverImage = courseData.image || courseData.coverImage;
      }

      console.log("Payload to send:", payload);

      switch (action) {
        case "publish": {
          // Publish draft course
          const publishResponse = await fetch(`${API_URL}/courses/${courseData.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              ...payload,
              published: true,
            }),
          });

          if (publishResponse.ok) {
            // After successful publish, refresh the instructor's courses from server
            try {
              localStorage.setItem("courses_needs_refresh", "1");
            } catch (e) {
              console.log(e);
            }
            window.dispatchEvent(new Event("courses_updated"));

            const maybeUser = JSON.parse(localStorage.getItem("user") || "{}");
            if (!maybeUser?.id) {
              console.warn("publish: no user id found; skipping fetch");
            } else {
              await fetchCourses({ onlyMyCourses: true, instructorId: maybeUser.id });
            }

            // Broadcast specific publish event so public listing pages can upsert it fast
            try {
              window.dispatchEvent(
                new CustomEvent("course_published", { detail: { id: courseData.id } })
              );
            } catch (e) {
              // fallback
              console.log(e);
              window.dispatchEvent(new Event("courses_updated"));
            }

            console.log("Course published successfully");
          } else {
            const errorData = await publishResponse.json();
            console.error("Failed to publish course:", errorData);
            // show user-friendly message
            toast &&
              toast.error &&
              toast.error(
                "Failed to publish course: " +
                  (errorData?.data || errorData?.message || JSON.stringify(errorData))
              );
          }
          break;
        }

        case "hide": {
          // Unpublish course
          const hideResponse = await fetch(`${API_URL}/courses/${courseData.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              ...payload,
              published: false,
            }),
          });

          if (hideResponse.ok) {
            // After successful unpublish, refresh the instructor's courses from server
            try {
              localStorage.setItem("courses_needs_refresh", "1");
            } catch (e) {
              console.log(e);
            }
            window.dispatchEvent(new Event("courses_updated"));

            const maybeUser = JSON.parse(localStorage.getItem("user") || "{}");
            if (!maybeUser?.id) {
              console.warn("hide: no user id found; skipping fetch");
            } else {
              await fetchCourses({ onlyMyCourses: true, instructorId: maybeUser.id });
            }

            // Notify public listing that a course was unpublished
            try {
              window.dispatchEvent(
                new CustomEvent("course_unpublished", { detail: { id: courseData.id } })
              );
            } catch (e) {
              window.dispatchEvent(new Event("courses_updated"));
            }

            console.log("Course unpublished successfully");
          } else {
            const errorData = await hideResponse.json();
            console.error("Failed to unpublish course:", errorData);
            toast &&
              toast.error &&
              toast.error(
                "Failed to unpublish course: " +
                  (errorData?.data || errorData?.message || JSON.stringify(errorData))
              );
          }
          break;
        }

        case "resend":
          // Handle resending denied course
          console.log("Resend action not yet implemented");
          break;

        default:
          console.log("Unknown action:", action);
      }
    } catch (error) {
      console.error("Error in handlePublishCourse:", error);
    }
  };

  const handleDeleteCourse = (courseData) => {
    console.log("Delete course:", courseData);
    // Add delete course logic here
    setCourses(courses.filter((course) => course.id !== courseData.id));
  };

  // const handleTabSwitch = (tab) => {
  //   setActiveTab(tab);
  // };

  // Initialize filtered courses
  useEffect(() => {
    setFilteredCourses(courses);
  }, [courses]);

  // Simulate loading effect
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setLoading(false);
  //   }, 1500);
  //   return () => clearTimeout(timer);
  // }, []);

  // Debounced search effect - triggers 1 second after user stops typing
  // Thay thế useEffect dòng 120-139
  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      const maybeUser = JSON.parse(localStorage.getItem("user") || "{}");
      if (!maybeUser?.id) {
        console.warn("InstructorScreen: no user id found for search; skipping fetch");
        return;
      }

      if (searchQuery.trim() === "") {
        await fetchCourses({ onlyMyCourses: true, instructorId: maybeUser.id }); // Lấy tất cả do instructor
      } else {
        await fetchCourses({
          search: searchQuery,
          onlyMyCourses: true,
          instructorId: maybeUser.id,
        }); // Gọi API search limited to instructor
      }
    }, 1000);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

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
        {/* Main Content */}
        <Container
          fluid
          className="pt-5 mt-4 instructor-page-background"
          style={{ minHeight: "100vh" }}
        >
          {/* Tab Navigation */}
          {/* <div className="mb-4 d-flex justify-content-center tab-section">
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
          </div> */}

          {/* Content Section */}
          <Row>
            <Col md={12}>
              <Card className="border-0 shadow-sm" style={{ backgroundColor: "white" }}>
                <Card.Body className="p-4" style={{ color: "black" }}>
                  {/* Course Management */}

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

                  {/* {activeTab === "assignment-grading" && (
                    <AssignmentGradingView courses={courses} />
                  )} */}
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
