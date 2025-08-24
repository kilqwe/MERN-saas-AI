// openai-config.ts (now using Groq under the hood)
import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();
export const configureOpenAi = () => {
    return new Groq({
        apiKey: process.env.GROQ_API_KEY, // new env var for Groq
    });
};
//# sourceMappingURL=openai-config.js.map