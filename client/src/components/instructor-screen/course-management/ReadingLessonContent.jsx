import { Form } from "react-bootstrap";

const ReadingLessonContent = ({ lessonForm, onFormChange, onFileUpload, onRemoveFile }) => {
  return (
    <>
      {/* Description */}
      <div className="edit-description-section">
        <h3 className="edit-content-section-title">📖 Description</h3>
        <textarea
          rows={4}
          className="edit-description-textarea"
          value={lessonForm.description || ""}
          onChange={(e) => onFormChange("description", e.target.value)}
          placeholder="Add reading description (optional)"
        />
      </div>

      {/* Reading Content */}
      <div className="edit-reading-content-section">
        <h3 className="edit-content-section-title">📝 Reading Content</h3>
        <textarea
          rows={10}
          className="edit-reading-textarea"
          value={lessonForm.readingContent || ""}
          onChange={(e) => onFormChange("readingContent", e.target.value)}
          placeholder="Enter the reading material content here..."
        />
      </div>

      {/* File Upload for Reading Materials */}
      <div className="edit-upload-section">
        <h3 className="edit-section-title">Or upload reading materials:</h3>
        <div className="edit-upload-area">
          <div className="edit-upload-icon">☁️⬆️</div>
          <input
            type="file"
            id="readingFileUpload"
            accept=".pdf,.doc,.docx,.txt,.ppt,.pptx"
            multiple
            onChange={onFileUpload}
            style={{ display: "none" }}
          />
          <label htmlFor="readingFileUpload" className="edit-upload-btn">
            Choose files
          </label>
          <p className="edit-upload-text">Or drag'n drop files here</p>
          <p className="edit-upload-limit">
            Accepted formats: PDF, DOC, DOCX, TXT, PPT, PPTX - Maximum size: 100MB per file
          </p>
        </div>

        {/* Uploaded files list */}
        {lessonForm.files && lessonForm.files.length > 0 && (
          <div className="edit-files-list">
            {lessonForm.files.map((file, index) => (
              <div key={index} className="edit-file-item">
                <span className="edit-file-icon">📄</span>
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
      </div>

      {/* Reading Time */}
      {/* <div className="edit-duration-section">
        <h3 className="edit-content-section-title">⏱️ Estimated Reading Time</h3>
        <Form.Control
          type="text"
          className="edit-duration-input"
          value={lessonForm.duration}
          onChange={(e) => onFormChange("duration", e.target.value)}
          placeholder="e.g., 15:00 (mm:ss)"
        />
        <small className="text-muted">Format: minutes:seconds (e.g., 15:00)</small>
      </div> */}
    </>
  );
};

export default ReadingLessonContent;
