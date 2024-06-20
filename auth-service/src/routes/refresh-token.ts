import { Audience, UnauthorizedError, routeProtected } from "@chat-dev/common";
import express from "express";
import { Auth } from "../models/auth";
import { jwtSign } from "../utils/jwt-sign";
import { refreshTokenSign } from "../utils/refresh-token-sign";
import { Password } from "../utils/password";
import { refreshTokenValidationRules } from "../validators/refresh-token-validators";

const router = express.Router();

router.post(
  "/api/auth/refresh-token",
  routeProtected(),
  refreshTokenValidationRules,
  async (req, res) => {
    // Check if the payload and refresh token are present
    const { payload, refreshToken } = req.body;
    if (!payload || !refreshToken) {
      throw new UnauthorizedError();
    }

    // Find the user by email
    const user = await Auth.findOne({
      email: payload.email,
    });

    // Check if the user and refresh token are present
    if (!user || !user.refreshToken) {
      throw new UnauthorizedError();
    }

    // Decrypt the refresh token and compare it with the stored refresh token
    const decryptedRefreshToken = await Password.compare(
      user?.refreshToken,
      refreshToken
    );

    // If the refresh token is invalid, throw an error
    if (!decryptedRefreshToken) {
      throw new UnauthorizedError();
    }

    // Generate new JWT and refresh tokens
    const newToken = jwtSign(user.id, user.email, Audience.User);
    const newRefreshToken = refreshTokenSign(
      user.id,
      user.email,
      Audience.User
    );

    // Store the new refresh token in the database
    user.set({ refreshToken: newRefreshToken });
    await user.save();

    // Set the new JWT token in the session and return the new refresh token
    req.session = { jwt: newToken };
    res.status(200).send({ refreshToken: newRefreshToken });
  }
);

export { router as getRefreshToken };
