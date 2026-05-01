import { useState } from "react";
import API from "../services/api";

interface Props {
  imageId: string;
  refresh: () => void;
}

const CommentModal: React.FC<Props> = ({ imageId, refresh }) => {
  const [comment, setComment] = useState("");

  const handleComment = async () => {
    if (!comment) return;

    await API.post(`/images/${imageId}/comment`, {
      comment,
    });

    setComment("");
    refresh();
  };

  return (
    <div className='modal fade' id='commentModal'>
      <div className='modal-dialog'>
        <div className='modal-content p-3'>
          <h5>Add Comment</h5>

          <input
            className='form-control'
            placeholder='Write comment'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button className='btn btn-primary mt-3' onClick={handleComment}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
