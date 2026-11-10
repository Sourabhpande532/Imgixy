import { useState } from "react";
import API from "../services/api";
import { toast } from "../utils/toast";
import { closeModal } from "../utils/modal";
import type { AlbumType } from "../types";

interface Props {
  album: AlbumType | null;
  refresh: () => void;
}

const UpdateAlbumModal: React.FC<Props> = ({ album, refresh }) => {
  const [name, setName] = useState(album?.name || "");
  const [description, setDescription] = useState(album?.description || "");
  const [prevAlbumId, setPrevAlbumId] = useState(album?._id);
  const [submitting, setSubmitting] = useState(false);

  if (album?._id !== prevAlbumId) {
    setPrevAlbumId(album?._id);
    setName(album?.name || "");
    setDescription(album?.description || "");
  }

  const handleUpdate = async () => {
    if (!album) return;
    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error("Album name cannot be empty");
      return;
    }

    try {
      setSubmitting(true);
      await API.put(`/albums/${album._id}`, {
        name: trimmedName,
        description: description.trim(),
      });

      closeModal("updateAlbumModal");
      refresh();
      toast.success("Album updated successfully");
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const axiosErr = err as any;
      const msg =
        axiosErr?.response?.data?.msg ||
        axiosErr?.response?.data?.error ||
        "Failed to update album";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal fade" id="updateAlbumModal" tabIndex={-1} aria-labelledby="updateAlbumModalTitle" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="updateAlbumModalTitle">
              <i className="fas fa-edit me-2" style={{ color: "var(--accent)" }} />
              Update Album
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
          </div>

          <div className="modal-body d-flex flex-column gap-3">
            <div>
              <label htmlFor="update-album-name-input" className="kx-label">
                Album Name *
              </label>
              <input
                id="update-album-name-input"
                className="kx-input"
                placeholder="Album name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !submitting && handleUpdate()}
              />
            </div>

            <div>
              <label htmlFor="update-album-desc-input" className="kx-label">
                Description
              </label>
              <input
                id="update-album-desc-input"
                className="kx-input"
                placeholder="Update album description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !submitting && handleUpdate()}
              />
            </div>
          </div>

          <div className="modal-footer gap-2">
            <button type="button" className="kx-btn-cancel" data-bs-dismiss="modal">
              Cancel
            </button>
            <button
              type="button"
              id="update-album-submit"
              className="kx-btn-success"
              onClick={handleUpdate}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                  Saving...
                </>
              ) : (
                <>
                  <i className="fas fa-save me-1" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateAlbumModal;
