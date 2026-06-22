import { StateGraph, Annotation } from "@langchain/langgraph";
import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage, BaseMessage, AIMessage } from "@langchain/core/messages";
import { QdrantVectorStore } from "@langchain/qdrant";
import qdrantClient, { COLLECTION_NAME } from "../config/qdrant.js";
import { embeddings } from "../config/embeddings.js";
import dotenv from "dotenv";
dotenv.config();

// ─── LLM ────────────────────────────────────────────────────────
const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY!,
  model: "llama-3.3-70b-versatile",
});

// ─── State ───────────────────────────────────────────────────────
const AgentStateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (_a: BaseMessage[], b: BaseMessage[]) => b,
    default: () => [],
  }),
  userMessage: Annotation<string>({
    reducer: (_a: string, b: string) => b,
    default: () => "",
  }),
  crisisLevel: Annotation<"low" | "medium" | "high">({
    reducer: (_a: "low" | "medium" | "high", b: "low" | "medium" | "high") => b,
    default: (): "low" => "low",
  }),
  resources: Annotation<string[]>({
    reducer: (_a: string[], b: string[]) => b,
    default: () => [],
  }),
  finalResponse: Annotation<string>({
    reducer: (_a: string, b: string) => b,
    default: () => "",
  }),
});

type AgentState = typeof AgentStateAnnotation.State;

// ─── Tool 1: Crisis Detector ─────────────────────────────────────
async function crisisDetectorNode(state: AgentState): Promise<Partial<AgentState>> {
  const prompt = `You are a crisis detection system for a mental health chatbot.
Analyze the following message and respond with ONLY one word: "low", "medium", or "high".

- "low": General conversation, mild stress, everyday problems
- "medium": Moderate distress, anxiety, sadness, feeling overwhelmed  
- "high": Suicidal ideation, self-harm, severe crisis, immediate danger

Message: "${state.userMessage}"

Response (one word only):`;

  const response = await llm.invoke([new HumanMessage(prompt)]);
  const raw = response.content.toString().trim().toLowerCase();
  const crisisLevel: "low" | "medium" | "high" = 
    (["low", "medium", "high"] as const).includes(raw as "low" | "medium" | "high")
      ? (raw as "low" | "medium" | "high")
      : "low";

  console.log(`Crisis level detected: ${crisisLevel}`);
  return { crisisLevel };
}

// ─── Tool 2: RAG Resource Fetcher ────────────────────────────────
async function ragResourceFetcherNode(state: AgentState): Promise<Partial<AgentState>> {
  try {
    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      embeddings,
      {
        client: qdrantClient,
        collectionName: COLLECTION_NAME,
      }
    );

    const results = await vectorStore.similaritySearch(state.userMessage, 3);
    const resources = results.map((r: { pageContent: string }) => r.pageContent);

    console.log(`RAG fetched ${resources.length} resources`);
    return { resources };
  } catch (err) {
    console.error("RAG fetch failed:", err);
    return { resources: [] };
  }
}

// ─── Response Generator ──────────────────────────────────────────
async function responseGeneratorNode(state: AgentState): Promise<Partial<AgentState>> {
  const { userMessage, crisisLevel, resources, messages } = state;

  let systemPrompt = `You are VentBot, a compassionate AI mental health support assistant.
You provide empathetic, supportive responses to help users through emotional difficulties.
Always remind users you are an AI and encourage professional help when needed.`;

  if (crisisLevel === "high") {
    systemPrompt += `\n\nIMPORTANT: This user may be in crisis. 
Respond with immediate empathy and provide crisis resources:
- National Suicide Prevention Lifeline: +91 9152987821
- Crisis Text Line: Text HOME to 741741
- International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/
Encourage them to reach out to emergency services or a trusted person immediately.`;
  } else if (crisisLevel === "medium") {
    systemPrompt += `\n\nThis user is experiencing moderate distress. 
Be extra empathetic and gently suggest professional support options.`;
  }

  if (resources.length > 0) {
    systemPrompt += `\n\nRelevant coping resources to incorporate naturally:\n${resources.join("\n")}`;
  }

  const conversationMessages = [
    new SystemMessage(systemPrompt),
    ...messages,
    new HumanMessage(userMessage),
  ];

  const response = await llm.invoke(conversationMessages);
  const finalResponse = response.content.toString();

  return { finalResponse };
}

// ─── Routing Logic ───────────────────────────────────────────────
function shouldFetchResources(state: AgentState): "generate" | "fetch_resources" {
  return state.crisisLevel === "low" ? "generate" : "fetch_resources";
}

// ─── Build Graph ─────────────────────────────────────────────────
const workflow = new StateGraph(AgentStateAnnotation)
  .addNode("detect_crisis", crisisDetectorNode)
  .addNode("fetch_resources", ragResourceFetcherNode)
  .addNode("generate", responseGeneratorNode)
  .addEdge("__start__", "detect_crisis")
  .addConditionalEdges("detect_crisis", shouldFetchResources)
  .addEdge("fetch_resources", "generate")
  .addEdge("generate", "__end__");

export const ventbotAgent = workflow.compile();

// ─── Main Export Function ────────────────────────────────────────
export async function runVentbotAgent(
  userMessage: string,
  chatHistory: BaseMessage[]
): Promise<{ response: string; crisisLevel: string }> {
  const result = await ventbotAgent.invoke({
    userMessage,
    messages: chatHistory,
    crisisLevel: "low",
    resources: [],
    finalResponse: "",
  });

  return {
    response: result.finalResponse,
    crisisLevel: result.crisisLevel,
  };
}