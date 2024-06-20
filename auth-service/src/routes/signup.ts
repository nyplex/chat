import express, { Request, Response } from "express";
import { Audience, BadRequestError, validateRequest } from "@chat-dev/common";
import { jwtSign } from "../utils/jwt-sign";
import { refreshTokenSign } from "../utils/refresh-token-sign";
import { Auth } from "../models/auth";
import { signupValidationRules } from "../validators/signup-validators";

const router = express.Router();

// protected route with JWT
router.post(
  "/api/auth/signup",
  signupValidationRules,
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await Auth.findOne({ email });
    if (existingUser) {
      throw new BadRequestError("Email in use");
    }

    // Store the data in the database
    const user = Auth.build({
      email,
      password,
      audience: Audience.User,
      refreshToken: null,
    });
    await user.save();

    // Create JWT tokens
    const token = jwtSign(user.id, user.email, Audience.User);
    const refreshToken = refreshTokenSign(user.id, user.email, Audience.User);

    // Store the refresh token in the database
    user.set({ refreshToken });
    await user.save();

    // Set the JWT token in the session and return the refresh token
    req.session = { jwt: token };
    res.status(201).send({ refreshToken });
  }
);

export { router as signupRoute };
