import { NextFunction, Request, response, Response } from "express";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { COOKIE_NAME } from "./constants.js";
import { signedCookies } from "cookie-parser";
import { error } from "console";
export const createToken = (
  id: string,
  email: string,
  expiresIn: string
) => {
  const payload = { id, email };
  const secret: Secret = process.env.JWT_SECRET!;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  const options: SignOptions = {
    expiresIn: expiresIn as `${number}${"ms" | "s" | "m" | "h" | "d" | "w" | "y"}`
  };

  const token = jwt.sign(payload, secret, options);
  return token;
};
export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1. Get the token from signed cookies
  const token = req.signedCookies[`${COOKIE_NAME}`];

  if (!token || token.trim() === "") {
    // If no token, send a clear error
    return res.status(401).json({ message: "Token not received" });
  }

  // 2. Verify the token in a try...catch block
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    // 3. If verification is successful, store user data and proceed
    res.locals.jwtData = decoded;
    return next();
  } catch (err) {
    // 4. If verification fails (expired, invalid), send an error
    console.error("TOKEN VERIFICATION FAILED:", err.message);
    return res.status(401).json({ message: "Token expired or invalid" });
  }
};