/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API, { setToken } from "../services/api";
import Navbar from "../components/Navbar";
import CommentModal from "../components/CommentModal";
import type { Image } from "../types";
import UploadModal from "../components/UploadModal";

const AlbumPage = () => {
  const { albumId } = useParams();
  const [images, setImages] = useState<Image[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [ready, setReady] = useState(false);

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

  return (
    <>
      <Navbar />

      <div className="kx-page">
        <div className="container">

          {/* Upload bar */}
          <div className="kx-upload-bar">
            <div>
              <h2 className="kx-page-title" style={{ fontSize: "1.25rem" }}>
                <i className="fas fa-images me-2" style={{ color: "var(--accent)" }} />
                Album Photos
              </h2>
              <p className="kx-page-subtitle" style={{ fontSize: "0.82rem" }}>
                {images.length} {images.length === 1 ? "photo" : "photos"}
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

          {/* Modals */}
          <UploadModal albumId={albumId!} refresh={fetchImages} />
          <CommentModal imageId={selected} refresh={fetchImages} />

          {/* Image grid */}
          {images.length === 0 ? (
            <div className="kx-empty">
              <span className="kx-empty-icon">
                <i className="fas fa-photo-video" />
              </span>
              <h3>No photos yet</h3>
              <p>Upload your first photo to this album</p>
            </div>
          ) : (
            <div className="row g-3">
              {images.map((img, i) => (
                <div
                  className="col-6 col-md-4 col-lg-3"
                  key={img._id}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="kx-img-card">
                    <img src={img.url} alt={img.person || "photo"} />

                    <div className="kx-img-body">
                      {/* Tags */}
                      {img.tags?.length > 0 && (
                        <div className="mb-1">
                          {img.tags.map((t) => (
                            <span className="kx-img-tag" key={t}>#{t}</span>
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

                      {/* Actions */}
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
                          Comment
                        </button>
                      </div>
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
