import express from "express";
import "express-async-errors";
import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import { json } from "body-parser";
import { signupRoute } from "./routes/signup";
import { signinRoute } from "./routes/signin";
import passport from "passport";
import { currentUserRoute } from "./routes/current-user";
import cookieParser from "cookie-parser";
import { getRefreshToken } from "./routes/refresh-token";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import {
  NotFoundError,
  configureJwtStrategy,
  errorHandler,
} from "@chat-dev/common";
import { signoutRouter } from "./routes/signout";

const app = express();

app.set("trust proxy", true);
app.use(json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

configureJwtStrategy(
  app,
  { secretOrKey: process.env.JWT_KEY! },
  "auth-service"
);

// Configure Google Strategy (replace placeholders with your details)
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/api/auth/google/callback", // Update with your API endpoint
      scope: ["email", "profile"],
    },
    (accessToken, refreshToken, profile, done) => {
      // Implement logic to find or create user based on profile data (e.g., profile.id)
      // let's keep it simple and return the profile data for now
      return done(null, profile);
    }
  )
);

app.use(signupRoute);
app.use(signinRoute);
app.use(currentUserRoute);
app.use(getRefreshToken);
app.use(signoutRouter);

app.all("*", async (req, res, next) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
