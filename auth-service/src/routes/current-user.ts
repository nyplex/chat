// protectedRoute.js

import { Audience, routeProtected } from "@chat-dev/common";
import express, { Request, Response } from "express";
import { Auth } from "../models/auth";

const router = express.Router();

// Protected route example
router.get(
  "/api/auth/currentuser",
  routeProtected(Audience.User),
  async (req, res) => {
    const user = req.currentUser;
    const currentUser = await Auth.findOne({ email: user?.email });

    res.send({ currentUser });
  }
);

export { router as currentUserRoute };
