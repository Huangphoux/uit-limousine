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
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;

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

  // Assignment metadata (fallback to lessonForm) and submissions state
  const mockAssignment = {
    id: lessonForm?.assignmentId || "1",
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
  };

  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [submissionsError, setSubmissionsError] = useState(null);

  useEffect(() => {
    console.log("=== AssignmentGradingDetail useEffect ===");
    console.log("lessonForm:", lessonForm);
    const assignmentId = lessonForm?.assignmentId;
    console.log("Extracted assignmentId:", assignmentId);

    if (!assignmentId) {
      console.warn("No assignmentId found in lessonForm - cannot fetch submissions");
      setSubmissions([]);
      return;
    }

    let cancelled = false;

    const fetchSubmissions = async () => {
      setLoadingSubmissions(true);
      setSubmissionsError(null);
      try {
        const token = localStorage.getItem("accessToken");
        console.log("Fetching submissions for assignmentId:", assignmentId);
        console.log("API URL:", `${API_URL}/assignments/${assignmentId}/submissions`);
        const resp = await fetch(`${API_URL}/assignments/${assignmentId}/submissions`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        });

        const result = await resp.json();
        console.log("Submissions API response:", result);
        console.log("Response status:", resp.status, resp.ok);

        if (!resp.ok) {
          const err =
            result?.data ||
            result?.error?.message ||
            result?.message ||
            "Failed to fetch submissions";
          console.error("Fetch submissions error:", err);
          throw new Error(err);
        }

        // Expect result.data or result.submissions or result
        const list =
          result?.data?.submissions || result?.submissions || result?.data || result || [];
        if (!cancelled) {
          // normalize submissions array
          const normalized = Array.isArray(list)
            ? list.map((s) => ({
                id: s.id,
                assignmentId: s.assignmentId || s.assignment?.id || assignmentId,
                studentId: s.studentId || s.userId || s.student?.id,
                studentName:
                  s.studentName || s.student?.name || s.student?.fullName || s.user?.name || "",
                studentEmail: s.studentEmail || s.student?.email || s.user?.email || "",
                content: s.content || s.text || "",
                fileUrl: s.fileUrl || s.file || s.url || "",
                fileSize: s.fileSize || s.size || "",
                status: s.status || s.state || "SUBMITTED",
                grade: s.grade ?? s.score ?? null,
                feedback: s.feedback || s.comment || null,
                submittedAt: s.submittedAt
                  ? new Date(s.submittedAt)
                  : s.createdAt
                    ? new Date(s.createdAt)
                    : null,
              }))
            : [];

          console.log("Normalized submissions:", normalized);
          console.log("Submissions count:", normalized.length);
          setSubmissions(normalized);
        }
      } catch (err) {
        console.error("Fetch submissions exception:", err);
        if (!cancelled) setSubmissionsError(err.message || String(err));
      } finally {
        if (!cancelled) setLoadingSubmissions(false);
      }
    };

    fetchSubmissions();

    return () => {
      cancelled = true;
    };
  }, [lessonForm?.assignmentId]);
  // Early return if no lessonForm (render placeholder) — hooks above always run
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
    const performGrade = async () => {
      setIsSaving(true);
      try {
        const token = localStorage.getItem("accessToken");
        const user = localStorage.getItem("user");
        const grader = user ? JSON.parse(user).id : null;
        const resp = await fetch(`${API_URL}/grade/submissions/${selectedSubmission.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
          body: JSON.stringify({
            graderId: grader,
            grade: Number(gradingData.grade),
            feedback: gradingData.feedback,
          }),
        });

        const result = await resp.json();
        if (!resp.ok) {
          const err =
            result?.data || result?.error?.message || result?.message || "Failed to save grade";
          throw new Error(err);
        }

        // Show appropriate success message
        const successMessage = result?.message || "This assignment is graded successfully!";
        toast.success(successMessage);

        // Update submission in local state
        setSubmissions((prev) =>
          prev.map((s) =>
            s.id === selectedSubmission.id
              ? {
                  ...s,
                  grade: Number(gradingData.grade),
                  feedback: gradingData.feedback,
                  status: "GRADED",
                }
              : s
          )
        );

        setIsSaving(false);
        handleCloseModal();
      } catch (err) {
        console.error("Grade save error", err);
        setIsSaving(false);
        toast?.error?.("Failed to save grade: " + (err.message || String(err)));
      }
    };

    performGrade();
  };

  // Filter submissions based on search term and status
  const sourceSubmissions = submissions.length > 0 ? submissions : [];

  const filteredSubmissions = sourceSubmissions.filter((submission) => {
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
                Showing {filteredSubmissions.length} of {submissions.length} submissions
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
                    {submission.submittedAt ? formatDate(submission.submittedAt) : "-"}
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
