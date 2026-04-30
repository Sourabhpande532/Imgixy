/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import API from "../services/api";
import AlbumCard from "../components/AlbumCard";


function Dashboard() {
  const [albums, setAlbums] = useState([]);

  const fetchAlbums = async () => {
    const res = await API.get("/albums");
    setAlbums(res.data);
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  return (
    <div className="container mt-4">
      <h3>Your Albums</h3>
      <div className="row">
        {albums.map((a) => (
          <AlbumCard key={a} album={a} />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;