import React from "react";
import { Container, Row, Col, Button, Form, InputGroup, Spinner, Alert } from "react-bootstrap";
import { useState, useEffect } from "react";
import CourseCard from "./CourseCard";
import { useCourses, defaultCourses } from "../hooks/useCourses";

const NewPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);

  // Use the custom hook for course management
  const { courses, loading, error, fetchCourses, enrollInCourse, searchCourses } =
    useCourses(defaultCourses); // Use default courses for development

  // Initialize filtered courses
  useEffect(() => {
    setFilteredCourses(courses);
  }, [courses]);

  // Uncomment this to fetch courses from API on component mount
  // useEffect(() => {
  //   fetchCourses();
  // }, []);

  const handleSearch = () => {
    const filtered = searchCourses(searchTerm, courses);
    setFilteredCourses(filtered);
  };

  const handleEnroll = async (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    const result = await enrollInCourse(courseId);
    if (result.success) {
      alert(`Successfully enrolled in "${course.title}"!`);
      // Update filtered courses to reflect the change
      setFilteredCourses((prevFiltered) =>
        prevFiltered.map((c) => (c.id === courseId ? { ...c, enrolled: true } : c))
      );
    } else {
      alert(`Failed to enroll: ${result.error}`);
    }
  };

  const handleCardClick = (course) => {
    // Handle card click - you can implement your logic here
    console.log("Card clicked:", course);
    alert(`Clicked on "${course.title}" - You can implement navigation or modal here!`);
    // Example: Navigate to course details page
    // navigate(`/course/${course.id}`);
  };

  return (
    <div
      style={{
        backgroundColor: "#1a1a1a",
        minHeight: "100vh",
        color: "#ffffff",
      }}
    >
      <Container
        style={{
          maxWidth: "1600px",
          paddingLeft: "40px",
          paddingRight: "40px",
          paddingTop: "40px",
        }}
      >
        {/* Header Section */}
        <Row className="mb-4">
          <Col>
            <h1 className="display-6 fw-bold mb-2" style={{ color: "#ffffff" }}>
              Discover courses
            </h1>
            <p className="fs-5" style={{ color: "#b0b0b0" }}>
              Find courses that suit your learning goals
            </p>
          </Col>
        </Row>

        {/* Search Section */}
        <Row className="mb-5">
          <Col md={10} lg={8}>
            <InputGroup size="lg">
              <Form.Control
                type="text"
                placeholder="What do you want to learn ?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                style={{
                  backgroundColor: "#2a2a2a",
                  border: "1px solid #404040",
                  borderRadius: "50px 0 0 50px",
                  color: "#ffffff",
                }}
              />
              <Button
                variant="primary"
                onClick={handleSearch}
                style={{ borderRadius: "0 50px 50px 0", paddingLeft: "2rem", paddingRight: "2rem" }}
              >
                Search
              </Button>
            </InputGroup>
          </Col>
        </Row>

        {/* Loading State */}
        {loading && (
          <Row className="mb-4">
            <Col className="text-center">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2" style={{ color: "#b0b0b0" }}>
                Loading courses...
              </p>
            </Col>
          </Row>
        )}

        {/* Error State */}
        {error && (
          <Row className="mb-4">
            <Col>
              <Alert variant="danger">Error loading courses: {error}</Alert>
            </Col>
          </Row>
        )}

        {/* Courses Grid */}
        <Row>
          {filteredCourses.map((course) => (
            <Col key={course.id} lg={4} md={6} className="mb-4">
              <CourseCard
                course={course}
                onEnroll={handleEnroll}
                onCardClick={handleCardClick}
                darkTheme={true}
              />
            </Col>
          ))}
        </Row>

        {filteredCourses.length === 0 && (
          <Row className="mt-5">
            <Col className="text-center">
              <h4 style={{ color: "#b0b0b0" }}>No courses found</h4>
              <p style={{ color: "#b0b0b0" }}>Try searching with different keywords</p>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default NewPage;
