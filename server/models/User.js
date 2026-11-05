import mongoose from "mongoose";
import crypto from "crypto";

const schema = new mongoose.Schema({
  userId: {
    type: String,
    default: () => crypto.randomUUID(),
    index: true,
  },
  email: { type: String, required: true, unique: true, trim: true },
});

export default mongoose.model("User", schema);
