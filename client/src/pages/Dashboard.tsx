/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import API from "../services/api";
import AlbumCard from "../components/AlbumCard";

export interface AlbumType {
  _id: string;
  name: string;
  description?: string;
  ownerId: string;
  sharedWidth: string[];
  createdAt: string;
  updatedAt: string;
}

function Dashboard() {
  const [albums, setAlbums] = useState<AlbumType[]>([]);

  const fetchAlbums = async () => {
    try {
      const res = await API.get<AlbumType[]>("/albums");
      setAlbums(res.data);
    } catch (error) {
      console.error("Error Fetching albums:", error);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  return (
    <div className='container mt-4'>
      <h3>Your Albums</h3>
      <div className='row'>
        {albums.map((a) => (
          <AlbumCard key={a._id} album={a} />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
