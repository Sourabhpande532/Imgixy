import dns from "dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
import morgan from "morgan";
import connectDB from "./config/db.js";

dotenv.config();

// Initialize DB
connectDB();

import "./config/passport.js";
import authRoutes from "./routes/authRoutes.js";
import albumRoutes from "./routes/albumRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
import sdkRoutes from "./routes/sdkRoutes.js";

const getAllowedOrigins = () => {
  const raw = process.env.FRONTEND_URL || "";
  const configured = raw
    .split(",")
    .map((u) => u.trim().replace(/\/+$/, ""))
    .filter(Boolean);

  const expanded = new Set(configured);
  for (const url of configured) {
    if (url.startsWith("https://www.")) {
      expanded.add(url.replace("https://www.", "https://"));
    } else if (url.startsWith("https://")) {
      expanded.add(url.replace("https://", "https://www."));
    }
  }
  expanded.add("http://localhost:5173");
  expanded.add("http://127.0.0.1:5173");
  expanded.add("http://localhost:4173");
  return expanded;
};

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const cleanOrigin = origin.replace(/\/+$/, "");
      const allowed = getAllowedOrigins();
      if (allowed.has(cleanOrigin)) {
        return callback(null, cleanOrigin);
      }
      return callback(null, false);
    },
    credentials: true,
  }),
);
app.use(passport.initialize());
app.use(morgan("dev"));

app.use("/auth", authRoutes);
app.use("/albums", albumRoutes);
app.use("/images", imageRoutes);
app.use("/ai/chat", sdkRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to expressjs");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server connected at http://localhost:${PORT}`);
});
