import express from "express";
import "express-async-errors";
import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import { json } from "body-parser";
import cookieParser from "cookie-parser";
import {
  NotFoundError,
  configureJwtStrategy,
  errorHandler,
} from "@chat-dev/common";
import { getUserRouter } from "./routes/get-user";
import { putUserRouter } from "./routes/put-user";
import { getUsersRouter } from "./routes/get-users";

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

app.use(getUsersRouter);
app.use(getUserRouter);
app.use(putUserRouter);


app.all("*", async (req, res, next) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
