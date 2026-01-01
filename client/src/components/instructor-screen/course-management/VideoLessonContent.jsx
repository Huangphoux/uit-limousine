import { Form } from "react-bootstrap";

const VideoLessonContent = ({ lessonForm, onFormChange, onFileUpload, onRemoveFile }) => {
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
          placeholder="Add video description (optional)"
        />
      </div>

      {/* Video URL */}
      <div className="edit-url-section">
        <h3 className="edit-content-section-title">🔗 Video URL</h3>
        <Form.Control
          type="text"
          className="edit-url-input"
          value={lessonForm.videoUrl || ""}
          onChange={(e) => onFormChange("videoUrl", e.target.value)}
          placeholder="Enter YouTube, Vimeo, or other video URL"
          style={{ color: "#000", backgroundColor: "#d9d9d9", WebkitTextFillColor: "#000" }}
        />
      </div>

      {/* File Upload for Video */}
      <div className="edit-upload-section">
        <h3 className="edit-section-title">Or upload video file:</h3>
        <div className="edit-upload-area">
          <div className="edit-upload-icon">☁️⬆️</div>
          <input
            type="file"
            id="videoFileUpload"
            accept="video/*"
            onChange={onFileUpload}
            style={{ display: "none" }}
          />
          <label htmlFor="videoFileUpload" className="edit-upload-btn">
            Choose video file
          </label>
          <p className="edit-upload-text">Or drag'n drop video here</p>
          <p className="edit-upload-limit">
            Accepted formats: MP4, AVI, MOV, WMV - Maximum size: 500MB
          </p>
        </div>

        {/* Uploaded files list (pending) */}
        {lessonForm.files && lessonForm.files.length > 0 && (
          <div className="edit-files-list">
            {lessonForm.files.map((file, index) => (
              <div key={index} className="edit-file-item">
                <span className="edit-file-icon">🎥</span>
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
                      <span className="edit-file-icon">🎥</span>
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
                  <span className="edit-file-icon">🎥</span>
                  <a
                    className="edit-file-name"
                    href={`${import.meta.env.VITE_API_URL}/lessons/${res.lessonId}/resources/${res.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {res.filename}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default VideoLessonContent;
