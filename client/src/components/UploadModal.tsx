import { useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

interface Props {
  albumId: string;
  refresh: () => void;
}

const UploadModal: React.FC<Props> = ({ albumId, refresh }) => {
  const [file, setFile] = useState<File | null>(null);
  const [tags, setTags] = useState("");
  const [person, setPerson] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return toast.error("Please select a file first");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("tags", tags);
    formData.append("person", person);
    formData.append("isFavorite", String(isFavorite));

    try {
      setUploading(true);
      await API.post(`/images/${albumId}`, formData);
      refresh();
      toast.success("Photo uploaded! 🎉");
      setFile(null);
      setTags("");
      setPerson("");
      setIsFavorite(false);
    } catch {
      toast.error("Upload failed, please try again");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="modal fade" id="uploadModal">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="fas fa-cloud-upload-alt me-2" style={{ color: "var(--success)" }} />
              Upload Photo
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" />
          </div>

          <div className="modal-body d-flex flex-column gap-3">
            {/* File drop area */}
            <div className="kx-file-drop">
              <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <div className="kx-file-icon">
                <i className="fas fa-image" />
              </div>
              {file ? (
                <p style={{ color: "var(--accent)", fontWeight: 600, fontSize: "0.85rem" }}>
                  ✓ {file.name}
                </p>
              ) : (
                <p className="kx-file-hint">Click or drag & drop an image here</p>
              )}
            </div>

            <div>
              <label className="kx-label">Tags</label>
              <input
                id="tags-input"
                className="kx-input"
                placeholder="e.g. beach, sunset, travel"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>

            <div>
              <label className="kx-label">Person</label>
              <input
                id="person-input"
                className="kx-input"
                placeholder="Who's in this photo?"
                value={person}
                onChange={(e) => setPerson(e.target.value)}
              />
            </div>

            {/* Favorite toggle */}
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                cursor: "pointer",
                color: "var(--text)",
                fontSize: "0.88rem",
              }}
            >
              <input
                id="favorite-checkbox"
                type="checkbox"
                checked={isFavorite}
                onChange={(e) => setIsFavorite(e.target.checked)}
                style={{ accentColor: "var(--accent)", width: 16, height: 16 }}
              />
              <i className="fas fa-star me-1" style={{ color: "var(--warning)" }} />
              Mark as Favorite
            </label>
          </div>

          <div className="modal-footer gap-2">
            <button className="kx-btn-cancel" data-bs-dismiss="modal">Cancel</button>
            <button
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
                  Upload
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