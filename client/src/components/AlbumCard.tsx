import { useNavigate } from "react-router-dom";
import type { AlbumType } from "../types";


interface AlbumCartProps {
  album: AlbumType;
}

function AlbumCard({ album }: AlbumCartProps) {
  const navigate = useNavigate();

  return (
    <div className='col-md-3'>
      <div
        className='card p-3'
        onClick={() => navigate(`/album/${album._id}`)}
        style={{ cursor: "pointer" }}>
        <h5>{album.name}</h5>
        <p>{album.description}</p>
      </div>
    </div>
  );
}

export default AlbumCard;
