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
  req:Request, 
  res:Response, 
  next:NextFunction) => {
  const token = req.signedCookies[`${COOKIE_NAME}`];
  if(!token || token.trim() === ""){
    return res.status(401).json({message:"Token not received."});
  }
  return new Promise<void>((resolve, reject) => {
    return jwt.verify(token, process.env.JWT_SECRET, (err, success)=>{
      if(err){
        reject(err.message);
        return res.status(401).json({message:"Token Expired"});
      }else{       
        resolve();
        res.locals.jwtData=success;
        return next();
      }
    });
  });

};