import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo, useCallback } from "react";
import API, { setToken, getCurrentUser } from "../services/api";
import Navbar from "../components/Navbar";
import CommentModal from "../components/CommentModal";
import ShareModal from "../components/ShareModal";
import type { Image, AlbumType } from "../types";
import UploadModal from "../components/UploadModal";
import { toast } from "../utils/toast";

// Helper for dynamic Cloudinary image format & size optimization
const getOptimizedImageUrl = (url: string) => {
  if (!url) return url;
  if (url.includes("/upload/") && !url.includes("/upload/f_auto")) {
    return url.replace("/upload/", "/upload/f_auto,q_auto,w_600/");
  }
  return url;
};

const formatFileSize = (bytes?: number) => {
  if (!bytes || bytes <= 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

type SortOption = "newest" | "oldest" | "name" | "size";

const AlbumPage = () => {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const [images, setImages] = useState<Image[]>([]);
  const [album, setAlbum] = useState<AlbumType | null>(null);
  const [albumNotFound, setAlbumNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string>("");
  const [showFavOnly, setShowFavOnly] = useState(false);
  const [tagFilter, setTagFilter] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [quickComment, setQuickComment] = useState("");
  const [postingQuickComment, setPostingQuickComment] = useState(false);

  const currentUser = getCurrentUser();
  const isOwner =
    !currentUser?.id ||
    !album?.ownerId ||
    album.ownerId === currentUser.id;

  const fetchImages = useCallback(async () => {
    if (!albumId) return;
    try {
      const res = await API.get(`/images/${albumId}`);
      setImages(res.data);
      setAlbumNotFound(false);
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const status = (err as any)?.response?.status;
      if (status === 404 || status === 403) {
        setAlbumNotFound(true);
      } else {
        toast.error("Failed to load album images");
      }
    } finally {
      setLoading(false);
    }
  }, [albumId]);

  const fetchAlbumDetails = useCallback(async () => {
    if (!albumId) return;
    try {
      const res = await API.get("/albums");
      const found = (res.data as AlbumType[]).find((a) => a._id === albumId);
      if (found) setAlbum(found);
    } catch {
      // Non-blocking metadata lookup
    }
  }, [albumId]);

  useEffect(() => {
    const token = localStorage.getItem("kavioToken");
    if (!token) {
      navigate("/login");
      return;
    }
    setToken(token);
    if (!albumId) return;

    let isMounted = true;

    Promise.all([
      API.get(`/images/${albumId}`),
      API.get("/albums").catch(() => ({ data: [] })),
    ])
      .then(([imgRes, albumsRes]) => {
        if (!isMounted) return;
        setImages(imgRes.data);
        setAlbumNotFound(false);
        const found = (albumsRes.data as AlbumType[]).find(
          (a) => a._id === albumId,
        );
        if (found) setAlbum(found);
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const status = (err as any)?.response?.status;
        if (status === 404 || status === 403) {
          setAlbumNotFound(true);
        } else {
          toast.error("Failed to load album images");
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [albumId, navigate]);

  const toggleFav = async (img: Image) => {
    try {
      await API.put(`/images/${img._id}/favorite`, {
        isFavorite: !img.isFavorite,
      });
      fetchImages();
    } catch {
      toast.error("Failed to update favorite status");
    }
  };

  const deleteImage = async (imgId: string) => {
    if (!window.confirm("Delete this photo? This cannot be undone.")) return;
    try {
      await API.delete(`/images/${imgId}`);
      setImages((prev) => prev.filter((i) => i._id !== imgId));
      setLightboxIndex(null);
      toast.success("Photo deleted");
      fetchImages();
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const axiosErr = err as any;
      toast.error(
        axiosErr?.response?.data?.error ||
          axiosErr?.response?.data?.msg ||
          "Failed to delete photo",
      );
    }
  };

  // ── Derived filtered & sorted list (client-side) ──
  const filtered = useMemo(() => {
    let list = [...images];
    if (showFavOnly) list = list.filter((i) => i.isFavorite);
    const q = tagFilter.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (i) =>
          i.tags?.some((t) => t.toLowerCase().includes(q)) ||
          i.name?.toLowerCase().includes(q) ||
          i.person?.toLowerCase().includes(q),
      );
    }

    list.sort((a, b) => {
      if (sortBy === "name") {
        return (a.name || "").localeCompare(b.name || "");
      }
      if (sortBy === "size") {
        return (b.size || 0) - (a.size || 0);
      }
      const dateA = new Date(a.uploadedAt || a.uploadedAT || 0).getTime();
      const dateB = new Date(b.uploadedAt || b.uploadedAT || 0).getTime();
      return sortBy === "oldest" ? dateA - dateB : dateB - dateA;
    });

    return list;
  }, [images, showFavOnly, tagFilter, sortBy]);

  // Collect all unique tags for quick-select chips
  const allTags = useMemo(
    () =>
      Array.from(
        new Set(
          images
            .flatMap((i) => i.tags ?? [])
            .flatMap((t) => String(t).split(","))
            .map((t) => t.trim())
            .filter(Boolean),
        ),
      ).sort(),
    [images],
  );

  const activeLightboxImage =
    lightboxIndex !== null && filtered[lightboxIndex]
      ? filtered[lightboxIndex]
      : null;

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxIndex(null);
      } else if (e.key === "ArrowRight") {
        setLightboxIndex((prev) =>
          prev !== null && filtered.length > 0
            ? (prev + 1) % filtered.length
            : null,
        );
      } else if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) =>
          prev !== null && filtered.length > 0
            ? (prev - 1 + filtered.length) % filtered.length
            : null,
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, filtered.length]);

  const handleQuickComment = async () => {
    if (!activeLightboxImage || !quickComment.trim()) return;
    try {
      setPostingQuickComment(true);
      await API.post(`/images/${activeLightboxImage._id}/comment`, {
        comment: quickComment.trim(),
      });
      setQuickComment("");
      await fetchImages();
      toast.success("Comment added");
    } catch {
      toast.error("Failed to add comment");
    } finally {
      setPostingQuickComment(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="kx-page">
        <div className="container">
          {/* Back button */}
          <button
            type="button"
            className="kx-back-btn"
            onClick={() => navigate("/dashboard")}
            aria-label="Back to Workspace"
          >
            <i className="fas fa-arrow-left" />
            <span>Back to Workspace</span>
          </button>

          {albumNotFound ? (
            <div className="kx-empty">
              <span className="kx-empty-icon">
                <i className="fas fa-folder-minus" />
              </span>
              <h3>Album not found or unavailable</h3>
              <p className="mb-4">
                This album may have been deleted or you may not have permission to view it.
              </p>
              <button
                type="button"
                className="kx-create-btn btn"
                onClick={() => navigate("/dashboard")}
              >
                <i className="fas fa-arrow-left me-2" />
                Return to Workspace
              </button>
            </div>
          ) : (
            <>
              {/* ── Top bar ── */}
              <div className="kx-upload-bar">
                <div>
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <h2 className="kx-page-title mb-0" style={{ fontSize: "1.4rem" }}>
                      <i
                        className="fas fa-images me-2"
                        style={{ color: "var(--accent)" }}
                      />
                      {album?.name || "Album Photos"}
                    </h2>
                    {album && (
                      <span
                        className={`kx-album-badge position-static ${isOwner ? "owner" : "shared"}`}
                      >
                        <i
                          className={`fas ${isOwner ? "fa-crown" : "fa-user-friends"}`}
                        />
                        <span>{isOwner ? "Owner" : "Shared with you"}</span>
                      </span>
                    )}
                  </div>

                  {album?.description && (
                    <p
                      className="mt-1"
                      style={{ fontSize: "0.86rem", color: "var(--text)" }}
                    >
                      {album.description}
                    </p>
                  )}

                  <p
                    className="kx-page-subtitle"
                    style={{ fontSize: "0.8rem", marginTop: "0.25rem" }}
                  >
                    {filtered.length} of {images.length}{" "}
                    {images.length === 1 ? "photo" : "photos"}
                    {album?.sharedWith && album.sharedWith.length > 0
                      ? ` • Shared with ${album.sharedWith.length} ${album.sharedWith.length === 1 ? "person" : "people"}`
                      : ""}
                  </p>
                </div>

                <div className="d-flex align-items-center gap-2 flex-wrap">
                  {isOwner && album && (
                    <button
                      type="button"
                      className="kx-btn-cancel"
                      data-bs-toggle="modal"
                      data-bs-target="#shareModal"
                      aria-label="Share Album"
                    >
                      <i className="fas fa-share-alt me-1" />
                      Share
                    </button>
                  )}

                  <button
                    type="button"
                    id="upload-image-btn"
                    className="kx-create-btn btn"
                    data-bs-toggle="modal"
                    data-bs-target="#uploadModal"
                    aria-label="Upload Photo"
                  >
                    <i className="fas fa-cloud-upload-alt me-2" />
                    Upload Photo
                  </button>
                </div>
              </div>

              {/* ── Filter & Sort bar ── */}
              <div className="kx-filter-bar">
                {/* Favorites toggle */}
                <button
                  type="button"
                  id="filter-fav-btn"
                  className={`kx-filter-pill ${showFavOnly ? "active" : ""}`}
                  onClick={() => setShowFavOnly((v) => !v)}
                  aria-label="Filter by favorites"
                >
                  <i className={`${showFavOnly ? "fas" : "far"} fa-star`} />
                  <span>{showFavOnly ? "Favorites only" : "All photos"}</span>
                </button>

                {/* Tag / Name / Person search input */}
                <div className="kx-filter-search">
                  <i className="fas fa-search" />
                  <input
                    id="tag-filter-input"
                    type="text"
                    placeholder="Search by tag, person, or name…"
                    value={tagFilter}
                    onChange={(e) => setTagFilter(e.target.value)}
                    aria-label="Filter photos by tag, person, or name"
                  />
                  {tagFilter && (
                    <button
                      type="button"
                      className="kx-filter-clear"
                      onClick={() => setTagFilter("")}
                      aria-label="Clear filter"
                    >
                      <i className="fas fa-times" />
                    </button>
                  )}
                </div>

                {/* Sort selector */}
                <div className="d-flex align-items-center gap-2 ms-md-auto">
                  <label
                    htmlFor="photo-sort-select"
                    style={{
                      fontSize: "0.78rem",
                      color: "var(--text-muted)",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Sort:
                  </label>
                  <select
                    id="photo-sort-select"
                    className="kx-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    aria-label="Sort photos"
                    style={{
                      width: "auto",
                      padding: "0.35rem 0.75rem",
                      fontSize: "0.8rem",
                      borderRadius: "99px",
                    }}
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="name">Name (A–Z)</option>
                    <option value="size">File Size</option>
                  </select>
                </div>

                {/* Quick-select tag chips */}
                {allTags.length > 0 && (
                  <div className="kx-tag-chips w-100 pt-1">
                    {allTags.map((t) => (
                      <button
                        type="button"
                        key={t}
                        className={`kx-tag-chip ${tagFilter.toLowerCase() === t.toLowerCase() ? "active" : ""}`}
                        onClick={() =>
                          setTagFilter(
                            tagFilter.toLowerCase() === t.toLowerCase() ? "" : t,
                          )
                        }
                        aria-label={`Tag #${t}`}
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
              {album && (
                <ShareModal
                  albumId={album._id}
                  album={album}
                  refresh={fetchAlbumDetails}
                />
              )}

              {/* ── Image grid ── */}
              {loading ? (
                <div className="kx-spinner-wrap">
                  <div className="kx-spinner" />
                </div>
              ) : images.length === 0 ? (
                <div className="kx-empty">
                  <span className="kx-empty-icon">
                    <i className="fas fa-photo-video" />
                  </span>
                  <h3>No photos yet</h3>
                  <p className="mb-4">
                    Upload your first photo to start building this collection.
                  </p>
                  <button
                    type="button"
                    className="kx-create-btn btn"
                    data-bs-toggle="modal"
                    data-bs-target="#uploadModal"
                  >
                    <i className="fas fa-cloud-upload-alt me-2" />
                    Upload First Photo
                  </button>
                </div>
              ) : filtered.length === 0 ? (
                <div className="kx-empty">
                  <span className="kx-empty-icon">
                    <i className="fas fa-filter" />
                  </span>
                  <h3>No photos match your filter</h3>
                  <p className="mb-3">
                    Try a different tag or turn off the favorites filter.
                  </p>
                  <button
                    type="button"
                    className="kx-btn-cancel"
                    onClick={() => {
                      setTagFilter("");
                      setShowFavOnly(false);
                    }}
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="row g-3">
                  {filtered.map((img, i) => {
                    const cardTags = (img.tags || [])
                      .flatMap((t) => String(t).split(","))
                      .map((t) => t.trim())
                      .filter(Boolean);

                    return (
                      <div
                        className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex"
                        key={img._id}
                        style={{ animationDelay: `${i * 0.03}s` }}
                      >
                        <div
                          className="kx-img-card w-100 d-flex flex-column"
                          style={{ height: "100%" }}
                        >
                          <div
                            className="kx-img-thumb-wrap"
                            style={{
                              height: "185px",
                              minHeight: "185px",
                              maxHeight: "185px",
                              overflow: "hidden",
                            }}
                            onClick={() => setLightboxIndex(i)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                setLightboxIndex(i);
                              }
                            }}
                            aria-label={`View ${img.name || "photo"} full screen`}
                          >
                            <img
                              src={getOptimizedImageUrl(img.url)}
                              alt={img.name || img.person || "Photo thumbnail"}
                              loading="lazy"
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                objectPosition: "center",
                                display: "block",
                              }}
                            />

                            {/* Delete overlay button (Owner only per Checklist Section 7) */}
                            {isOwner && (
                              <button
                                type="button"
                                id={`delete-img-${img._id}`}
                                className="kx-img-del-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteImage(img._id);
                                }}
                                title="Delete photo"
                                aria-label={`Delete ${img.name || "photo"}`}
                              >
                                <i className="fas fa-trash-alt" />
                              </button>
                            )}

                            {img.isFavorite && (
                              <span className="kx-img-fav-badge" title="Favorite photo">
                                <i className="fas fa-star" />
                              </span>
                            )}
                          </div>

                          <div className="kx-img-body">
                            {/* Tags */}
                            {cardTags.length > 0 && (
                              <div className="d-flex flex-wrap gap-1 mb-2">
                                {cardTags.map((t) => (
                                  <span
                                    className="kx-img-tag m-0"
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
                              <p
                                className="kx-img-person text-truncate mt-0 mb-2"
                                title={img.person}
                              >
                                <i
                                  className="fas fa-user me-1"
                                  style={{ color: "var(--accent)" }}
                                />
                                {img.person}
                              </p>
                            )}

                            {/* Action buttons */}
                            <div className="kx-img-actions">
                              <button
                                type="button"
                                id={`fav-${img._id}`}
                                className={`kx-btn-fav ${img.isFavorite ? "active" : ""}`}
                                onClick={() => toggleFav(img)}
                                aria-label={
                                  img.isFavorite ? "Unstar photo" : "Star photo"
                                }
                              >
                                <i
                                  className={`${img.isFavorite ? "fas" : "far"} fa-star`}
                                />
                                <span>{img.isFavorite ? "Starred" : "Star"}</span>
                              </button>

                              <button
                                type="button"
                                id={`comment-${img._id}`}
                                className="kx-btn-comment"
                                data-bs-toggle="modal"
                                data-bs-target="#commentModal"
                                onClick={() => setSelected(img._id)}
                                aria-label="Add comment to photo"
                              >
                                <i className="far fa-comment" />
                                <span>
                                  {img.comments?.length > 0
                                    ? `${img.comments.length} `
                                    : ""}
                                  Comment
                                </span>
                              </button>
                            </div>

                            {/* ── Persisted comments ── */}
                            {img.comments?.length > 0 && (
                              <div className="kx-comments-section">
                                <p className="kx-comments-label">
                                  <i className="fas fa-comments me-1" />
                                  {img.comments.length}{" "}
                                  {img.comments.length === 1
                                    ? "comment"
                                    : "comments"}
                                </p>
                                <ul className="kx-comments-list">
                                  {img.comments.map((c, idx) => (
                                    <li key={idx} className="kx-comment-item">
                                      <i
                                        className="fas fa-circle-user me-1"
                                        style={{
                                          color: "var(--accent)",
                                          fontSize: "0.75rem",
                                        }}
                                      />
                                      {c}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Full-Screen Photo Lightbox & Metadata Inspector ── */}
      {activeLightboxImage && (
        <div
          className="kx-lightbox-backdrop"
          onClick={() => setLightboxIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Photo Detail Inspector"
        >
          <div
            className="kx-lightbox-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="kx-lightbox-stage">
              {filtered.length > 1 && (
                <button
                  type="button"
                  className="kx-lightbox-nav prev"
                  onClick={() =>
                    setLightboxIndex(
                      (prev) =>
                        ((prev ?? 0) - 1 + filtered.length) % filtered.length,
                    )
                  }
                  aria-label="Previous photo"
                >
                  <i className="fas fa-chevron-left" />
                </button>
              )}

              <img
                src={activeLightboxImage.url}
                alt={activeLightboxImage.name || "Full resolution photo"}
              />

              {filtered.length > 1 && (
                <button
                  type="button"
                  className="kx-lightbox-nav next"
                  onClick={() =>
                    setLightboxIndex(
                      (prev) => ((prev ?? 0) + 1) % filtered.length,
                    )
                  }
                  aria-label="Next photo"
                >
                  <i className="fas fa-chevron-right" />
                </button>
              )}
            </div>

            <div className="kx-lightbox-sidebar">
              <div className="d-flex align-items-start justify-content-between gap-2">
                <div style={{ minWidth: 0 }}>
                  <h5
                    className="mb-1 text-truncate"
                    style={{ color: "var(--text-h)", fontWeight: 700 }}
                    title={activeLightboxImage.name}
                  >
                    {activeLightboxImage.name || "Photo Details"}
                  </h5>
                  <p style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
                    {[
                      formatFileSize(activeLightboxImage.size),
                      formatDate(
                        activeLightboxImage.uploadedAt ||
                          activeLightboxImage.uploadedAT,
                      ),
                    ]
                      .filter(Boolean)
                      .join(" • ")}
                  </p>
                </div>

                <button
                  type="button"
                  className="kx-theme-btn"
                  onClick={() => setLightboxIndex(null)}
                  aria-label="Close inspector"
                >
                  <i className="fas fa-times" />
                </button>
              </div>

              {activeLightboxImage.person && (
                <div>
                  <span className="kx-label">Person Tagged</span>
                  <p style={{ fontSize: "0.86rem", color: "var(--text-h)" }}>
                    <i
                      className="fas fa-user me-1"
                      style={{ color: "var(--accent)" }}
                    />
                    {activeLightboxImage.person}
                  </p>
                </div>
              )}

              {activeLightboxImage.tags?.length > 0 && (
                <div>
                  <span className="kx-label">Tags</span>
                  <div className="d-flex flex-wrap gap-1">
                    {activeLightboxImage.tags
                      .flatMap((t) => String(t).split(","))
                      .map((t) => t.trim())
                      .filter(Boolean)
                      .map((t) => (
                        <span key={t} className="kx-img-tag">
                          #{t}
                        </span>
                      ))}
                  </div>
                </div>
              )}

              <div className="d-flex gap-2">
                <button
                  type="button"
                  className={`kx-btn-fav ${activeLightboxImage.isFavorite ? "active" : ""}`}
                  onClick={() => toggleFav(activeLightboxImage)}
                >
                  <i
                    className={`${activeLightboxImage.isFavorite ? "fas" : "far"} fa-star`}
                  />
                  <span>
                    {activeLightboxImage.isFavorite ? "Starred" : "Star"}
                  </span>
                </button>

                <a
                  href={activeLightboxImage.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="kx-btn-comment text-decoration-none"
                >
                  <i className="fas fa-external-link-alt" />
                  <span>Original</span>
                </a>

                {isOwner && (
                  <button
                    type="button"
                    className="kx-btn-del"
                    onClick={() => deleteImage(activeLightboxImage._id)}
                    title="Delete photo"
                    aria-label="Delete photo"
                  >
                    <i className="fas fa-trash-alt" />
                  </button>
                )}
              </div>

              {/* Comments in Lightbox */}
              <div className="d-flex flex-column flex-grow-1" style={{ minHeight: 0 }}>
                <span className="kx-label">
                  Comments ({activeLightboxImage.comments?.length || 0})
                </span>
                <ul
                  className="kx-comments-list mb-3"
                  style={{ maxHeight: "180px" }}
                >
                  {activeLightboxImage.comments?.length > 0 ? (
                    activeLightboxImage.comments.map((c, idx) => (
                      <li key={idx} className="kx-comment-item">
                        <i
                          className="fas fa-circle-user me-1"
                          style={{ color: "var(--accent)", fontSize: "0.75rem" }}
                        />
                        {c}
                      </li>
                    ))
                  ) : (
                    <li
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--text-muted)",
                        fontStyle: "italic",
                      }}
                    >
                      No comments yet. Add the first note below.
                    </li>
                  )}
                </ul>

                <div className="d-flex gap-2 mt-auto">
                  <input
                    type="text"
                    className="kx-input"
                    placeholder="Add a comment..."
                    value={quickComment}
                    onChange={(e) => setQuickComment(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      !postingQuickComment &&
                      handleQuickComment()
                    }
                  />
                  <button
                    type="button"
                    className="kx-btn-primary"
                    onClick={handleQuickComment}
                    disabled={postingQuickComment}
                    aria-label="Send comment"
                  >
                    <i className="fas fa-paper-plane" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AlbumPage;
