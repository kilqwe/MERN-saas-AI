import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import appRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";

config();

const app = express();

const allowedOrigins = [
  "http://localhost:3000",                     // local dev
  "https://mern-saas-ai-umber.vercel.app"      // deployed frontend
];

const corsOptions = {
  origin: (origin: any, callback: any) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

console.log("✅ CORS allowed origins:", allowedOrigins);

app.use(cors(corsOptions));

// ✅ Explicitly handle preflight OPTIONS
app.options("*", cors(corsOptions), (req, res) => {
  res.sendStatus(200);
});

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(morgan("dev"));

// API routes
app.use("/api/v1/", appRouter);

export default app;
