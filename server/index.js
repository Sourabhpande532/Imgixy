const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const { default: connectDB } = require("./config/db");
dotenv.config();
connectDB();

app.get("/", (req, res) => {
  res.send("Welcome to expressjs");
});
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server connected at http://localhost:${PORT}`);
});
