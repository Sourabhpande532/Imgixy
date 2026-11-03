import mongoose from "mongoose";

const schema = new mongoose.Schema({
  albumId: { type: mongoose.Schema.Types.ObjectId, ref: "Album", index: true },
  name: String,
  url: String,
  public_id: String,
  tags: [String],
  person: String,
  isFavorite: { type: Boolean, default: false },
  comments: [String],
  size: Number,
  uploadedAt: { type: Date, default: Date.now },
  uploadedAT: { type: Date, default: Date.now },
});

export default mongoose.model("Image", schema);
