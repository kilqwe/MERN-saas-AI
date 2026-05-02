import redis from "../config/redis.js";
import { Request, Response, NextFunction } from "express";

export const rateLimiter = (maxRequests: number, windowSeconds: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = res.locals.jwtData?.id || req.ip;
    const key = `rate_limit:${userId}`;

    const current = await redis.incr(key);
    if (current === 1) {
      await redis.expire(key, windowSeconds);
    }

    if (current > maxRequests) {
      return res.status(429).json({
        message: `Too many requests. Max ${maxRequests} per ${windowSeconds}s`,
      });
    }

    next();
  };
};