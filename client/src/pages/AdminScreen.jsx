import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import Header from "../components/Header";
import CourseApprovingScreen from "../components/admin-screen/course-approval/CourseApprovingScreen";
import UserManagementView from "../components/admin-screen/user-management/UserManagementView";

const AdminScreen = () => {
  const [activeTab, setActiveTab] = useState("course-approval"); // "course-approval" or "user-management"
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [filteredCourses, setFilteredCourses] = useState([]);

  // Sample pending courses data for Course Approval
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "Advanced React Patterns",
      description:
        "Master advanced React patterns including Render Props, Higher-Order Components, Compound Components, and Custom Hooks. Learn to build scalable and maintainable React applications.",
      instructor: "John Doe",
      submittedDate: "2024-11-15",
      status: "Waiting",
      estimatedDuration: "8 weeks",
      category: "Web Development",
      durationWeeks: "8",
      durationDays: "56",
      durationHours: "120",
      image: "https://via.placeholder.com/300x200/4CAF50/ffffff?text=React+Patterns",
      modules: [
        {
          id: 1,
          title: "Introduction to Advanced React Patterns",
          description: "Understanding when and why to use advanced patterns in React applications",
          duration: "2 hours",
          lessons: [
            {
              id: 1,
              title: "Course Overview and Setup",
              type: "video",
              duration: "15 minutes",
              content: "Introduction to the course structure and development environment setup",
            },
            {
              id: 2,
              title: "React Patterns History",
              type: "video",
              duration: "25 minutes",
              content: "Evolution of React patterns and their importance in modern development",
            },
            {
              id: 3,
              title: "Pattern Selection Guide",
              type: "text",
              duration: "20 minutes",
              content: "Decision framework for choosing the right pattern for your use case",
            },
            {
              id: 4,
              title: "Setup Exercise",
              type: "assignment",
              duration: "60 minutes",
              content: "Create a new React project with the necessary development tools",
            },
          ],
        },
        {
          id: 2,
          title: "Render Props Pattern",
          description: "Learn to share code between components using render props technique",
          duration: "4 hours",
          lessons: [
            {
              id: 5,
              title: "Understanding Render Props",
              type: "video",
              duration: "30 minutes",
              content: "What are render props and how they solve component composition problems",
            },
            {
              id: 6,
              title: "Building Your First Render Prop Component",
              type: "video",
              duration: "45 minutes",
              content: "Step-by-step implementation of a simple render prop component",
            },
            {
              id: 7,
              title: "Advanced Render Props Patterns",
              type: "video",
              duration: "40 minutes",
              content: "Function as children and render prop variations",
            },
            {
              id: 8,
              title: "Render Props vs Hooks",
              type: "text",
              duration: "25 minutes",
              content: "Comparing render props with custom hooks approach",
            },
            {
              id: 9,
              title: "Build a Data Fetcher Component",
              type: "assignment",
              duration: "100 minutes",
              content: "Create a reusable data fetching component using render props",
            },
          ],
        },
        {
          id: 3,
          title: "Higher-Order Components (HOCs)",
          description:
            "Master the HOC pattern for cross-cutting concerns and component enhancement",
          duration: "5 hours",
          lessons: [
            {
              id: 10,
              title: "HOC Fundamentals",
              type: "video",
              duration: "35 minutes",
              content: "Understanding Higher-Order Components and their use cases",
            },
            {
              id: 11,
              title: "Creating Authentication HOCs",
              type: "video",
              duration: "50 minutes",
              content: "Building HOCs for authentication and authorization",
            },
            {
              id: 12,
              title: "HOC Composition and Nesting",
              type: "video",
              duration: "40 minutes",
              content: "Combining multiple HOCs and avoiding common pitfalls",
            },
            {
              id: 13,
              title: "HOC Best Practices",
              type: "text",
              duration: "30 minutes",
              content: "Guidelines for writing maintainable and performant HOCs",
            },
            {
              id: 14,
              title: "Build a Theme Provider HOC",
              type: "assignment",
              duration: "125 minutes",
              content: "Create a theme management system using HOC pattern",
            },
          ],
        },
      ],
    },
    {
      id: 2,
      title: "Full-Stack JavaScript Development",
      description:
        "Complete guide to building modern web applications with Node.js, Express, React, and MongoDB. From backend APIs to frontend interfaces.",
      instructor: "Jane Smith",
      submittedDate: "2024-11-14",
      status: "Waiting",
      estimatedDuration: "12 weeks",
      category: "Web Development",
      durationWeeks: "12",
      durationDays: "84",
      durationHours: "180",
      image: "https://via.placeholder.com/300x200/2196F3/ffffff?text=Full+Stack+JS",
      modules: [
        {
          id: 1,
          title: "Backend Development with Node.js",
          description: "Building robust server-side applications with Node.js and Express",
          duration: "6 hours",
          lessons: [
            {
              id: 1,
              title: "Node.js Fundamentals",
              type: "video",
              duration: "45 minutes",
              content: "Understanding Node.js runtime and its ecosystem",
            },
            {
              id: 2,
              title: "Express.js Setup and Routing",
              type: "video",
              duration: "60 minutes",
              content: "Creating RESTful APIs with Express.js framework",
            },
            {
              id: 3,
              title: "Middleware and Error Handling",
              type: "video",
              duration: "50 minutes",
              content: "Implementing custom middleware and robust error handling",
            },
            {
              id: 4,
              title: "Build a REST API",
              type: "assignment",
              duration: "165 minutes",
              content: "Create a complete REST API for a blog application",
            },
          ],
        },
        {
          id: 2,
          title: "Database Integration with MongoDB",
          description: "Integrating MongoDB with Node.js applications using Mongoose",
          duration: "4 hours",
          lessons: [
            {
              id: 5,
              title: "MongoDB Basics",
              type: "video",
              duration: "40 minutes",
              content: "Introduction to NoSQL databases and MongoDB concepts",
            },
            {
              id: 6,
              title: "Mongoose ODM",
              type: "video",
              duration: "55 minutes",
              content: "Using Mongoose for data modeling and validation",
            },
            {
              id: 7,
              title: "Database Operations",
              type: "video",
              duration: "45 minutes",
              content: "CRUD operations and advanced querying techniques",
            },
            {
              id: 8,
              title: "Database Integration Project",
              type: "assignment",
              duration: "80 minutes",
              content: "Connect your REST API to MongoDB database",
            },
          ],
        },
      ],
    },
    {
      id: 7,
      title: "JavaScript Fundamentals for Beginners",
      description:
        "Complete beginner's guide to JavaScript programming with hands-on video tutorials. Learn variables, functions, DOM manipulation, and modern ES6+ features.",
      instructor: "Chris Martinez",
      submittedDate: "2024-11-17",
      status: "Waiting",
      estimatedDuration: "6 weeks",
      category: "Programming",
      durationWeeks: "6",
      durationDays: "42",
      durationHours: "85",
      image: "https://via.placeholder.com/300x200/F7DF1E/000000?text=JavaScript",
      modules: [
        {
          id: 1,
          title: "JavaScript Basics",
          description: "Introduction to JavaScript syntax and fundamental concepts",
          duration: "3 hours",
          lessons: [
            {
              id: 1,
              title: "JavaScript Introduction Video",
              type: "Video",
              duration: "45 minutes",
              content: "Comprehensive introduction to JavaScript programming language",
              url: "https://www.youtube.com/watch?v=E8N8CAihLT0&list=RDE8N8CAihLT0&start_radio=1",
            },
            {
              id: 2,
              title: "Variables and Data Types",
              type: "Video",
              duration: "35 minutes",
              content: "Understanding JavaScript variables, strings, numbers, and booleans",
              url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            },
            {
              id: 3,
              title: "Functions and Scope",
              type: "Video",
              duration: "40 minutes",
              content: "Creating and using functions, understanding scope and closures",
            },
            {
              id: 4,
              title: "Practice Exercises",
              type: "Document",
              duration: "60 minutes",
              content: "Hands-on coding exercises to reinforce JavaScript basics",
            },
          ],
        },
        {
          id: 2,
          title: "DOM Manipulation",
          description: "Learn to interact with web pages using JavaScript",
          duration: "2.5 hours",
          lessons: [
            {
              id: 5,
              title: "Understanding the DOM",
              type: "Video",
              duration: "30 minutes",
              content: "Introduction to Document Object Model and how to access elements",
            },
            {
              id: 6,
              title: "Event Handling",
              type: "Video",
              duration: "40 minutes",
              content: "Adding interactivity with event listeners and handlers",
            },
            {
              id: 7,
              title: "Building Interactive Webpage",
              type: "Document",
              duration: "100 minutes",
              content: "Step-by-step project: Create an interactive to-do list application",
            },
          ],
        },
      ],
    },
  ]);

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
  };

  // Simulate loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Initialize filtered courses
  useEffect(() => {
    setFilteredCourses(courses);
  }, [courses]);

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
