import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Badge,
  Form,
  Alert,
  Modal,
  Spinner,
  InputGroup,
} from "react-bootstrap";
import { FaCheckSquare, FaFileAlt, FaRegClock, FaUsers, FaSearch } from "react-icons/fa";
import ScoringModal from "../grade-assignment/ScoringModal";

const formatDate = (date) => {
  return new Date(date).toLocaleString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const AssignmentGradingDetail = ({ lessonForm, courseData }) => {
  const [showGradingModal, setShowGradingModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradingData, setGradingData] = useState({ grade: "", feedback: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Early return if no lessonForm
  if (!lessonForm) {
    return (
      <div className="assignment-grading-detail">
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <p className="text-muted">
              Please select an assignment lesson to view grading details.
            </p>
          </Card.Body>
        </Card>
      </div>
    );
  }

  // Mock assignment data based on current lesson
  const mockAssignment = {
    id: "1",
    courseId: courseData?.id || "1",
    courseName: courseData?.title || "Demo Course",
    title: lessonForm?.title || "Assignment",
    description: lessonForm?.description || "Complete the assignment requirements",
    dueDate:
      lessonForm?.dueDate && lessonForm?.dueTime
        ? new Date(lessonForm.dueDate + " " + lessonForm.dueTime)
        : new Date(),
    maxPoints: lessonForm?.maxPoints || 100,
    createdAt: new Date(),
    submissions: [
      {
        id: "sub1",
        assignmentId: "1",
        studentId: "student1",
        studentName: "Nguyễn Văn A",
        studentEmail: "nguyenvana@example.com",
        content: "Hoàn thành tất cả yêu cầu của bài tập",
        fileUrl: "assignment_submission.pdf",
        fileSize: "1.2 MB",
        status: "SUBMITTED",
        grade: null,
        feedback: null,
        submittedAt: new Date("2024-12-15T14:30:00"),
      },
      {
        id: "sub2",
        assignmentId: "1",
        studentId: "student2",
        studentName: "Trần Thị B",
        studentEmail: "tranthib@example.com",
        content: "Đã làm xong bài tập, có một số thắc mắc về phần cuối",
        fileUrl: "my_solution.docx",
        fileSize: "850 KB",
        status: "GRADED",
        grade: 85,
        feedback: "Bài làm tốt! Cần chú ý thêm về phần kết luận.",
        submittedAt: new Date("2024-12-14T09:15:00"),
      },
      {
        id: "sub3",
        assignmentId: "1",
        studentId: "student3",
        studentName: "Lê Văn C",
        studentEmail: "levanc@example.com",
        content: "Bài nộp đầy đủ theo yêu cầu",
        fileUrl: "assignment_final.pdf",
        fileSize: "2.1 MB",
        status: "SUBMITTED",
        grade: null,
        feedback: null,
        submittedAt: new Date("2024-12-13T16:45:00"),
      },
    ],
  };

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

      // Update the submission in mock data
      const submissionIndex = mockAssignment.submissions.findIndex(
        (s) => s.id === selectedSubmission.id
      );
      if (submissionIndex !== -1) {
        mockAssignment.submissions[submissionIndex] = {
          ...mockAssignment.submissions[submissionIndex],
          grade: parseInt(gradingData.grade),
          feedback: gradingData.feedback,
          status: "GRADED",
        };
      }

      setIsSaving(false);
      handleCloseModal();
    }, 1000);
  };

  // Filter submissions based on search term and status
  const filteredSubmissions = mockAssignment.submissions.filter((submission) => {
    const matchesSearch =
      submission.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.studentEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || submission.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="detail-assignment-grading">
      {/* Assignment Header */}
      {/* <div className="detail-bg-white detail-p-3 detail-rounded detail-shadow-sm detail-mb-4 detail-p-2">
        <h4 className="detail-fw-bold detail-mb-1">{mockAssignment.title}</h4>
        <p className="detail-text-black detail-mb-0">{mockAssignment.courseName}</p>
      </div> */}

      {/* Search and Filter Section */}
      <Card className="detail-shadow-sm detail-mb-3">
        <Card.Body>
          <Row className="g-3">
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text style={{ backgroundColor: "#fff", borderColor: "#dee2e6" }}>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search by student name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input-field"
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#000000",
                  }}
                />
              </InputGroup>
            </Col>
            <Col md={6}>
              <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="ALL">All Status</option>
                <option value="SUBMITTED">Not Graded</option>
                <option value="GRADED">Graded</option>
              </Form.Select>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              <small className="text-muted">
                Showing {filteredSubmissions.length} of {mockAssignment.submissions.length}{" "}
                submissions
              </small>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Submissions Table */}
      <Card className="detail-shadow-sm">
        <Table responsive hover className="detail-mb-0 detail-custom-table">
          <thead className="detail-table-light">
            <tr>
              <th className="detail-p-3">Student</th>
              <th className="detail-p-3">Submitted At</th>
              <th className="detail-p-3">File</th>
              <th className="detail-p-3">Status</th>
              <th className="detail-p-3">Grade</th>
              <th className="detail-p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubmissions.length > 0 ? (
              filteredSubmissions.map((submission) => (
                <tr key={submission.id}>
                  <td className="detail-p-3">
                    <div className="detail-fw-bold detail-text-black">{submission.studentName}</div>
                    <div className="detail-small detail-fw-bold detail-text-black">
                      {submission.studentEmail}
                    </div>
                  </td>
                  <td className="detail-p-3 detail-small detail-text-black">
                    {formatDate(submission.submittedAt)}
                  </td>
                  <td className="detail-p-3">
                    <div className="detail-d-flex detail-align-items-center detail-gap-2">
                      <span className="detail-text-primary detail-fs-5">📄</span>
                      <div>
                        <div className="detail-small detail-text-black">{submission.fileUrl}</div>
                        <div className="detail-small detail-text-black">{submission.fileSize}</div>
                      </div>
                    </div>
                  </td>
                  <td className="detail-p-3">
                    <Badge
                      bg={submission.status === "GRADED" ? "success-light" : "warning-light"}
                      text={submission.status === "GRADED" ? "success" : "warning"}
                    >
                      {submission.status === "GRADED" ? "Graded" : "Not Scored"}
                    </Badge>
                  </td>
                  <td className="detail-p-3">
                    {submission.grade !== null ? (
                      <span className="detail-fw-bold detail-text-black">
                        {submission.grade}/{mockAssignment.maxPoints}
                      </span>
                    ) : (
                      <span className="detail-text-black">-</span>
                    )}
                  </td>
                  <td className="detail-p-3">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleGradeSubmission(submission)}
                    >
                      {submission.status === "GRADED" ? "View/Edit" : "Grade"}
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center detail-p-4">
                  <div className="text-muted">
                    <FaFileAlt size={40} className="mb-2 opacity-25" />
                    <p className="mb-0">No submissions found matching your search criteria.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>

      {/* Grading Modal */}
      <ScoringModal
        show={showGradingModal}
        onHide={handleCloseModal}
        submission={selectedSubmission}
        assignment={mockAssignment}
        gradingData={gradingData}
        setGradingData={setGradingData}
        onSave={handleSaveGrade}
        isSaving={isSaving}
      />
    </div>
  );
};

export default AssignmentGradingDetail;
