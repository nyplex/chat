import { routeProtected } from "@chat-dev/common";
import express, { Request, Response } from "express";
import { Users } from "../models/users";

const router = express.Router();

router.get(
  "/api/users/:id",
  routeProtected(),
  async (req: Request, res: Response) => {
    const user = await Users.findById(req.params.id).select("-email");
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send(user);
  }
);

export { router as getUserRouter };
