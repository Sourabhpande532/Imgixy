import dns from "dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
import connectDB from "./config/db.js";

dotenv.config();

// 2. Initialize DB
connectDB();

import "./config/passport.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(passport.initialize());

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to expressjs");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server connected at http://localhost:${PORT}`);
});
