import { useNavigate } from "react-router-dom";
import type { AlbumType } from "../types";

interface AlbumCardProps {
  album: AlbumType;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  animationIndex?: number;
}

function AlbumCard({ album, onSelect, onDelete, animationIndex = 0 }: AlbumCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex"
      style={{ animationDelay: `${animationIndex * 0.05}s` }}
    >
      <div className="kx-album-card w-100">
        <div className="kx-album-thumb">
          <i
            className="fas fa-folder-open"
            style={{ color: "var(--accent)", position: "relative", zIndex: 1 }}
          />
        </div>

        <div className="kx-album-body">
          <h5 className="kx-album-name">{album.name}</h5>
          <p className="kx-album-desc">
            {album.description || "No description provided."}
          </p>

          <div className="kx-album-actions mt-auto">
            <button
              id={`open-album-${album._id}`}
              className="kx-btn-open"
              onClick={() => navigate(`/album/${album._id}`)}
              aria-label={`Open album ${album.name}`}
            >
              <i className="fas fa-folder-open" />
              <span>Open Album</span>
            </button>

            <div className="d-flex gap-2 flex-wrap">
              <button
                id={`edit-album-${album._id}`}
                className="kx-btn-share"
                data-bs-toggle="modal"
                data-bs-target="#updateAlbumModal"
                onClick={() => onSelect(album._id)}
                aria-label={`Edit album ${album.name}`}
              >
                <i className="fas fa-edit me-1" />
                <span>Edit</span>
              </button>

              <button
                id={`share-album-${album._id}`}
                className="kx-btn-share"
                data-bs-toggle="modal"
                data-bs-target="#shareModal"
                onClick={() => onSelect(album._id)}
                aria-label={`Share album ${album.name}`}
              >
                <i className="fas fa-share-alt me-1" />
                <span>Share</span>
              </button>

              <button
                id={`delete-album-${album._id}`}
                className="kx-btn-del"
                onClick={() => onDelete(album._id)}
                title="Delete Album"
                aria-label={`Delete album ${album.name}`}
              >
                <i className="fas fa-trash-alt" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AlbumCard;
