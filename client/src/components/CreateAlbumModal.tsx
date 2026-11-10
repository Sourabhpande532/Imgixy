import { useState } from "react";
import API from "../services/api";
import { toast } from "../utils/toast";
import { closeModal } from "../utils/modal";

interface Props {
  refresh: () => void;
}

const CreateAlbumModal: React.FC<Props> = ({ refresh }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error("Album name is required");
      return;
    }

    try {
      setSubmitting(true);
      await API.post("/albums", {
        name: trimmedName,
        description: description.trim(),
      });

      setName("");
      setDescription("");
      refresh();

      closeModal("createModal");
      toast.success("Album created successfully");
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const axiosErr = err as any;
      const msg =
        axiosErr?.response?.data?.msg ||
        axiosErr?.response?.data?.error ||
        "Failed to create album";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal fade" id="createModal" tabIndex={-1} aria-labelledby="createModalTitle" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="createModalTitle">
              <i className="fas fa-folder-plus me-2" style={{ color: "var(--accent)" }} />
              Create New Album
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
          </div>

          <div className="modal-body d-flex flex-column gap-3">
            <div>
              <label htmlFor="album-name-input" className="kx-label">
                Album Name *
              </label>
              <input
                id="album-name-input"
                className="kx-input"
                placeholder="e.g. Summer Vacation 2026"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !submitting && handleCreate()}
              />
            </div>

            <div>
              <label htmlFor="album-desc-input" className="kx-label">
                Description
              </label>
              <input
                id="album-desc-input"
                className="kx-input"
                placeholder="Optional — what is this album about?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !submitting && handleCreate()}
              />
            </div>
          </div>

          <div className="modal-footer gap-2">
            <button type="button" className="kx-btn-cancel" data-bs-dismiss="modal">
              Cancel
            </button>
            <button
              type="button"
              id="create-album-submit"
              className="kx-btn-success"
              onClick={handleCreate}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                  Creating...
                </>
              ) : (
                <>
                  <i className="fas fa-check me-1" />
                  Create Album
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAlbumModal;
