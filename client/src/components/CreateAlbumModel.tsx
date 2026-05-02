import { useState } from "react";
import API from "../services/api";
import { Modal } from "bootstrap";
import { toast } from "react-toastify";

interface Props {
  refresh: () => void;
}

const CreateAlbumModal: React.FC<Props> = ({ refresh }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = async () => {
    try {
      if (!name) return toast.error("Album name is required");

      await API.post("/albums", { name, description });

      setName("");
      setDescription("");
      refresh();

      toast.success("Album created successfully 🚀");

      const modalEl = document.getElementById("createModal");
      const modal = Modal.getOrCreateInstance(modalEl!);
      modal.hide();

      document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
      document.body.classList.remove("modal-open");
      document.body.style.paddingRight = "";
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    }
  };

  return (
    <div className="modal fade" id="createModal" tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content p-3">
          <h5>Create Album</h5>

          <input
            className="form-control"
            placeholder="Album name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="form-control mt-2"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button className="btn btn-success mt-3" onClick={handleCreate}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateAlbumModal;