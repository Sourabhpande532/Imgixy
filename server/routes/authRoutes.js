import dotenv from "dotenv";
dotenv.config();
import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const app = express.Router();

const getCleanFrontendUrl = () => {
  const raw = process.env.FRONTEND_URL || "http://localhost:5173";
  return raw.split(",")[0].trim().replace(/\/+$/, "");
};

app.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

app.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${getCleanFrontendUrl()}/login`,
  }),
  (req, res) => {
    const token = jwt.sign(
      {
        id: req.user._id,
        userId: req.user.userId || String(req.user._id),
        email: req.user.email,
      },
      process.env.JWT_SECRET,
    );
    res.redirect(`${getCleanFrontendUrl()}/?token=${token}`);
  },
);

export default app;
