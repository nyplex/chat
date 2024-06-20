import jwt from "jsonwebtoken";

export const jwtSign = (userID: string, email: string, audience: string) => {
  return jwt.sign({ userId: userID, email: email }, process.env.JWT_KEY!, {
    expiresIn: "30m",
    audience: audience,
    issuer: "auth-service",
  });
};
