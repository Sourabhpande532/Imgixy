import { useState } from "react";
import API from "../services/api";

interface Props {
  refresh: () => void;
}

const CreateAlbumModal: React.FC<Props> = ({ refresh }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = async () => {
    if (!name) return alert("Album name required");

    await API.post("/albums", {
      name,
      description,
    });

    setName("");
    setDescription("");
    refresh();
  };

  return (
    <div className='modal fade' id='createModal'>
      <div className='modal-dialog'>
        <div className='modal-content p-3'>
          <h5>Create Album</h5>

          <input
            className='form-control'
            placeholder='Album name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className='form-control mt-2'
            placeholder='Description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button className='btn btn-success mt-3' onClick={handleCreate}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateAlbumModal;
