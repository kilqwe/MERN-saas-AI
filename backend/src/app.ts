import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import appRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";

config();

const app = express();

const frontendURL = process.env.FRONTEND_URL;

console.log(`CORS is configured to allow requests from origin: "${frontendURL}"`);

const corsOptions = {
  origin: frontendURL,
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(morgan("dev"));

app.use("/api/v1/", appRouter);

export default app;