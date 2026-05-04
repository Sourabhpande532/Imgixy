/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import API, { setToken } from "../services/api";
import Navbar from "../components/Navbar";
import CommentModal from "../components/CommentModal";
import type { Image } from "../types";
import UploadModal from "../components/UploadModal";
import { toast } from "react-toastify";

const AlbumPage = () => {
  const { albumId } = useParams();
  const [images, setImages] = useState<Image[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [ready, setReady] = useState(false);

  // ── Filter state ──────────────────────────────────────
  const [showFavOnly, setShowFavOnly] = useState(false);
  const [tagFilter, setTagFilter] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("kavioToken");
    if (token) {
      setToken(token);
      setReady(true);
    }
  }, []);

  const fetchImages = async () => {
    const res = await API.get(`/images/${albumId}`);
    setImages(res.data);
  };

  useEffect(() => {
    if (!ready) return;
    fetchImages();
  }, [ready]);

  const toggleFav = async (img: Image) => {
    await API.put(`/images/${img._id}/favorite`, {
      isFavorite: !img.isFavorite,
    });
    fetchImages();
  };

  const deleteImage = async (imgId: string) => {
    if (!window.confirm("Delete this photo? This cannot be undone.")) return;
    try {
      await API.delete(`/images/${imgId}`);
      toast.success("Photo deleted");
      fetchImages();
    } catch {
      toast.error("Failed to delete photo");
    }
  };

  // ── Derived filtered list (client-side, no extra API call) ──
  const filtered = useMemo(() => {
    let list = images;
    if (showFavOnly) list = list.filter((i) => i.isFavorite);
    const q = tagFilter.trim().toLowerCase();
    if (q) list = list.filter((i) => i.tags?.some((t) => t.toLowerCase().includes(q)));
    return list;
  }, [images, showFavOnly, tagFilter]);

  // Collect all unique tags for quick-select chips
  const allTags = useMemo(
    () => Array.from(new Set(images.flatMap((i) => i.tags ?? []))).sort(),
    [images]
  );

  return (
    <>
      <Navbar />

      <div className="kx-page">
        <div className="container">

          {/* ── Top bar ── */}
          <div className="kx-upload-bar">
            <div>
              <h2 className="kx-page-title" style={{ fontSize: "1.25rem" }}>
                <i className="fas fa-images me-2" style={{ color: "var(--accent)" }} />
                Album Photos
              </h2>
              <p className="kx-page-subtitle" style={{ fontSize: "0.82rem" }}>
                {filtered.length} of {images.length}{" "}
                {images.length === 1 ? "photo" : "photos"}
              </p>
            </div>

            <button
              id="upload-image-btn"
              className="kx-create-btn btn"
              data-bs-toggle="modal"
              data-bs-target="#uploadModal"
            >
              <i className="fas fa-cloud-upload-alt me-2" />
              Upload Photo
            </button>
          </div>

          {/* ── Filter bar ── */}
          <div className="kx-filter-bar">
            {/* Favourites toggle */}
            <button
              id="filter-fav-btn"
              className={`kx-filter-pill ${showFavOnly ? "active" : ""}`}
              onClick={() => setShowFavOnly((v) => !v)}
            >
              <i className={`${showFavOnly ? "fas" : "far"} fa-star me-1`} />
              {showFavOnly ? "Favorites only" : "All photos"}
            </button>

            {/* Tag search input */}
            <div className="kx-filter-search">
              <i className="fas fa-tag" />
              <input
                id="tag-filter-input"
                type="text"
                placeholder="Filter by tag…"
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
              />
              {tagFilter && (
                <button className="kx-filter-clear" onClick={() => setTagFilter("")}>
                  <i className="fas fa-times" />
                </button>
              )}
            </div>

            {/* Quick-select tag chips */}
            {allTags.length > 0 && (
              <div className="kx-tag-chips">
                {allTags.map((t) => (
                  <button
                    key={t}
                    className={`kx-tag-chip ${tagFilter === t ? "active" : ""}`}
                    onClick={() => setTagFilter(tagFilter === t ? "" : t)}
                  >
                    #{t}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Modals ── */}
          <UploadModal albumId={albumId!} refresh={fetchImages} />
          <CommentModal imageId={selected} refresh={fetchImages} />

          {/* ── Image grid ── */}
          {images.length === 0 ? (
            <div className="kx-empty">
              <span className="kx-empty-icon">
                <i className="fas fa-photo-video" />
              </span>
              <h3>No photos yet</h3>
              <p>Upload your first photo to this album</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="kx-empty">
              <span className="kx-empty-icon">
                <i className="fas fa-filter" />
              </span>
              <h3>No photos match your filter</h3>
              <p>Try a different tag or turn off the favorites filter</p>
            </div>
          ) : (
            <div className="row g-3">
              {filtered.map((img, i) => (
                <div
                  className="col-6 col-md-4 col-lg-3"
                  key={img._id}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="kx-img-card">
                    <div className="kx-img-thumb-wrap">
                      <img src={img.url} alt={img.person || "photo"} />
                      {/* Delete overlay button */}
                      <button
                        id={`delete-img-${img._id}`}
                        className="kx-img-del-btn"
                        onClick={() => deleteImage(img._id)}
                        title="Delete photo"
                      >
                        <i className="fas fa-trash-alt" />
                      </button>
                      {img.isFavorite && (
                        <span className="kx-img-fav-badge">
                          <i className="fas fa-star" />
                        </span>
                      )}
                    </div>

                    <div className="kx-img-body">
                      {/* Tags */}
                      {img.tags?.length > 0 && (
                        <div className="mb-1">
                          {img.tags.map((t) => (
                            <span
                              className="kx-img-tag"
                              key={t}
                              style={{ cursor: "pointer" }}
                              onClick={() => setTagFilter(t)}
                              title={`Filter by #${t}`}
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Person */}
                      {img.person && (
                        <p className="kx-img-person">
                          <i className="fas fa-user me-1" />
                          {img.person}
                        </p>
                      )}

                      {/* Action buttons */}
                      <div className="kx-img-actions">
                        <button
                          id={`fav-${img._id}`}
                          className={`kx-btn-fav ${img.isFavorite ? "active" : ""}`}
                          onClick={() => toggleFav(img)}
                        >
                          <i className={`${img.isFavorite ? "fas" : "far"} fa-star me-1`} />
                          {img.isFavorite ? "Starred" : "Star"}
                        </button>

                        <button
                          id={`comment-${img._id}`}
                          className="kx-btn-comment"
                          data-bs-toggle="modal"
                          data-bs-target="#commentModal"
                          onClick={() => setSelected(img._id)}
                        >
                          <i className="far fa-comment me-1" />
                          {img.comments?.length > 0 ? img.comments.length : ""}
                          {" "}Comment
                        </button>
                      </div>

                      {/* ── Persisted comments ── */}
                      {img.comments?.length > 0 && (
                        <div className="kx-comments-section">
                          <p className="kx-comments-label">
                            <i className="fas fa-comments me-1" />
                            {img.comments.length}{" "}
                            {img.comments.length === 1 ? "comment" : "comments"}
                          </p>
                          <ul className="kx-comments-list">
                            {img.comments.map((c, idx) => (
                              <li key={idx} className="kx-comment-item">
                                <i className="fas fa-circle-user me-1" style={{ color: "var(--accent)", fontSize: "0.7rem" }} />
                                {c}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AlbumPage;
