import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  console.log("Starting up...");
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.JWT_REFRESH_KEY) {
    throw new Error("REFRESH_TOKEN_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error("GOOGLE_CLIENT_ID must be defined");
  }
  if (!process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("GOOGLE_CLIENT_SECRET must be defined");
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Auth Service Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
  app.listen(3000, () => {
    console.log("Auth Service Listening on port 3000...");
  });
};

start();
