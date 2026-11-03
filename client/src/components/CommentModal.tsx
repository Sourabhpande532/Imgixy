import { useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import { closeModal } from "../utils/modal";

interface Props {
  imageId: string;
  refresh: () => void;
}

const CommentModal: React.FC<Props> = ({ imageId, refresh }) => {
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleComment = async () => {
    const trimmed = comment.trim();
    if (!trimmed) {
      toast.error("Please write a comment before submitting");
      return;
    }

    try {
      setSubmitting(true);
      await API.post(`/images/${imageId}/comment`, { comment: trimmed });

      closeModal("commentModal");
      setComment("");
      refresh();
      toast.success("Comment added");
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const axiosErr = err as any;
      const msg =
        axiosErr?.response?.data?.error ||
        axiosErr?.response?.data?.msg ||
        "Failed to post comment";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal fade" id="commentModal" tabIndex={-1} aria-labelledby="commentModalTitle" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="commentModalTitle">
              <i className="far fa-comment-dots me-2" style={{ color: "var(--info)" }} />
              Add Comment
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
          </div>

          <div className="modal-body">
            <label htmlFor="comment-input" className="kx-label">
              Your Comment
            </label>
            <input
              id="comment-input"
              className="kx-input"
              placeholder="Write something about this photo..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !submitting && handleComment()}
            />
          </div>

          <div className="modal-footer gap-2">
            <button type="button" className="kx-btn-cancel" data-bs-dismiss="modal">
              Cancel
            </button>
            <button
              type="button"
              id="comment-submit"
              className="kx-btn-primary"
              onClick={handleComment}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                  Posting...
                </>
              ) : (
                <>
                  <i className="fas fa-check me-1" />
                  Add Comment
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
