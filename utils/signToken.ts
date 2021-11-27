import jwt from "jsonwebtoken";

export const signToken = (data: any, secret: string = process.env.JWT_SECRET) =>
  jwt.sign(data, secret, { expiresIn: "1d" });
