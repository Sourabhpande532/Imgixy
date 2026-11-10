import { useState, useEffect } from "react";
import API from "../services/api";
import { toast } from "../utils/toast";
import { closeModal } from "../utils/modal";

interface Props {
  albumId: string;
  refresh: () => void;
}

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const UploadModal: React.FC<Props> = ({ albumId, refresh }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [tags, setTags] = useState("");
  const [person, setPerson] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const validateAndSelectFile = (selected: File | null) => {
    if (!selected) {
      setFile(null);
      setPreviewUrl(null);
      return;
    }
    if (!ALLOWED_MIME_TYPES.includes(selected.type)) {
      toast.error("Only image files (JPG, PNG, GIF, WebP) are allowed.");
      return;
    }
    if (selected.size > MAX_FILE_SIZE_BYTES) {
      toast.error("File is too large. Maximum allowed file size is 10 MB.");
      return;
    }
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select an image file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("tags", tags.trim());
    formData.append("person", person.trim());
    formData.append("isFavorite", String(isFavorite));

    try {
      setUploading(true);
      await API.post(`/images/${albumId}`, formData);

      closeModal("uploadModal");
      setFile(null);
      setPreviewUrl(null);
      setTags("");
      setPerson("");
      setIsFavorite(false);
      toast.success("Photo uploaded");
      refresh();
    } catch (err: unknown) {
      let message = "Upload failed, please try again";
      if (err instanceof Error) message = err.message;
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const axiosErr = err as any;
        if (axiosErr?.response?.data?.error) {
          message = axiosErr.response.data.error;
        }
      } catch {
        /* ignore */
      }
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="modal fade" id="uploadModal" tabIndex={-1} aria-labelledby="uploadModalTitle" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="uploadModalTitle">
              <i className="fas fa-cloud-upload-alt me-2" style={{ color: "var(--success)" }} />
              Upload Photo
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
          </div>

          <div className="modal-body d-flex flex-column gap-3">
            {/* File drop area */}
            <div
              className="kx-file-drop"
              style={previewUrl && file ? { padding: "0.9rem 1rem" } : undefined}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  validateAndSelectFile(e.dataTransfer.files[0]);
                }
              }}
            >
              <input
                id="file-input"
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onClick={(e) => {
                  (e.target as HTMLInputElement).value = "";
                }}
                onChange={(e) => validateAndSelectFile(e.target.files?.[0] || null)}
              />
              {previewUrl && file ? (
                <div className="d-flex align-items-center gap-3 text-start">
                  <img
                    src={previewUrl}
                    alt="Selected preview"
                    style={{
                      width: 56,
                      height: 56,
                      minWidth: 56,
                      borderRadius: 10,
                      objectFit: "contain",
                      background: "var(--bg-2)",
                      padding: 2,
                      border: "1px solid var(--glass-border)",
                      display: "block",
                    }}
                  />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p
                      className="text-truncate mb-1"
                      style={{ color: "var(--text-h)", fontWeight: 600, fontSize: "0.85rem" }}
                      title={file.name}
                    >
                      <i className="fas fa-check-circle me-1" style={{ color: "var(--success)" }} />
                      {file.name}
                    </p>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}>
                      {formatFileSize(file.size)} • Click to replace image
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="kx-file-icon">
                    <i className="fas fa-image" />
                  </div>
                  <p className="kx-file-hint">Click or drag &amp; drop an image here</p>
                  <p style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                    Supports JPG, PNG, GIF, WebP (up to 10 MB)
                  </p>
                </>
              )}
            </div>

            <div>
              <label htmlFor="tags-input" className="kx-label">
                Tags (comma-separated)
              </label>
              <input
                id="tags-input"
                className="kx-input"
                placeholder="e.g. beach, sunset, travel"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="person-input" className="kx-label">
                Person in Photo
              </label>
              <input
                id="person-input"
                className="kx-input"
                placeholder="Optional — who is in this photo?"
                value={person}
                onChange={(e) => setPerson(e.target.value)}
              />
            </div>

            {/* Favorite toggle */}
            <label
              htmlFor="favorite-checkbox"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                cursor: "pointer",
                color: "var(--text-h)",
                fontSize: "0.88rem",
                fontWeight: 500,
              }}
            >
              <input
                id="favorite-checkbox"
                type="checkbox"
                checked={isFavorite}
                onChange={(e) => setIsFavorite(e.target.checked)}
                style={{ accentColor: "var(--accent)", width: 16, height: 16 }}
              />
              <i className="fas fa-star" style={{ color: "var(--warning)" }} />
              <span>Mark as Favorite</span>
            </label>
          </div>

          <div className="modal-footer gap-2">
            <button type="button" className="kx-btn-cancel" data-bs-dismiss="modal">
              Cancel
            </button>
            <button
              type="button"
              id="upload-submit"
              className="kx-btn-success"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                  Uploading...
                </>
              ) : (
                <>
                  <i className="fas fa-upload me-1" />
                  Upload Photo
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
