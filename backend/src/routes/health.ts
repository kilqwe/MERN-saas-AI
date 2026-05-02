import { Router } from "express";
import mongoose from "mongoose";

const router = Router();

router.get("/", async (req, res) => {
  try
  {
    let redisStatus = "unavailable";
    try {
      const redis = (await import("../config/redis.js")).default;
      await redis.ping();
      redisStatus = "healthy";
    } catch {
      redisStatus = "unavailable";
    }

    const mongoStatus =
      mongoose.connection.readyState === 1 ? "healthy" : "unhealthy";

    return res.status(200).json({
      status: "healthy",
      redis: redisStatus,
      mongodb: mongoStatus,
      version: "2.0.0",
    });
  } catch (err) {
    return res.status(500).json({ status: "unhealthy" });
  }
});

export default router;