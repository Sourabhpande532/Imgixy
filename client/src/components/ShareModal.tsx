import { useState } from "react";
import API from "../services/api";
import { toast } from "../utils/toast";
import { closeModal } from "../utils/modal";
import type { AlbumType } from "../types";

interface Props {
  albumId: string;
  album?: AlbumType | null;
  refresh?: () => void;
}

const ShareModal: React.FC<Props> = ({ albumId, album, refresh }) => {
  const [emails, setEmails] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleShare = async () => {
    if (!emails.trim()) {
      toast.error("Please enter at least one email address");
      return;
    }
    const emailList = emails
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const hasInvalid = emailList.some((e) => !e.includes("@") || !emailRegex.test(e));
    if (hasInvalid) {
      toast.error("Please enter valid email addresses (e.g. friend@example.com)");
      return;
    }

    try {
      setSubmitting(true);
      await API.post(`/albums/${albumId}/share`, { emails: emailList });

      closeModal("shareModal");
      setEmails("");
      refresh?.();
      toast.success("Album shared successfully");
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const axiosErr = err as any;
      const msg =
        axiosErr?.response?.data?.msg ||
        axiosErr?.response?.data?.error ||
        "Failed to share album";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const sharedList = album?.sharedWith || [];

  return (
    <div className="modal fade" id="shareModal" tabIndex={-1} aria-labelledby="shareModalTitle" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="shareModalTitle">
              <i className="fas fa-share-alt me-2" style={{ color: "var(--info)" }} />
              Share Album {album?.name ? `— ${album.name}` : ""}
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
          </div>

          <div className="modal-body d-flex flex-column gap-3">
            <div>
              <label htmlFor="share-emails-input" className="kx-label">
                Collaborator Email Addresses
              </label>
              <input
                id="share-emails-input"
                className="kx-input"
                placeholder="e.g. friend@gmail.com, colleague@gmail.com"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !submitting && handleShare()}
              />
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.45rem" }}>
                <i className="fas fa-info-circle me-1" />
                Separate multiple emails with commas. Shared users receive view-only access.
              </p>
            </div>

            {sharedList.length > 0 && (
              <div>
                <span className="kx-label">Currently Shared With ({sharedList.length})</span>
                <div className="d-flex flex-wrap gap-1 mt-1">
                  {sharedList.map((email) => (
                    <span
                      key={email}
                      style={{
                        background: "var(--surface-subtle)",
                        border: "1px solid var(--glass-border)",
                        color: "var(--text)",
                        borderRadius: "99px",
                        padding: "0.22rem 0.65rem",
                        fontSize: "0.76rem",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.35rem",
                      }}
                    >
                      <i className="fas fa-envelope" style={{ color: "var(--accent)", fontSize: "0.7rem" }} />
                      {email}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer gap-2">
            <button type="button" className="kx-btn-cancel" data-bs-dismiss="modal">
              Cancel
            </button>
            <button
              type="button"
              id="share-album-submit"
              className="kx-btn-primary"
              onClick={handleShare}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                  Sharing...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane me-1" />
                  Send Invite
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
