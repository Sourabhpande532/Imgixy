const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  albumId: { type: mongoose.Schema.Types.ObjectId, ref: "Album" },
  name: String,
  url: String,
  public_id: String,
  tags: [String],
  person: String,
  isFavorite: { type: Boolean, default: false },
  comments: [String],
  size: Number,
  uploadedAT: { type: Date, default: Date.now },
});

export default mongoose.model("Image", schema);
