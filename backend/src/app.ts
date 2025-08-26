import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

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

// ✅ Example route
app.get("/", (req, res) => {
  res.json({ message: "API running" });
});

export default app;
