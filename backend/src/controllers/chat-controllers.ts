import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { runVentbotAgent } from "../agents/ventbot-agent.js";
import { getErrorMessage } from "../utils/error-handler.js";

export const generateChatCompletion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { message } = req.body;

  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).json({ message: "User not registered or token malfunctioned." });
    }

    // Build chat history for agent
    const chatHistory = user.chats.map((chat) => {
      if (chat.role === "user") return new HumanMessage(chat.content);
      return new AIMessage(chat.content);
    });

    // Run LangGraph agent
    const { response, crisisLevel } = await runVentbotAgent(message, chatHistory);

    // Save to MongoDB
    user.chats.push({ role: "user", content: message });
    user.chats.push({ role: "assistant", content: response });
    await user.save();

    return res.status(200).json({
      chats: user.chats,
      crisisLevel, // expose to frontend so UI can react
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: getErrorMessage(error) });
  }
};

export const sendChatsToUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) return res.status(401).send("User not registered or token malfunctioned");
    if (user._id.toString() !== res.locals.jwtData.id)
      return res.status(401).send("Permissions didn't match");

    return res.status(200).json({ message: "OK", chats: user.chats });
  } catch (error) {
    return res.status(500).json({ message: getErrorMessage(error) });
  }
};

export const deleteChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) return res.status(401).send("User not registered or token malfunctioned");
    if (user._id.toString() !== res.locals.jwtData.id)
      return res.status(401).send("Permissions didn't match");

    // @ts-ignore
    user.chats = [];
    await user.save();

    return res.status(200).json({ message: "OK" });
  } catch (error) {
    return res.status(500).json({ message: getErrorMessage(error) });
  }
};