import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    sharedWith: { type: [String], default: [], index: true },
  },
  { timestamps: true },
);

export default mongoose.model("Album", schema);
