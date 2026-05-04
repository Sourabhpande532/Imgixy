import { useState } from "react";
import API from "../services/api";
import { Modal } from "bootstrap";
import { toast } from "react-toastify";

interface Props {
  refresh: () => void;
}

const CreateAlbumModal: React.FC<Props> = ({ refresh }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = async () => {
    try {
      if (!name) return toast.error("Album name is required");

      await API.post("/albums", { name, description });

      setName("");
      setDescription("");
      refresh();

      toast.success("Album created successfully 🚀");

      const modalEl = document.getElementById("createModal");
      const modal = Modal.getOrCreateInstance(modalEl!);
      modal.hide();

      document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
      document.body.classList.remove("modal-open");
      document.body.style.paddingRight = "";
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    }
  };

  return (
    <div className="modal fade" id="createModal" tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="fas fa-folder-plus me-2" style={{ color: "var(--accent)" }} />
              Create New Album
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" />
          </div>

          <div className="modal-body d-flex flex-column gap-3">
            <div>
              <label className="kx-label">Album Name *</label>
              <input
                id="album-name-input"
                className="kx-input"
                placeholder="e.g. Summer Vacation 2024"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="kx-label">Description</label>
              <input
                id="album-desc-input"
                className="kx-input"
                placeholder="Optional — what's this album about?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer gap-2">
            <button className="kx-btn-cancel" data-bs-dismiss="modal">Cancel</button>
            <button id="create-album-submit" className="kx-btn-success" onClick={handleCreate}>
              <i className="fas fa-check me-1" />
              Create Album
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAlbumModal;