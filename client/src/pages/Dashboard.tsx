import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import API, { setToken, getCurrentUser } from "../services/api";
import Navbar from "../components/Navbar";
import AlbumCard from "../components/AlbumCard";
import CreateAlbumModal from "../components/CreateAlbumModal";
import ShareModal from "../components/ShareModal";
import UpdateAlbumModal from "../components/UpdateAlbumModal";
import type { AlbumType } from "../types";
import { toast } from "../utils/toast";
import Planner from "./Planner";

type FilterTab = "all" | "owned" | "shared";

const Dashboard = () => {
  const navigate = useNavigate();
  const [albums, setAlbums] = useState<AlbumType[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [loading, setLoading] = useState(true);

  const currentUser = getCurrentUser();

  const fetchAlbums = async () => {
    try {
      const res = await API.get("/albums");
      setAlbums(res.data);
    } catch {
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
      .catch(() => {
        if (isMounted) toast.error("Failed to fetch albums");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const deleteAlbum = async (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this album and all its photos?",
      )
    ) {
      try {
        await API.delete(`/albums/${id}`);
        setAlbums((prev) => prev.filter((a) => a._id !== id));
        toast.success("Album deleted");
        fetchAlbums();
      } catch (err: unknown) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const axiosErr = err as any;
        toast.error(
          axiosErr?.response?.data?.msg ||
            axiosErr?.response?.data?.error ||
            "Failed to delete album",
        );
      }
    }
  };

  const counts = useMemo(() => {
    if (!currentUser?.id) {
      return { all: albums.length, owned: albums.length, shared: 0 };
    }
    const owned = albums.filter(
      (a) => !a.ownerId || a.ownerId === currentUser.id,
    ).length;
    const shared = albums.length - owned;
    return { all: albums.length, owned, shared };
  }, [albums, currentUser?.id]);

  const filteredAlbums = useMemo(() => {
    let list = albums;
    if (currentUser?.id) {
      if (activeTab === "owned") {
        list = list.filter((a) => !a.ownerId || a.ownerId === currentUser.id);
      } else if (activeTab === "shared") {
        list = list.filter((a) => a.ownerId && a.ownerId !== currentUser.id);
      }
    }
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          (a.description && a.description.toLowerCase().includes(q)),
      );
    }
    return list;
  }, [albums, activeTab, searchQuery, currentUser?.id]);

  const selectedAlbum = albums.find((a) => a._id === selected) || null;

  return (
    <>
      <Navbar />
      <Planner />
      <div className="kx-page">
        <div className="container">
          {/* Header */}
          <div className="kx-page-header d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div>
              <h1 className="kx-page-title">
                <i
                  className="fas fa-layer-group me-2"
                  style={{ color: "var(--accent)", fontSize: "1.45rem" }}
                />
                Your Workspace
              </h1>
              <p className="kx-page-subtitle">
                Manage, curate, and share your digital photo collections
              </p>
            </div>

            <div className="kx-header-controls d-flex gap-2 align-items-center flex-wrap">
              <div className="kx-header-search-wrap">
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
                type="button"
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

          {/* Workspace Filter Tabs */}
          {albums.length > 0 && (
            <div className="kx-workspace-bar">
              <div className="kx-tab-group" role="tablist" aria-label="Album filter tabs">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "all"}
                  className={`kx-tab-btn ${activeTab === "all" ? "active" : ""}`}
                  onClick={() => setActiveTab("all")}
                >
                  <i className="fas fa-border-all" />
                  <span>All Albums</span>
                  <span className="kx-tab-count">{counts.all}</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "owned"}
                  className={`kx-tab-btn ${activeTab === "owned" ? "active" : ""}`}
                  onClick={() => setActiveTab("owned")}
                >
                  <i className="fas fa-crown" />
                  <span>My Albums</span>
                  <span className="kx-tab-count">{counts.owned}</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "shared"}
                  className={`kx-tab-btn ${activeTab === "shared" ? "active" : ""}`}
                  onClick={() => setActiveTab("shared")}
                >
                  <i className="fas fa-user-friends" />
                  <span>Shared with Me</span>
                  <span className="kx-tab-count">{counts.shared}</span>
                </button>
              </div>

              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Showing {filteredAlbums.length} of {albums.length}{" "}
                {albums.length === 1 ? "album" : "albums"}
              </span>
            </div>
          )}

          {/* Modals */}
          <CreateAlbumModal refresh={fetchAlbums} />
          <ShareModal
            albumId={selected}
            album={selectedAlbum}
            refresh={fetchAlbums}
          />
          <UpdateAlbumModal album={selectedAlbum} refresh={fetchAlbums} />

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
              <p className="mb-4">
                Create your first album to start uploading, tagging, and sharing photos.
              </p>
              <button
                type="button"
                className="kx-create-btn btn"
                data-bs-toggle="modal"
                data-bs-target="#createModal"
              >
                <i className="fas fa-plus me-2" />
                Create Your First Album
              </button>
            </div>
          ) : filteredAlbums.length === 0 ? (
            <div className="kx-empty">
              <span className="kx-empty-icon">
                <i className="fas fa-search" />
              </span>
              <h3>No albums match your filter</h3>
              <p className="mb-3">
                Try adjusting your search query or switching workspace tabs.
              </p>
              <button
                type="button"
                className="kx-btn-cancel"
                onClick={() => {
                  setSearchQuery("");
                  setActiveTab("all");
                }}
              >
                Reset Filters
              </button>
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
                  currentUserId={currentUser?.id}
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
