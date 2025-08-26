import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import appRouter from "./routes/index.js";
const app = express();

// ✅ Allowed origins (add your Vercel frontend here)
const allowedOrigins = [
  "http://localhost:3000",                // local dev
  "https://mern-saas-ai-umber.vercel.app"      // your Vercel frontend domain
];

// ✅ CORS middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true,  // <-- important for cookies
}));

// ✅ Middlewares
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/", appRouter);
export default app;
