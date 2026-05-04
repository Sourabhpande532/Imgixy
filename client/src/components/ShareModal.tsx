import { useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

interface Props {
  albumId: string;
}

const ShareModal: React.FC<Props> = ({ albumId }) => {
  const [emails, setEmails] = useState("");

  const handleShare = async () => {
    if (!emails.trim()) return toast.error("Enter at least one email");
    const emailList = emails.split(",").map((e) => e.trim());

    await API.post(`/albums/${albumId}/share`, { emails: emailList });

    setEmails("");
    toast.success("Album shared successfully! 🎉");
  };

  return (
    <div className="modal fade" id="shareModal">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="fas fa-share-alt me-2" style={{ color: "var(--info)" }} />
              Share Album
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" />
          </div>

          <div className="modal-body">
            <label className="kx-label">Email Addresses</label>
            <input
              id="share-emails-input"
              className="kx-input"
              placeholder="e.g. friend@gmail.com, family@gmail.com"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
            />
            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
              <i className="fas fa-info-circle me-1" />
              Separate multiple emails with commas
            </p>
          </div>

          <div className="modal-footer gap-2">
            <button className="kx-btn-cancel" data-bs-dismiss="modal">Cancel</button>
            <button id="share-album-submit" className="kx-btn-primary" onClick={handleShare}>
              <i className="fas fa-paper-plane me-1" />
              Send Invite
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;