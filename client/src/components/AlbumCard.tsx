// import { useNavigate } from "react-router-dom";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function AlbumCard({ album }: { album: string }) {
//   const navigate = useNavigate();

  return (
    <div className='col-md-3'>
      <div
        className='card p-3'
        // onClick={() => navigate(`/album/${album._id}`)}
        style={{ cursor: "pointer" }}>
        <h5>{album}</h5>
        {/* <p>{album.description}</p> */}
      </div>
    </div>
  );
}

export default AlbumCard;
