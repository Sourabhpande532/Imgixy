import { useState, type ChangeEvent } from "react";
import API from "../services/api";

interface UploadModalProps {
  albumId: string | undefined;
  refresh: () => Promise<void> | void;
}

function UploadModal({ albumId, refresh }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [tags, setTags] = useState<string>("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !albumId) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("tags", tags);
    await API.post(`/images/${albumId}`, formData);
    refresh();
  };

  return (
    <div className='modal fade' id='uploadModal'>
      <div className='modal-dialog'>
        <div className='modal-content p-3'>
          <h5>Upload Image</h5>

          <input type='file' onChange={handleFileChange} />

          <input
            className='form-control mt-2'
            placeholder='tags (comma separated)'
            onChange={(e) => setTags(e.target.value)}
          />

          <button className='btn btn-success mt-3' onClick={handleUpload}>
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadModal;
