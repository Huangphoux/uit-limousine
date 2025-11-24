import React, { useState } from "react";
import {
  InputGroup,
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Table,
  Badge,
  Form,
  Spinner,
  Alert,
  ButtonGroup,
} from "react-bootstrap";
import { FaCheckSquare, FaFileAlt, FaRegClock, FaSearch, FaUsers } from "react-icons/fa";
import "./AssignmentGradingView.css";
import ScoringModal from "./ScoringModal";

const formatDate = (date) => {
  return new Date(date).toLocaleString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const calculateAssignmentStats = (mockAssignments, courses) => {
  const allSubmissions = mockAssignments.flatMap((a) => a.submissions);
  const totalLearners =
    courses?.reduce((sum, course) => sum + (course.enrolledStudents || 0), 0) || 0;
  const allSubmitted = allSubmissions.length;
  const notScored = allSubmissions.filter((s) => s.status === "SUBMITTED").length;
  const alreadyScored = allSubmissions.filter((s) => s.status === "GRADED").length;
  return { totalLearners, allSubmitted, notScored, alreadyScored };
};

const AssignmentGradingView = ({ courses }) => {
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showGradingModal, setShowGradingModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [gradingData, setGradingData] = useState({ grade: "", feedback: "" });
  const [isSaving, setIsSaving] = useState(false);

  // Mock assignment data
  const mockAssignments = [
    {
      id: "1",
      courseId: "1",
      courseName: "Coding basic",
      title: "Linear Regression Practice Test",
      description: "Complete the linear regression implementation using Python",
      dueDate: new Date("2025-11-20T19:49:41"),
      maxPoints: 100,
      createdAt: new Date("2025-11-01"),
      submissions: [
        {
          id: "sub1",
          assignmentId: "1",
          studentId: "student1",
          studentName: "Nguyễn Văn A",
          studentEmail: "a@gmail.com",
          content: "Completed all requirements",
          fileUrl: "Assignment.py",
          fileSize: "50 KB",
          status: "SUBMITTED",
          grade: null,
          feedback: null,
          submittedAt: new Date("2025-11-14T19:49:41"),
        },
        {
          id: "sub2",
          assignmentId: "1",
          studentId: "student2",
          studentName: "Trần Thị B",
          studentEmail: "b@gmail.com",
          content: "All tests passing",
          fileUrl: "solution.py",
          fileSize: "48 KB",
          status: "GRADED",
          grade: 85,
          feedback: "Good work! Consider optimizing the algorithm for better performance.",
          submittedAt: new Date("2025-11-13T10:30:00"),
        },
      ],
    },
    {
      id: "2",
      courseId: "2",
      courseName: "Advanced JavaScript",
      title: "Async Programming Assignment",
      description: "Implement promises and async/await patterns",
      dueDate: new Date("2025-11-25T23:59:00"),
      maxPoints: 100,
      createdAt: new Date("2025-11-05"),
      submissions: [
        {
          id: "sub3",
          assignmentId: "2",
          studentId: "student3",
          studentName: "Lê Văn C",
          studentEmail: "c@gmail.com",
          content: "Implemented all required functions",
          fileUrl: "async-assignment.js",
          fileSize: "35 KB",
          status: "SUBMITTED",
          grade: null,
          feedback: null,
          submittedAt: new Date("2025-11-20T08:15:00"),
        },
      ],
    },
  ];

  const stats = calculateAssignmentStats(mockAssignments, courses);

  const statsCards = [
    {
      title: "All submitted",
      value: stats.allSubmitted.toString(),
      icon: <FaFileAlt className="text-white" />,
      bgColor: "rgba(13, 110, 253, 0.6)",
    },
    {
      title: "Not scored",
      value: stats.notScored.toString(),
      icon: <FaRegClock className="text-white" />,
      bgColor: "red",
    },
    {
      title: "Already scored",
      value: stats.alreadyScored.toString(),
      icon: <FaCheckSquare className="text-white" />,
      bgColor: "green",
    },
    {
      title: "Learners",
      value: stats.totalLearners.toString(),
      icon: <FaUsers className="text-white" />,
      bgColor: "rgba(232, 47, 161, 0.7)",
    },
  ];

  const handleViewSubmissions = (assignment) => setSelectedAssignment(assignment);
  const handleBackToList = () => setSelectedAssignment(null);

  const handleGradeSubmission = (submission) => {
    setSelectedSubmission(submission);
    setGradingData({
      grade: submission.grade?.toString() || "",
      feedback: submission.feedback || "",
    });
    setShowGradingModal(true);
  };

  const handleCloseModal = () => {
    setShowGradingModal(false);
    setSelectedSubmission(null);
    setGradingData({ grade: "", feedback: "" });
  };

  const handleSaveGrade = () => {
    setIsSaving(true);
    setTimeout(() => {
      console.log("Saving grade:", {
        submissionId: selectedSubmission.id,
        grade: gradingData.grade,
        feedback: gradingData.feedback,
      });
      setIsSaving(false);
      handleCloseModal();
    }, 1000);
  };

  return (
    <Container fluid>
      <style>{`
        .search-input-grading::placeholder {
          color: black;
        }
      `}</style>
      {/* Stats Cards */}
      <Row className="mb-4 g-4">
        {statsCards.map((stat, idx) => (
          <Col key={idx} sm={6} md={3}>
            <Card className="shadow-sm" style={{ backgroundColor: "rgba(191,239,249)" }}>
              <Card.Body className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="small text-black">{stat.title}</div>
                  <div className="fs-2 fw-bold text-black mb-0">{stat.value}</div>
                </div>
                <div
                  className={`rounded d-flex align-items-center justify-content-center`}
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

      {!selectedAssignment ? (
        <>
          <div
            className="mb-4 p-4 rounded shadow-sm"
            style={{
              color: "black",
            }}
          >
            <Row className="align-items-center">
              <Col md={6}>
                <h4 className="fw-bold mb-1">📝 Grade Assignments</h4>
                <p className="mb-0 text-black">
                  Select an assignment to view and grade student submissions
                </p>
              </Col>
              <Col md={6}>
                <div className="d-flex">
                  <div className="position-relative flex-grow-1">
                    <Form.Control
                      type="text"
                      placeholder="Search assignments..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="search-input-grading"
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
            </Row>
          </div>
          {/* Assignment List */}
          <div className="d-grid gap-3">
            {mockAssignments
              .filter(
                (a) =>
                  a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  a.courseName.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((assignment) => {
                const notScored = assignment.submissions.filter(
                  (s) => s.status === "SUBMITTED"
                ).length;
                const graded = assignment.submissions.filter((s) => s.status === "GRADED").length;

                return (
                  <Card
                    key={assignment.id}
                    className="shadow-sm hover-shadow"
                    style={{ backgroundColor: "rgba(191,239,249)" }}
                  >
                    <Card.Body>
                      <Row className="align-items-center g-3">
                        <Col md={6}>
                          <div className="d-flex align-items-start gap-3">
                            <div className="assignment-icon-wrapper bg-primary text-white">
                              <span>📄</span>
                            </div>
                            <div>
                              <h5 className="fw-bold mb-1 text-black">{assignment.title}</h5>
                              <p className="text-black mb-2">{assignment.courseName}</p>
                              <p className="mb-2 text-black">{assignment.description}</p>
                              <div className="d-flex gap-4 text-muted small">
                                <span className="text-black">
                                  📅 Due: {formatDate(assignment.dueDate)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Col>
                        <Col md={4}>
                          <Row className="g-2 text-center">
                            <Col xs={4}>
                              <Card
                                className="p-2"
                                style={{
                                  backgroundColor: "rgba(255, 193, 7, 0.1)",
                                  border: "none",
                                }}
                              >
                                <div className="fs-4 fw-bold" style={{ color: "#ffc107" }}>
                                  {notScored}
                                </div>
                                <div className="small text-black">To Grade</div>
                              </Card>
                            </Col>
                            <Col xs={4}>
                              <Card
                                className="p-2"
                                style={{
                                  backgroundColor: "rgba(40, 167, 69, 0.1)",
                                  border: "none",
                                }}
                              >
                                <div className="fs-4 fw-bold" style={{ color: "#28a745" }}>
                                  {graded}
                                </div>
                                <div className="small text-black">Graded</div>
                              </Card>
                            </Col>
                            <Col xs={4}>
                              <Card
                                className="p-2"
                                style={{
                                  backgroundColor: "rgba(13, 110, 253, 0.1)",
                                  border: "none",
                                }}
                              >
                                <div className="fs-4 fw-bold" style={{ color: "#0d6efd" }}>
                                  {assignment.submissions.length}
                                </div>
                                <div className="small text-black">Total</div>
                              </Card>
                            </Col>
                          </Row>
                        </Col>

                        <Col md={2} className="text-end">
                          <Button
                            variant="primary"
                            onClick={() => handleViewSubmissions(assignment)}
                          >
                            Score Submissions
                          </Button>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                );
              })}
          </div>
        </>
      ) : (
        <>
          <Button
            variant="outline-secondary"
            onClick={handleBackToList}
            className="mb-3"
            style={{
              color: "#212529",
              fontWeight: "600",
              borderColor: "#6c757d",
            }}
          >
            ← Back to Assignments
          </Button>
          <div className="bg-white p-3 rounded shadow-sm mb-4 p-2">
            <h4 className="fw-bold mb-1">{selectedAssignment.title}</h4>
            <p className="text-black mb-0">{selectedAssignment.courseName}</p>
          </div>

          <Card className="shadow-sm">
            <Table responsive hover className="mb-0 custom-table">
              <thead className="table-light">
                <tr>
                  <th className="p-3">Student</th>
                  <th className="p-3">Submitted At</th>
                  <th className="p-3">File</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Grade</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {selectedAssignment.submissions.map((submission) => (
                  <tr key={submission.id}>
                    <td className="p-3">
                      <div className="fw-bold text-black">{submission.studentName}</div>
                      <div className="small fw-bold text-black">{submission.studentEmail}</div>
                    </td>
                    <td className="p-3 small text-black">{formatDate(submission.submittedAt)}</td>
                    <td className="p-3">
                      <div className="d-flex align-items-center gap-2">
                        <span className="text-primary fs-5">📄</span>
                        <div>
                          <div className="small text-black">{submission.fileUrl}</div>
                          <div className="small text-black">{submission.fileSize}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge
                        bg={submission.status === "GRADED" ? "success-light" : "warning-light"}
                        text={submission.status === "GRADED" ? "success" : "warning"}
                      >
                        {submission.status === "GRADED" ? "Graded" : "Not Scored"}
                      </Badge>
                    </td>
                    <td className="p-3">
                      {submission.grade !== null ? (
                        <span className="fw-bold text-black">
                          {submission.grade}/{selectedAssignment.maxPoints}
                        </span>
                      ) : (
                        <span className="text-black">-</span>
                      )}
                    </td>
                    <td className="p-3">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleGradeSubmission(submission)}
                      >
                        {submission.status === "GRADED" ? "View/Edit" : "Grade"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </>
      )}

      <ScoringModal
        show={showGradingModal}
        onHide={handleCloseModal}
        submission={selectedSubmission}
        assignment={selectedAssignment}
        gradingData={gradingData}
        setGradingData={setGradingData}
        onSave={handleSaveGrade}
        isSaving={isSaving}
      />
    </Container>
  );
};

export default AssignmentGradingView;
