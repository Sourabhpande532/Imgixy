import { useState } from "react";
import API from "../services/api";

interface Props {
  albumId: string;
  refresh: () => void;
}

const UploadModal: React.FC<Props> = ({ albumId, refresh }) => {
  const [file, setFile] = useState<File | null>(null);
  const [tags, setTags] = useState("");
  const [person, setPerson] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Select file");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("tags", tags);
    formData.append("person", person);
    formData.append("isFavorite", String(isFavorite));

    await API.post(`/images/${albumId}`, formData);

    refresh();
  };

  return (
    <div className="modal fade" id="uploadModal">
      <div className="modal-dialog">
        <div className="modal-content p-3">
          <h5>Upload Image</h5>

          <input
            type="file"
            className="form-control"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />

          <input
            className="form-control mt-2"
            placeholder="Tags (comma separated)"
            onChange={(e) => setTags(e.target.value)}
          />

          <input
            className="form-control mt-2"
            placeholder="Person name"
            onChange={(e) => setPerson(e.target.value)}
          />

          <div className="form-check mt-2">
            <input
              type="checkbox"
              className="form-check-input"
              onChange={(e) => setIsFavorite(e.target.checked)}
            />
            <label className="form-check-label">Favorite</label>
          </div>

          <button className="btn btn-success mt-3" onClick={handleUpload}>
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;