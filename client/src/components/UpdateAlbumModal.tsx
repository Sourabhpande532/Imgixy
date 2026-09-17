import { useState } from "react";

import API from "../services/api";
import { toast } from "react-toastify";
import { closeModal } from "../utils/modal";
import type { AlbumType } from "../types";

interface Props {
  album: AlbumType | null;
  refresh: () => void;
}

const UpdateAlbumModal: React.FC<Props> = ({ album, refresh }) => {
  const [description, setDescription] = useState(album?.description || "");
  const [prevAlbumId, setPrevAlbumId] = useState(album?._id);

  if (album?._id !== prevAlbumId) {
    setPrevAlbumId(album?._id);
    setDescription(album?.description || "");
  }


  const handleUpdate = async () => {
    if (!album) return;
    try {
      await API.put(`/albums/${album._id}`, { description });

      closeModal("updateAlbumModal");
      refresh();
      toast.success("Album updated successfully 🚀");
    } catch (err) {
      toast.error("Failed to update album");
      console.error(err);
    }
  };


  return (
    <div className="modal fade" id="updateAlbumModal" tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="fas fa-edit me-2" style={{ color: "var(--accent)" }} />
              Update Album
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" />
          </div>

          <div className="modal-body d-flex flex-column gap-3">
            <div>
              <label className="kx-label">Description</label>
              <input
                id="update-album-desc-input"
                className="kx-input"
                placeholder="Update album description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer gap-2">
            <button className="kx-btn-cancel" data-bs-dismiss="modal">Cancel</button>
            <button id="update-album-submit" className="kx-btn-success" onClick={handleUpdate}>
              <i className="fas fa-save me-1" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateAlbumModal;
