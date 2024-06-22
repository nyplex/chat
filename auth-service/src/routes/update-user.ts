import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Auth } from "../models/auth";
import { routeProtected, validateRequest } from "@chat-dev/common";
import { BadRequestError } from "@chat-dev/common";
import { updateUserValidationRules } from "../validators/update-user-validators";
import { AuthUpdatedPublisher } from "../events/publisher/auth-updated-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.put(
  "/api/auth/update",
  routeProtected(),
  updateUserValidationRules,
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = req.currentUser;
    if (!user) {
      throw new BadRequestError("User not found");
    }
    const auth = await Auth.findById(user.id);
    if (!auth) {
      throw new BadRequestError("Auth not found");
    }

    if (email && email !== auth.email) {
      // check if email is already in use
      const existingUser = await Auth.findOne({ email });
      if (existingUser) {
        throw new BadRequestError("Email already in use");
      }
    }

    auth.set({
      email: email || auth.email,
      password: password || auth.password,
    });

    await auth.save();
    new AuthUpdatedPublisher(natsWrapper.client).publish({
      email: auth.email,
      userID: auth.id,
      version: auth.version,
    });

    res.status(200).send(auth);
  }
);

export { router as updateUserRouter };
