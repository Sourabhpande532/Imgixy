import API from "../services/api";
import type { Image } from "../types";

interface ImageCardProps {
  img: Image;
  refresh: () => Promise<void> | void;
}

function ImageCard({ img, refresh }: ImageCardProps) {
  const toggleFavorite = async () => {
    await API.put(`/images/${img._id}/favorite`, {
      isFavorite: !img.isFavorite,
    });
    refresh();
  };

  return (
    <div className='col-md-3'>
      <div className='card p-2'>
        <img src={img.url} className='img-fluid' alt='' />

        <button className='btn btn-warning mt-2' onClick={toggleFavorite}>
          {img.isFavorite ? "Unstar" : "Star"}
        </button>
      </div>
    </div>
  );
}

export default ImageCard;
