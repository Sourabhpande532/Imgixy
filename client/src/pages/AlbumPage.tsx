/* eslint-disable react-hooks/set-state-in-effect */
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import ImageCard from "../components/ImageCard";
import UploadModal from "../components/UploadModal";

export interface ImageType {
  _id: string;
  url: string;
  isFavorite: boolean;
  tags?: string[];
}

function AlbumPage() {
  const { id } = useParams<{ id: string }>();
  const [images, setImages] = useState<ImageType[]>([]);

  const fetchImages = async () => {
    if (!id) return;
    const res = await API.get<ImageType[]>(`/images/${id}`);
    setImages(res.data);
  };

  useEffect(() => {
    fetchImages();
  }, [id]);

  return (
    <div className='container mt-4'>
      <h3>Images</h3>

      <button
        className='btn btn-primary mb-3'
        data-bs-toggle='modal'
        data-bs-target='#uploadModal'>
        Upload Image
      </button>

      <UploadModal albumId={id} refresh={fetchImages} />

      <div className='row'>
        {images.map((img) => (
          <ImageCard key={img._id} img={img} refresh={fetchImages} />
        ))}
      </div>
    </div>
  );
}

export default AlbumPage;
