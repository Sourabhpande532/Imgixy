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

      <div className='container mt-4'>
        <button
          className='btn btn-primary'
          data-bs-toggle='modal'
          data-bs-target='#uploadModal'>
          Upload
        </button>

        <UploadModal albumId={albumId!} refresh={fetchImages} />
        <CommentModal imageId={selected} refresh={fetchImages} />

        <div className='row mt-3'>
          {images.map((img) => (
            <div className='col-md-3' key={img._id}>
              <div className='card p-2'>
                <img src={img.url} className='img-fluid' />

                <p>
                  <b>Tags:</b> {img.tags.join(", ")}
                </p>
                <p>
                  <b>Person:</b> {img.person}
                </p>

                <button
                  className='btn btn-warning'
                  onClick={() => toggleFav(img)}>
                  {img.isFavorite ? "Unstar" : "Star"}
                </button>

                <button
                  className='btn btn-info mt-2'
                  data-bs-toggle='modal'
                  data-bs-target='#commentModal'
                  onClick={() => setSelected(img._id)}>
                  Comment
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AlbumPage;
