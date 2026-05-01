import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (_, __, profile, done) => {
      console.log(profile);
      // Google sends user info to backend then backend create jwt 
      const email = profile.emails[0].value;
      let user = await User.findOne({ email });
      if (!user) user = await User.create({ email });
      return done(null, user);
    },
  ),
);


/* NOTE:
In traditional authentication, we use a POST request to send credentials. However, in Google OAuth, authentication is handled by Google, and the backend receives user information via a callback. Therefore, we initiate the flow with a GET request and generate a JWT after 
successful authentication 

GET → starts OAuth flow
Google → handles login
Backend → creates JWT
Redirect → sends token

*/