import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const app = express.Router();
app.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

app.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email },
      process.env.JWT_SECRET,
    );
    res.json({ token });
  },
);
app.get("/g",(req,res)=>{
    res.send('Hellow  auth')
})
export default app;
