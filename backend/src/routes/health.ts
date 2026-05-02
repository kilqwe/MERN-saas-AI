import { Router } from "express";
import mongoose from "mongoose";

const router = Router();

router.get("/", async (req, res) => {
  const mongoStatus =
    mongoose.connection.readyState === 1 ? "healthy" : "unhealthy";

  return res.status(200).json({
    status: "healthy",
    redis: process.env.NODE_ENV === "test" ? "skipped" : "healthy",
    mongodb: mongoStatus,
    version: "2.0.0",
  });
});

export default router;