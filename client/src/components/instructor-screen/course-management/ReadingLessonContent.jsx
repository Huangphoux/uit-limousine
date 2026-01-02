import { Form } from "react-bootstrap";
import { useResourceDownload } from "./useResourceDownload";

const ReadingLessonContent = ({ lessonForm, onFormChange, onFileUpload, onRemoveFile }) => {
  const handleResourceDeleted = (resourceId) => {
    // Remove the resource from lessonForm.lessonResources
    const updatedResources = lessonForm.lessonResources.filter((r) => r.id !== resourceId);
    onFormChange("lessonResources", updatedResources);
  };

  const { handleDownloadResource, handleDeleteResource } =
    useResourceDownload(handleResourceDeleted);

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

        {/* Uploaded files list (pending) */}
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
                      <span className="edit-file-icon">📤</span>
                      <span className="edit-file-name">
                        <strong>{r.filename}</strong> <small className="text-muted">(staged)</small>
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

        {/* Existing lesson resources */}
        {lessonForm.lessonResources && lessonForm.lessonResources.length > 0 && (
          <div className="existing-resources mt-3">
            <h5 style={{ fontSize: "0.95rem", marginBottom: "0.5rem" }}>Resources</h5>
            <div className="edit-files-list">
              {lessonForm.lessonResources.map((res) => (
                <div key={res.id} className="edit-file-item">
                  <span className="edit-file-icon">📄</span>
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

export default ReadingLessonContent;
