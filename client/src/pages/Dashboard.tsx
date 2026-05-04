import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import CreateAlbumModal from "../components/CreateAlbumModel";
import ShareModal from "../components/ShareModal";
import type { AlbumType } from "../types";
import { toast } from "react-toastify";
const Dashboard = () => {
  const [albums, setAlbums] = useState<AlbumType[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("kavioToken");
    if (token) {
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
      <div className='dashboard-container'>
        <div className='container'>
          <div className='dashboard-header d-md-flex align-items-center justify-content-between'>
            <div>
              <h1 className='dashboard-title'>Your Workspace</h1>
              <p className='dashboard-subtitle'>
                Manage and organize your digital collections
              </p>
            </div>
            <button
              className='btn create-btn text-white'
              data-bs-toggle='modal'
              data-bs-target='#createModal'>
              <i className='fas fa-plus me-2'></i>
              Create New Album
            </button>
          </div>

          <CreateAlbumModal refresh={fetchAlbums} />
          <ShareModal albumId={selected} />

          {loading ? (
            <div className='text-center py-5'>
              <div className='spinner-border text-primary' role='status'>
                <span className='visually-hidden'>Loading...</span>
              </div>
            </div>
          ) : albums.length === 0 ? (
            <div className='text-center py-5'>
              <div className='mb-4'>
                <i className='fas fa-folder-open fa-4x text-muted opacity-25'></i>
              </div>
              <h3>No albums found</h3>
              <p className='text-muted'>
                Start by creating your first photo album.
              </p>
            </div>
          ) : (
            <div className='row g-4'>
              {albums.map((a) => (
                <div className='col-12 col-sm-6 col-md-4 col-lg-3' key={a._id}>
                  <div className='album-card'>
                    <div className='album-thumbnail'>
                      <i className='fas fa-folder'></i>
                    </div>
                    <div className='album-card-body'>
                      <h5 className='album-name'>{a.name}</h5>
                      <p className='album-description'>
                        {a.description || "No description provided."}
                      </p>

                      <div className='album-actions'>
                        <button
                          className='btn action-btn btn-open'
                          onClick={() =>
                            (window.location.href = `/album/${a._id}`)
                          }>
                          <i className='fas fa-external-link-alt'></i>
                          Open Album
                        </button>

                        <div className='d-flex gap-2'>
                          <button
                            className='btn action-btn btn-share flex-grow-1'
                            data-bs-toggle='modal'
                            data-bs-target='#shareModal'
                            onClick={() => setSelected(a._id)}>
                            <i className='fas fa-share-alt'></i>
                            Share
                          </button>

                          <button
                            className='btn action-btn btn-delete'
                            onClick={() => deleteAlbum(a._id)}
                            title='Delete Album'>
                            <i className='fas fa-trash-alt'></i>
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
