import { routeProtected } from "@chat-dev/common";
import express, { Request, Response } from "express";
import { Users } from "../models/users";

const router = express.Router();

router.get(
  "/api/users",
  routeProtected(),
  async (req: Request, res: Response) => {
    // Find all users except the current user
    const users = await Users.find({
      _id: { $ne: req.currentUser!.id },
    }).select("-email");

    res.status(200).send(users);
  }
);

export { router as getUsersRouter };
