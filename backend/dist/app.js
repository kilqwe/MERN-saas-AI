import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import appRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
config();
const app = express();
const allowedOrigins = [
    process.env.FRONTEND_URL
];
app.use(cors({
    origin: function (origin, callback) {
        // Allow no-origin requests (like Postman or mobile apps)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
}));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
// Remove after dev work
app.use(morgan("dev"));
app.use("/api/v1/", appRouter);
export default app;
//# sourceMappingURL=app.js.map