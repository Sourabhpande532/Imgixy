import dotenv from "dotenv";
dotenv.config();
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

    res.redirect(`http://localhost:5173/?token=${token}`);
  },
);

export default app;

/*UNDERSTANDING:
 Step-by-step:
 1. Frontend calls:
 http://localhost:5000/auth/google
 2. Google login happens
 3. Backend hits 
 http://localhost:5000/auth/google/callback
 4. JWT CREATED + token 
 5. Backend redirect 
 http://localhost:3000/?token=xyz
 6. Frontend reads token:
 const token = new URLSearchParams(window.location.search).get("token") 
 7. Token stored user logged -in 

```
 /auth/google → “Go to Google and login”
/callback → “Google came back with user info”
JWT → “Your entry pass”
redirect → “Send user back to frontend with pass”
```
*/
