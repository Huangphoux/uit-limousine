import { Modal } from "react-bootstrap";
import {
  FaTimes,
  FaStar,
  FaCheck,
  FaExclamationTriangle,
  FaDownload,
  FaFileAlt,
  FaUser,
  FaCalendarAlt,
  FaComment,
  FaAward,
} from "react-icons/fa";

export default function ScoringModal({
  show,
  onHide,
  submission,
  assignment,
  gradingData,
  setGradingData,
  onSave,
  isSaving,
}) {
  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleQuickScore = (percent) => {
    const maxPoints = assignment?.maxPoints || 100;
    const score = Math.round((percent / 100) * maxPoints);
    setGradingData({ ...gradingData, grade: score.toString() });
  };

  if (!submission) return null;

  const styles = {
    modalContent: {
      background: "#ffffff",
      borderRadius: "16px",
      overflow: "hidden",
      border: "none",
    },
    header: {
      background: "linear-gradient(to right, #2563eb, #4f46e5)",
      padding: "16px 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    headerLeft: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    iconWrapper: {
      padding: "10px",
      background: "rgba(255, 255, 255, 0.2)",
      borderRadius: "8px",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      fontSize: "18px",
      fontWeight: "600",
      color: "white",
      margin: 0,
    },
    subtitle: {
      fontSize: "14px",
      color: "#bfdbfe",
      margin: 0,
    },
    closeBtn: {
      padding: "8px",
      background: "transparent",
      border: "none",
      borderRadius: "8px",
      color: "white",
      cursor: "pointer",
      fontSize: "18px",
    },
    body: {
      padding: "24px",
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      maxHeight: "70vh",
      overflowY: "auto",
    },
    studentCard: {
      background: "#f9fafb",
      borderRadius: "12px",
      padding: "16px",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },
    studentRow: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    avatar: {
      width: "40px",
      height: "40px",
      background: "linear-gradient(to bottom right, #3b82f6, #4f46e5)",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontSize: "16px",
    },
    studentName: {
      fontWeight: "500",
      color: "#111827",
      margin: 0,
    },
    studentEmail: {
      fontSize: "14px",
      color: "#6b7280",
      margin: 0,
    },
    submittedTime: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "14px",
      color: "#4b5563",
    },
    fileCard: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px",
      background: "#eff6ff",
      borderRadius: "12px",
      border: "1px solid #dbeafe",
    },
    fileInfo: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    fileIcon: {
      padding: "10px",
      background: "#dbeafe",
      borderRadius: "8px",
      color: "#2563eb",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "18px",
    },
    fileName: {
      fontWeight: "500",
      color: "#111827",
      fontSize: "14px",
      margin: 0,
    },
    fileSize: {
      fontSize: "12px",
      color: "#6b7280",
      margin: 0,
    },
    downloadBtn: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 12px",
      background: "#2563eb",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontSize: "14px",
      cursor: "pointer",
    },
    commentCard: {
      background: "#fffbeb",
      borderRadius: "12px",
      padding: "16px",
      border: "1px solid #fef3c7",
    },
    commentHeader: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginBottom: "8px",
      color: "#92400e",
      fontSize: "14px",
      fontWeight: "500",
    },
    commentText: {
      fontSize: "14px",
      color: "#374151",
      fontStyle: "italic",
      margin: 0,
    },
    scoreSection: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },
    label: {
      fontSize: "14px",
      fontWeight: "500",
      color: "#374151",
    },
    scoreInput: {
      width: "100%",
      padding: "12px 16px",
      fontSize: "18px",
      fontWeight: "600",
      textAlign: "center",
      border: "2px solid #e5e7eb",
      borderRadius: "12px",
      outline: "none",
      backgroundColor: "white",
      color: "#111827",
      colorScheme: "light",
    },
    quickBtns: {
      display: "flex",
      gap: "8px",
      background: "#f3f4f6",
    },
    quickBtn: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      padding: "10px",
      borderRadius: "8px",
      fontSize: "13px",
      fontWeight: "500",
      cursor: "pointer",
    },
    excellentBtn: {
      background: "#ecfdf5",
      color: "#047857",
      border: "1px solid #a7f3d0",
    },
    goodBtn: {
      background: "#eff6ff",
      color: "#1d4ed8",
      border: "1px solid #bfdbfe",
    },
    passBtn: {
      background: "#fffbeb",
      color: "#b45309",
      border: "1px solid #fde68a",
    },
    feedbackInput: {
      width: "100%",
      padding: "12px 16px",
      border: "2px solid #e5e7eb",
      borderRadius: "12px",
      outline: "none",
      resize: "none",
      fontSize: "14px",
      fontFamily: "inherit",
      color: "#111827",
      backgroundColor: "white",
    },
    footer: {
      padding: "16px 24px",
      background: "#f9fafb",
      borderTop: "1px solid #f3f4f6",
      display: "flex",
      gap: "12px",
    },
    cancelBtn: {
      flex: 1,
      padding: "12px 16px",
      background: "white",
      border: "1px solid #d1d5db",
      color: "#374151",
      borderRadius: "12px",
      fontWeight: "500",
      cursor: "pointer",
    },
    saveBtn: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      padding: "12px 16px",
      background: "linear-gradient(to right, #2563eb, #4f46e5)",
      color: "white",
      border: "none",
      borderRadius: "12px",
      fontWeight: "500",
      cursor: "pointer",
    },
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <div style={styles.modalContent}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.iconWrapper}>
              <FaAward />
            </div>
            <div>
              <h2 style={styles.title}>Grade Submission</h2>
              <p style={styles.subtitle}>For {submission.studentName}</p>
            </div>
          </div>
          <button style={styles.closeBtn} onClick={onHide}>
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div style={styles.body}>
          {/* Student Info */}
          <div style={styles.studentCard}>
            <div style={styles.studentRow}>
              <div style={styles.avatar}>
                <FaUser />
              </div>
              <div>
                <p style={styles.studentName}>{submission.studentName}</p>
                <p style={styles.studentEmail}>{submission.studentEmail}</p>
              </div>
            </div>
            <div style={styles.submittedTime}>
              <FaCalendarAlt />
              <span>Submitted at: {formatDate(submission.submittedAt)}</span>
            </div>
          </div>

          {/* File Download */}
          <div style={styles.fileCard}>
            <div style={styles.fileInfo}>
              <div style={styles.fileIcon}>
                <FaFileAlt />
              </div>
              <div>
                <p style={styles.fileName}>{submission.fileUrl}</p>
                <p style={styles.fileSize}>{submission.fileSize}</p>
              </div>
            </div>
            <button style={styles.downloadBtn}>
              <FaDownload />
              Download
            </button>
          </div>

          {/* Student Comment */}
          {submission.content && (
            <div style={styles.commentCard}>
              <div style={styles.commentHeader}>
                <FaComment />
                <span>Student's Message</span>
              </div>
              <p style={styles.commentText}>"{submission.content}"</p>
            </div>
          )}

          {/* Score Input */}
          <div style={styles.scoreSection}>
            <label style={styles.label}>Score / {assignment?.maxPoints || 100}</label>
            <input
              type="number"
              value={gradingData.grade}
              onChange={(e) => setGradingData({ ...gradingData, grade: e.target.value })}
              placeholder="Enter grade"
              min="0"
              max={assignment?.maxPoints || 100}
              style={styles.scoreInput}
            />

            {/* Quick Score */}
            <div style={styles.quickBtns}>
              <button
                style={{ ...styles.quickBtn, ...styles.excellentBtn }}
                onClick={() => handleQuickScore(100)}
              >
                <FaStar />
                Excellent (100%)
              </button>
              <button
                style={{ ...styles.quickBtn, ...styles.goodBtn }}
                onClick={() => handleQuickScore(80)}
              >
                <FaCheck />
                Good (80%)
              </button>
              <button
                style={{ ...styles.quickBtn, ...styles.passBtn }}
                onClick={() => handleQuickScore(50)}
              >
                <FaExclamationTriangle />
                Pass (50%)
              </button>
            </div>
          </div>

          {/* Feedback */}
          <div style={styles.scoreSection}>
            <label style={styles.label}>Feedback</label>
            <textarea
              value={gradingData.feedback}
              onChange={(e) => setGradingData({ ...gradingData, feedback: e.target.value })}
              placeholder="Write your feedback here..."
              rows={3}
              style={styles.feedbackInput}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <button style={styles.cancelBtn} onClick={onHide}>
            Cancel
          </button>
          <button
            style={{
              ...styles.saveBtn,
              opacity: isSaving || !gradingData.grade ? 0.7 : 1,
            }}
            onClick={onSave}
            disabled={isSaving || !gradingData.grade}
          >
            {isSaving ? (
              <>
                <span className="spinner-border spinner-border-sm" />
                Saving...
              </>
            ) : (
              <>
                <FaCheck />
                Save Grade
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        .modal-content {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
    </Modal>
  );
}
