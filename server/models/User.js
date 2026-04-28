const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
});

export default mongoose.model("User", schema);
