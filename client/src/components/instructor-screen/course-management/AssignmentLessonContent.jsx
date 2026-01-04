import { Form } from "react-bootstrap";
import { useResourceDownload } from "./useResourceDownload";

const AssignmentLessonContent = ({ lessonForm, onFormChange, onFileUpload, onRemoveFile }) => {
  const handleResourceDeleted = (resourceId) => {
    const updatedResources = lessonForm.lessonResources.filter((r) => r.id !== resourceId);
    onFormChange("lessonResources", updatedResources);
  };

  const { handleDownloadResource, handleDeleteResource } =
    useResourceDownload(handleResourceDeleted);

  // Helper: choose a simple emoji icon based on file extension
  const getFileIcon = (name) => {
    const ext = (name || "").split(".").pop().toLowerCase();
    switch (ext) {
      case "pdf":
        return "📄";
      case "doc":
      case "docx":
        return "📝";
      case "zip":
        return "🗜️";
      case "ppt":
      case "pptx":
        return "📊";
      case "mp4":
      case "mov":
      case "avi":
      case "mkv":
        return "🎥";
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
        return "🖼️";
      default:
        return "📎";
    }
  };

  return (
    <>
      {/* Description */}
      <div className="edit-description-section">
        <h3 className="edit-content-section-title">📖 Assignment Instructions</h3>
        <textarea
          rows={6}
          className="edit-description-textarea"
          value={lessonForm.description || ""}
          onChange={(e) => onFormChange("description", e.target.value)}
          placeholder="Provide detailed assignment instructions here..."
        />
      </div>

      {/* Assignment Details */}
      {/* <div className="edit-assignment-details">
        <h3 className="edit-content-section-title">📝 Assignment Details</h3>

        <div className="edit-form-row">
          <Form.Group className="edit-form-group">
            <Form.Label>Total Points</Form.Label>
            <Form.Control
              type="number"
              value={lessonForm.totalPoints || 100}
              onChange={(e) => onFormChange("totalPoints", e.target.value)}
              placeholder="100"
              min="0"
            />
          </Form.Group>

          <Form.Group className="edit-form-group">
            <Form.Label>Passing Grade (%)</Form.Label>
            <Form.Control
              type="number"
              value={lessonForm.passingGrade || 70}
              onChange={(e) => onFormChange("passingGrade", e.target.value)}
              placeholder="70"
              min="0"
              max="100"
            />
          </Form.Group>
        </div>

        <Form.Group className="mb-3">
          <Form.Label>Submission Type</Form.Label>
          <Form.Select
            value={lessonForm.submissionType || "file"}
            onChange={(e) => onFormChange("submissionType", e.target.value)}
          >
            <option value="file">File Upload</option>
            <option value="text">Text Entry</option>
            <option value="url">Website URL</option>
            <option value="both">File Upload & Text Entry</option>
          </Form.Select>
        </Form.Group>

        {(lessonForm.submissionType === "file" || lessonForm.submissionType === "both") && (
          <Form.Group className="mb-3">
            <Form.Label>Allowed File Types</Form.Label>
            <Form.Control
              type="text"
              value={lessonForm.allowedFileTypes || "pdf, doc, docx, zip"}
              onChange={(e) => onFormChange("allowedFileTypes", e.target.value)}
              placeholder="pdf, doc, docx, zip"
            />
            <small className="text-muted">Comma-separated file extensions</small>
          </Form.Group>
        )}
      </div> */}

      {/* Due Date */}
      {/* <div className="edit-deadline-section">
        <h3 className="edit-content-section-title">📅 Due Date & Time</h3>
        <div className="edit-form-row">
          <Form.Group className="edit-form-group">
            <Form.Label>Due Date</Form.Label>
            <Form.Control
              type="date"
              value={lessonForm.dueDate || ""}
              onChange={(e) => onFormChange("dueDate", e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </Form.Group>

          <Form.Group className="edit-form-group">
            <Form.Label>Due Time</Form.Label>
            <Form.Control
              type="time"
              value={lessonForm.dueTime || "23:59"}
              onChange={(e) => onFormChange("dueTime", e.target.value)}
            />
          </Form.Group>
        </div>
        <small className="text-muted">
          Students will be able to submit until this date and time (must be in the future)
        </small>
      </div> */}

      {/* Late Submission Policy */}
      {/* <div className="edit-late-policy-section">
        <h3 className="edit-content-section-title">⏰ Late Submission Policy</h3>
        <Form.Check
          type="checkbox"
          label="Allow late submissions"
          checked={lessonForm.allowLateSubmission || false}
          onChange={(e) => onFormChange("allowLateSubmission", e.target.checked)}
          className="mb-2"
        />

        {lessonForm.allowLateSubmission && (
          <div className="edit-form-row">
            <Form.Group className="edit-form-group">
              <Form.Label>Late Penalty (%)</Form.Label>
              <Form.Control
                type="number"
                value={lessonForm.latePenalty || 10}
                onChange={(e) => onFormChange("latePenalty", e.target.value)}
                placeholder="10"
                min="0"
                max="100"
              />
              <small className="text-muted">Percentage deducted per day late</small>
            </Form.Group>

            <Form.Group className="edit-form-group">
              <Form.Label>Max Late Days</Form.Label>
              <Form.Control
                type="number"
                value={lessonForm.maxLateDays || 3}
                onChange={(e) => onFormChange("maxLateDays", e.target.value)}
                placeholder="3"
                min="1"
              />
            </Form.Group>
          </div>
        )}
      </div> */}

      {/* File Upload for Assignment Materials */}
      <div className="edit-upload-section">
        <h3 className="edit-content-section-title">📎 Attach Assignment Materials (Optional):</h3>
        <div className="edit-upload-area">
          <div className="edit-upload-icon">☁️⬆️</div>
          <input
            type="file"
            id="assignmentFileUpload"
            multiple
            onChange={onFileUpload}
            style={{ display: "none" }}
          />
          <label htmlFor="assignmentFileUpload" className="edit-upload-btn">
            Choose files
          </label>
          <p className="edit-upload-text">Or drag'n drop files here</p>
          <p className="edit-upload-limit">
            Upload reference materials, templates, or instructions - Maximum size: 100MB per file
          </p>
        </div>

        {/* Uploaded files list (pending uploads) */}
        {lessonForm.files && lessonForm.files.length > 0 && (
          <div className="edit-files-list">
            {lessonForm.files.map((file, index) => (
              <div key={index} className="edit-file-item">
                <span className="edit-file-icon" aria-hidden="true">
                  {getFileIcon(file.name)}
                </span>
                <span className="edit-file-name">{file.name}</span>
                <button
                  className="edit-file-remove"
                  onClick={() => onRemoveFile(index)}
                  title="Remove file"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Staged uploads (temp files uploaded to /uploads/files but not persisted yet) */}
        {lessonForm.lessonResources &&
          lessonForm.lessonResources.some((r) => r.fileId && !r.id) && (
            <div className="staged-resources mt-3">
              <h5 style={{ fontSize: "0.95rem", marginBottom: "0.5rem" }}>📤 Staged uploads</h5>
              <div className="edit-files-list">
                {lessonForm.lessonResources
                  .filter((r) => r.fileId && !r.id)
                  .map((r) => (
                    <div key={r.fileId} className="edit-file-item staged">
                      <span className="edit-file-icon" aria-hidden="true">
                        📤
                      </span>
                      <span className="edit-file-name">
                        <strong>{r.filename}</strong> <small className="text-muted">(staged)</small>
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

        {/* Existing lesson resources (persisted) */}
        {lessonForm.lessonResources && lessonForm.lessonResources.length > 0 && (
          <div className="existing-resources mt-3">
            <h5 style={{ fontSize: "0.95rem", marginBottom: "0.5rem" }}>Resources</h5>
            <div className="edit-files-list">
              {lessonForm.lessonResources.map((res) => (
                <div key={res.id || res.fileId || res.filename} className="edit-file-item">
                  <span className="edit-file-icon" aria-hidden="true">
                    {getFileIcon(res.filename)}
                  </span>
                  <a
                    className="edit-file-name"
                    href="#"
                    onClick={(e) => handleDownloadResource(e, res.lessonId, res.id, res.filename)}
                  >
                    {res.filename}
                  </a>
                  <button
                    className="edit-file-remove"
                    onClick={() => handleDeleteResource(res.id, res.filename)}
                    title="Delete file"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AssignmentLessonContent;
