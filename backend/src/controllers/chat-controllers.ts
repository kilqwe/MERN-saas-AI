import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { runVentbotAgent } from "../agents/ventbot-agent.js";
import { getErrorMessage } from "../utils/error-handler.js";
import { Groq } from "groq-sdk";

export const generateChatCompletionStream = async (
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

    // Set SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.flushHeaders();

    // Build chat history
    const chatHistory = user.chats.map((chat) => {
      if (chat.role === "user") return new HumanMessage(chat.content);
      return new AIMessage(chat.content);
    });

    // Run crisis detection first
    const { crisisLevel } = await runVentbotAgent(message, chatHistory);

    // Send crisis level as first SSE event
    res.write(`data: ${JSON.stringify({ type: "crisis", level: crisisLevel })}\n\n`);

    // Build system prompt based on crisis level
    let systemPrompt = `You are VentBot, a compassionate AI mental health support assistant.
You provide empathetic, supportive responses to help users through emotional difficulties.
Always remind users you are an AI and encourage professional help when needed.`;

    if (crisisLevel === "high") {
      systemPrompt += `\n\nIMPORTANT: This user may be in crisis.
Respond with immediate empathy and provide crisis resources:
- National Suicide Prevention Lifeline: 988 (US)
- Crisis Text Line: Text HOME to 741741
Encourage them to reach out to emergency services immediately.`;
    } else if (crisisLevel === "medium") {
      systemPrompt += `\n\nThis user is experiencing moderate distress.
Be extra empathetic and gently suggest professional support options.`;
    }

    // Stream GROQ response
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });
    const stream = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        ...user.chats.map(c => ({ role: c.role as "user" | "assistant", content: c.content })),
        { role: "user", content: message }
      ],
      stream: true,
    });

    let fullResponse = "";

    for await (const chunk of stream) {
      const token = chunk.choices[0]?.delta?.content || "";
      if (token) {
        fullResponse += token;
        res.write(`data: ${JSON.stringify({ type: "token", content: token })}\n\n`);
      }
    }

    // Save to MongoDB after stream completes
    user.chats.push({ role: "user", content: message });
    user.chats.push({ role: "assistant", content: fullResponse });
    await user.save();

    // Send done event
    res.write(`data: ${JSON.stringify({ type: "done", crisisLevel })}\n\n`);
    res.end();

  } catch (error) {
    res.write(`data: ${JSON.stringify({ type: "error", message: getErrorMessage(error) })}\n\n`);
    res.end();
  }
};

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