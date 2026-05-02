import { Router } from "express";
import userRouter from "./user-routes.js";
import chatRouter from "./chat-routes.js";
import healthRouter from "./health.js";

const appRouter = Router();

appRouter.use("/user", userRouter);
appRouter.use("/chat", chatRouter);
appRouter.use("/health", healthRouter);

export default appRouter;