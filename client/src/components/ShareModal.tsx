import { useState } from "react";
import API from "../services/api";

interface Props {
  albumId: string;
}

const ShareModal: React.FC<Props> = ({ albumId }) => {
  const [emails, setEmails] = useState("");

  const handleShare = async () => {
    const emailList = emails.split(",").map((e) => e.trim());

    await API.post(`/albums/${albumId}/share`, {
      emails: emailList,
    });

    setEmails("");
    alert("Album shared!");
  };

  return (
    <div className="modal fade" id="shareModal">
      <div className="modal-dialog">
        <div className="modal-content p-3">
          <h5>Share Album</h5>

          <input
            className="form-control"
            placeholder="Enter emails (comma separated)"
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
          />

          <button className="btn btn-primary mt-3" onClick={handleShare}>
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;