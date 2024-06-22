import { UnauthorizedError, routeProtected } from "@chat-dev/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { updateUserValidationRules } from "../validators/update-user-validators";
import { Users } from "../models/users";

const router = express.Router();

router.put(
  "/api/users",
  routeProtected(),
  updateUserValidationRules,
  async (req: Request, res: Response) => {
    const { username } = req.body;
    const user = await Users.findById(req.currentUser!.id);
    if (!user) {
      throw new UnauthorizedError();
    }

    user.set({
      username: username || user.username,
    });

    await user.save();

    res.status(200).send(user);
  }
);

export { router as putUserRouter };
