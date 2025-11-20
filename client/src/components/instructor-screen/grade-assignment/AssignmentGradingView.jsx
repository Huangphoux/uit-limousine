import React from "react";
import { Button, Row, Col, Card } from "react-bootstrap";
import { FaFileAlt, FaUsers, FaRegClock } from "react-icons/fa";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

const AssignmentGradingView = ({ courses }) => {
  // Assignment Grading Stats Calculation
  const calculateAssignmentStats = () => {
    const totalLearners = courses.reduce((sum, course) => sum + (course.enrolledStudents || 0), 0);

    // You can add more calculations here as needed
    const allSubmitted = 0; // Placeholder - replace with actual logic
    const notScored = 0; // Placeholder - replace with actual logic
    const alreadyScored = 0; // Placeholder - replace with actual logic

    return {
      totalLearners,
      allSubmitted,
      notScored,
      alreadyScored,
    };
  };

  const assignmentStats = calculateAssignmentStats();

  const assignmentGradingStats = [
    {
      title: "All submitted",
      value: assignmentStats.allSubmitted.toString(),
      icon: <FaFileAlt className="text-white" />,
      bgColor: "#1E90FF",
    },
    {
      title: "Not scored",
      value: assignmentStats.notScored.toString(),
      icon: <FaRegClock className="text-white" />,
      bgColor: "#FF4500", // Orange
    },
    {
      title: "Already scored",
      value: assignmentStats.alreadyScored.toString(),
      icon: <IoMdCheckmarkCircleOutline className="text-white" />,
      bgColor: "#28a745",
    },
    {
      title: "Learners",
      value: assignmentStats.totalLearners.toString(),
      icon: <FaUsers className="text-white" />,
      bgColor: "rgba(232, 47, 161, 0.7)",
    },
  ];

  return (
    <>
      {/* Stats Cards */}
      <Row className="mb-4 stats-section">
        {assignmentGradingStats.map((stat, index) => (
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
  );
};

export default AssignmentGradingView;
