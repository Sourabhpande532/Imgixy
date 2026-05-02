/* eslint-disable react-hooks/set-state-in-effect */
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

  useEffect(() => {
    const token = localStorage.getItem("kavioToken");

    if (token) {
      setReady(true);
    }
  }, []);

  const fetchAlbums = async () => {
    try {
      const res = await API.get("/albums");
      setAlbums(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    if (!ready) return;
    fetchAlbums();
  }, [ready]);

  const deleteAlbum = async (id: string) => {
    await API.delete(`/albums/${id}`);
    fetchAlbums();
    toast.success('Deleted successfully!')
  };

  return (
    <>
      <Navbar />
      <div className='container mt-4'>
        <button
          className='btn btn-primary mb-3'
          data-bs-toggle='modal'
          data-bs-target='#createModal'>
          Create AlbumType
        </button>

        <CreateAlbumModal refresh={fetchAlbums} />
        <ShareModal albumId={selected} />
        {!ready && <p>Loading..</p>}
        <div className='row'>
          {albums.map((a) => (
            <div className='col-md-3' key={a._id}>
              <div className='card p-3'>
                <h5>{a.name}</h5>
                <p>{a.description}</p>

                <button
                  className='btn btn-info'
                  onClick={() => (window.location.href = `/album/${a._id}`)}>
                  Open
                </button>

                <button
                  className='btn btn-warning mt-2'
                  data-bs-toggle='modal'
                  data-bs-target='#shareModal'
                  onClick={() => setSelected(a._id)}>
                  Share
                </button>

                <button
                  className='btn btn-danger mt-2'
                  onClick={() => deleteAlbum(a._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
