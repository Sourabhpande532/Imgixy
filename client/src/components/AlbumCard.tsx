import { useNavigate } from "react-router-dom";
import type { AlbumType } from "../types";

interface AlbumCardProps {
  album: AlbumType;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  animationIndex?: number;
  currentUserId?: string;
}

function AlbumCard({
  album,
  onSelect,
  onDelete,
  animationIndex = 0,
  currentUserId,
}: AlbumCardProps) {
  const navigate = useNavigate();
  const isOwner = !currentUserId || !album.ownerId || album.ownerId === currentUserId;
  const sharedCount = album.sharedWith?.length || 0;

  return (
    <div
      className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex"
      style={{ animationDelay: `${animationIndex * 0.04}s` }}
    >
      <div className="kx-album-card w-100">
        <div
          className="kx-album-thumb"
          onClick={() => navigate(`/album/${album._id}`)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              navigate(`/album/${album._id}`);
            }
          }}
          aria-label={`Open album ${album.name}`}
        >
          <span className={`kx-album-badge ${isOwner ? "owner" : "shared"}`}>
            <i className={`fas ${isOwner ? "fa-crown" : "fa-user-friends"}`} />
            <span>{isOwner ? "Owner" : "Shared"}</span>
          </span>

          {sharedCount > 0 && (
            <span
              className="kx-album-shared-pill"
              title={`Shared with: ${album.sharedWith.join(", ")}`}
            >
              <i className="fas fa-share-nodes" style={{ color: "var(--accent)" }} />
              <span>{sharedCount}</span>
            </span>
          )}

          <i
            className="fas fa-folder-open"
            style={{ color: "var(--accent)", position: "relative", zIndex: 1 }}
          />
        </div>

        <div className="kx-album-body">
          <h5 className="kx-album-name" title={album.name}>
            {album.name}
          </h5>
          <p className="kx-album-desc">
            {album.description || "No description provided."}
          </p>

          <div className="kx-album-actions mt-auto">
            <button
              type="button"
              id={`open-album-${album._id}`}
              className="kx-btn-open"
              onClick={() => navigate(`/album/${album._id}`)}
              aria-label={`Open album ${album.name}`}
            >
              <i className="fas fa-folder-open" />
              <span>Open Album</span>
            </button>

            {isOwner ? (
              <div className="d-flex gap-2 flex-wrap">
                <button
                  type="button"
                  id={`edit-album-${album._id}`}
                  className="kx-btn-share"
                  data-bs-toggle="modal"
                  data-bs-target="#updateAlbumModal"
                  onClick={() => onSelect(album._id)}
                  aria-label={`Edit album ${album.name}`}
                >
                  <i className="fas fa-edit" />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  id={`share-album-${album._id}`}
                  className="kx-btn-share"
                  data-bs-toggle="modal"
                  data-bs-target="#shareModal"
                  onClick={() => onSelect(album._id)}
                  aria-label={`Share album ${album.name}`}
                >
                  <i className="fas fa-share-alt" />
                  <span>Share</span>
                </button>

                <button
                  type="button"
                  id={`delete-album-${album._id}`}
                  className="kx-btn-del"
                  onClick={() => onDelete(album._id)}
                  title="Delete Album"
                  aria-label={`Delete album ${album.name}`}
                >
                  <i className="fas fa-trash-alt" />
                </button>
              </div>
            ) : (
              <div
                className="d-flex align-items-center justify-content-center gap-1 py-1"
                style={{
                  fontSize: "0.76rem",
                  color: "var(--text-muted)",
                  background: "var(--surface-subtle)",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--glass-border)",
                }}
              >
                <i className="fas fa-eye" style={{ color: "var(--accent-secondary)" }} />
                <span>Shared with you (View &amp; Collaborate)</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AlbumCard;
