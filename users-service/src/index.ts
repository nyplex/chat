import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { AuthCreatedListener } from "./events/listeners/auth-created-listener";
import { AuthUpdatedListener } from "./events/listeners/auth-updated-listener";

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
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined");
  }
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    new AuthCreatedListener(natsWrapper.client).listen();
    new AuthUpdatedListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Auth Service Connected to MongoDB!!!");
  } catch (error) {
    console.error(error);
  }
  app.listen(3000, () => {
    console.log("Auth Service Listening on port 3000...");
  });
};

start();