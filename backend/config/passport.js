import "dotenv/config";

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        let user = await User.findOne({
          $or: [
            { googleId: profile.id },
            { email: email }
          ]
        });

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email: email,
            password: `GoogleAuth_${Date.now()}`,
            googleId: profile.id,
            authProvider: "google",
            role: "user",
          });
        } else {
          if (!user.googleId) {
            user.googleId = profile.id;
            user.authProvider = "google";
            await user.save();
          }
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;