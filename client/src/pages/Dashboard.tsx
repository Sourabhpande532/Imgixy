import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { setToken } from "../services/api";
import Navbar from "../components/Navbar";
import AlbumCard from "../components/AlbumCard";
import CreateAlbumModal from "../components/CreateAlbumModel";
import ShareModal from "../components/ShareModal";
import UpdateAlbumModal from "../components/UpdateAlbumModal";
import type { AlbumType } from "../types";
import { toast } from "react-toastify";
import Planner from "./Planner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [albums, setAlbums] = useState<AlbumType[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchAlbums = async () => {
    try {
      const res = await API.get("/albums");
      setAlbums(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch albums");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("kavioToken");
    if (!token) {
      navigate("/login");
      return;
    }
    setToken(token);

    let isMounted = true;
    API.get("/albums")
      .then((res) => {
        if (isMounted) setAlbums(res.data);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to fetch albums");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [navigate]);



  const deleteAlbum = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this album?")) {
      try {
        await API.delete(`/albums/${id}`);
        fetchAlbums();
        toast.success("Album deleted successfully!");
      } catch {
        toast.error("Failed to delete album");
      }
    }
  };

  const filteredAlbums = albums.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <Planner />
      <div className="kx-page">
        <div className="container">
          {/* Header */}
          <div className="kx-page-header d-flex align-items-start align-items-md-center justify-content-between flex-column flex-md-row gap-3">
            <div>
              <h1 className="kx-page-title">
                <i
                  className="fas fa-layer-group me-2"
                  style={{ color: "var(--accent)", fontSize: "1.5rem" }}
                />
                Your Workspace
              </h1>
              <p className="kx-page-subtitle">
                Manage and organize your digital collections
              </p>
            </div>

            <div className="d-flex gap-3 align-items-center w-100 w-md-auto">
              <div className="position-relative flex-grow-1">
                <input
                  type="text"
                  className="kx-input"
                  placeholder="Search albums..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search albums"
                />
              </div>
              <button
                id="create-album-btn"
                className="kx-create-btn btn text-nowrap"
                data-bs-toggle="modal"
                data-bs-target="#createModal"
              >
                <i className="fas fa-plus me-2" />
                New Album
              </button>
            </div>
          </div>

          {/* Modals */}
          <CreateAlbumModal refresh={fetchAlbums} />
          <ShareModal albumId={selected} />
          <UpdateAlbumModal
            album={albums.find((a) => a._id === selected) || null}
            refresh={fetchAlbums}
          />

          {/* Content */}
          {loading ? (
            <div className="kx-spinner-wrap">
              <div className="kx-spinner" />
            </div>
          ) : albums.length === 0 ? (
            <div className="kx-empty">
              <span className="kx-empty-icon">
                <i className="fas fa-folder-open" />
              </span>
              <h3>No albums yet</h3>
              <p>Create your first album to get started</p>
            </div>
          ) : filteredAlbums.length === 0 ? (
            <div className="kx-empty">
              <span className="kx-empty-icon">
                <i className="fas fa-search" />
              </span>
              <h3>No albums match your search</h3>
              <p>Try searching for another album name</p>
            </div>
          ) : (
            <div className="row g-4">
              {filteredAlbums.map((a, i) => (
                <AlbumCard
                  key={a._id}
                  album={a}
                  onSelect={setSelected}
                  onDelete={deleteAlbum}
                  animationIndex={i}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
