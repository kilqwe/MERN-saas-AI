import { Router } from "express";
import userRoutes from "./user-routes.js";
import { verifyToken } from "../utils/token-manager.js";
import { chatCompletionValidator, validate } from "../utils/validators.js";
import { deleteChats, generateChatCompletion, sendChatsToUser } from "../controllers/chat-controllers.js";
import { rateLimiter } from "../utils/rate-limiter.js";
//Protected API
const chatRoutes = Router();
 
chatRoutes.post(
    "/new", 
    verifyToken,
    rateLimiter(10,60),
    validate(chatCompletionValidator), 
    generateChatCompletion);
chatRoutes.get(
    "/all-chats",
    verifyToken, 
    sendChatsToUser
);

chatRoutes.delete(
    "/delete",
    verifyToken, 
    deleteChats
);
export default chatRoutes;