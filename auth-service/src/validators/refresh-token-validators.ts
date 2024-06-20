import { UnauthorizedError } from "@chat-dev/common";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const refreshTokenValidationRules = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    throw new UnauthorizedError();
  }

  let payload = null;
  try {
    payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY!);
  } catch (error) {
    throw new UnauthorizedError();
  }

  if (!payload) {
    throw new UnauthorizedError();
  }

  if (typeof payload === "string") {
    throw new UnauthorizedError();
  }

  if (!payload.exp || payload.exp < Date.now() / 1000) {
    throw new UnauthorizedError();
  }

  if (!payload.iss || payload.iss !== "auth-service") {
    throw new UnauthorizedError();
  }

  if (!payload.userId || !payload.email) {
    throw new UnauthorizedError();
  }

  req.body.payload = payload;
  req.body.refreshToken = refreshToken;
  next();
};
