import { useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

interface Props {
  imageId: string;
  refresh: () => void;
}

const CommentModal: React.FC<Props> = ({ imageId, refresh }) => {
  const [comment, setComment] = useState("");

  const handleComment = async () => {
    if (!comment) return;

    await API.post(`/images/${imageId}/comment`, { comment });

    // Directly close modal via DOM — reliable across every re-open
    const modalEl = document.getElementById("commentModal");
    if (modalEl) {
      modalEl.classList.remove("show");
      modalEl.style.display = "none";
      modalEl.removeAttribute("aria-modal");
      modalEl.setAttribute("aria-hidden", "true");
    }
    document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
    document.body.classList.remove("modal-open");
    document.body.style.removeProperty("overflow");
    document.body.style.removeProperty("padding-right");

    setComment("");
    refresh();
    toast.success("Comment added!");
  };

  return (
    <div className="modal fade" id="commentModal">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="far fa-comment-dots me-2" style={{ color: "var(--info)" }} />
              Add Comment
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" />
          </div>

          <div className="modal-body">
            <label className="kx-label">Your Comment</label>
            <input
              id="comment-input"
              className="kx-input"
              placeholder="Write something about this photo..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleComment()}
            />
          </div>

          <div className="modal-footer gap-2">
            <button className="kx-btn-cancel" data-bs-dismiss="modal">Cancel</button>
            <button id="comment-submit" className="kx-btn-primary" onClick={handleComment}>
              <i className="fas fa-check me-1" />
              Add Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
