import express from "express";
import "express-async-errors";
import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import { json } from "body-parser";
import { signupRoute } from "./routes/signup";
import { signinRoute } from "./routes/signin";
import { currentUserRoute } from "./routes/current-user";
import cookieParser from "cookie-parser";
import { getRefreshToken } from "./routes/refresh-token";
import {
  NotFoundError,
  configureJwtStrategy,
  errorHandler,
} from "@chat-dev/common";
import { signoutRouter } from "./routes/signout";
import { updateUserRouter } from "./routes/update-user";

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

configureJwtStrategy(app, { secretOrKey: process.env.JWT_KEY! });

app.use(signupRoute);
app.use(signinRoute);
app.use(currentUserRoute);
app.use(getRefreshToken);
app.use(signoutRouter);
app.use(updateUserRouter);

app.all("*", async (req, res, next) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
