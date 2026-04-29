import passport, { use } from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (_, __, profile, done) => {
      console.log(profile);
      const email = profile.emails[0].value;
      let user = await User.findOne({ email });
      if (!user) user = await User.create({ email });
      return done(null, user);
    },
  ),
);
