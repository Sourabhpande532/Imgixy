import { useEffect, useState } from "react";
import API, { setToken } from "../services/api";
import Navbar from "../components/Navbar";
import CreateAlbumModal from "../components/CreateAlbumModel";
import ShareModal from "../components/ShareModal";
import type { AlbumType } from "../types";
import { toast } from "react-toastify";
import Planner from "./Planner";

const Dashboard = () => {
  const [albums, setAlbums] = useState<AlbumType[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("kavioToken");
    if (token) {
      setToken(token);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReady(true);
    } else {
      window.location.href = "/";
    }
  }, []);

  const fetchAlbums = async () => {
    try {
      setLoading(true);
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
    if (!ready) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAlbums();
  }, [ready]);

  const deleteAlbum = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this album?")) {
      try {
        await API.delete(`/albums/${id}`);
        fetchAlbums();
        toast.success("Album deleted successfully!");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        toast.error("Failed to delete album");
      }
    }
  };

  return (
    <>
      <Navbar />
       <Planner/>
      <div className='kx-page'>
        <div className='container'>
          {/* Header */}
          <div className='kx-page-header d-flex align-items-start align-items-md-center justify-content-between flex-column flex-md-row gap-3'>
            <div>
              <h1 className='kx-page-title'>
                <i
                  className='fas fa-layer-group me-2'
                  style={{ color: "var(--accent)", fontSize: "1.5rem" }}
                />
                Your Workspace
              </h1>
              <p className='kx-page-subtitle'>
                Manage and organize your digital collections
              </p>
            </div>

            <button
              id='create-album-btn'
              className='kx-create-btn btn'
              data-bs-toggle='modal'
              data-bs-target='#createModal'>
              <i className='fas fa-plus me-2' />
              New Album
            </button>
          </div>

          {/* Modals */}
          <CreateAlbumModal refresh={fetchAlbums} />
          <ShareModal albumId={selected} />

          {/* Content */}
          {loading ? (
            <div className='kx-spinner-wrap'>
              <div className='kx-spinner' />
            </div>
          ) : albums.length === 0 ? (
            <div className='kx-empty'>
              <span className='kx-empty-icon'>
                <i className='fas fa-folder-open' />
              </span>
              <h3>No albums yet</h3>
              <p>Create your first album to get started</p>
            </div>
          ) : (
            <div className='row g-4'>
              {albums.map((a, i) => (
                <div
                  className='col-12 col-sm-6 col-md-4 col-lg-3'
                  key={a._id}
                  style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className='kx-album-card'>
                    <div className='kx-album-thumb'>
                      <i
                        className='fas fa-folder'
                        style={{
                          color: "#a855f7",
                          position: "relative",
                          zIndex: 1,
                        }}
                      />
                    </div>

                    <div className='kx-album-body'>
                      <h5 className='kx-album-name'>{a.name}</h5>
                      <p className='kx-album-desc'>
                        {a.description || "No description provided."}
                      </p>

                      <div className='kx-album-actions'>
                        <button
                          id={`open-album-${a._id}`}
                          className='kx-btn-open'
                          onClick={() =>
                            (window.location.href = `/album/${a._id}`)
                          }>
                          <i className='fas fa-external-link-alt' />
                          Open Album
                        </button>

                        <div className='d-flex gap-2'>
                          <button
                            id={`share-album-${a._id}`}
                            className='kx-btn-share'
                            data-bs-toggle='modal'
                            data-bs-target='#shareModal'
                            onClick={() => setSelected(a._id)}>
                            <i className='fas fa-share-alt me-1' />
                            Share
                          </button>

                          <button
                            id={`delete-album-${a._id}`}
                            className='kx-btn-del'
                            onClick={() => deleteAlbum(a._id)}
                            title='Delete Album'>
                            <i className='fas fa-trash-alt' />
                          </button>
                        </div>
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

export default Dashboard;
