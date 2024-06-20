import express from "express";
import { Auth } from "../models/auth";
import { Audience, BadRequestError } from "@chat-dev/common";
import { Password } from "../utils/password";
import { jwtSign } from "../utils/jwt-sign";
import { refreshTokenSign } from "../utils/refresh-token-sign";

const router = express.Router();

router.post("/api/auth/signin", async (req, res) => {
  // Check if the email and password are present
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Invalid credentials");
  }

  // Find user by email (you might want to replace this with a database lookup)
  const user = await Auth.findOne({ email });

  // If the user is not found, throw an error
  if (!user) {
    throw new BadRequestError("Invalid credentials");
  }

  const passwordsMatch = await Password.compare(user.password, password);
  if (!passwordsMatch) {
    throw new BadRequestError("Invalid credentials");
  }
  // Create JWT tokens
  const token = jwtSign(user.id, user.email, Audience.User);
  const refreshToken = refreshTokenSign(user.id, user.email, Audience.User);

  // Store the refresh token in the database
  user.set({ refreshToken });
  await user.save();

  // // Return the token as a response
  req.session = { jwt: token };
  res.status(200).send({ refreshToken });
});

export { router as signinRoute };
