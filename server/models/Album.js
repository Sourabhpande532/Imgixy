import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    sharedWith: [String],
  },
  { timestamps: true },
);

export default mongoose.model("Album", schema);
