import jwt from "jsonwebtoken";

export const refreshTokenSign = (
  userID: string,
  email: string,
  audience: string
) => {
  return jwt.sign(
    {
      userId: userID,
      email: email,
    },
    process.env.JWT_REFRESH_KEY!,
    { expiresIn: "7d", audience: audience, issuer: "auth-service" }
  );
};
