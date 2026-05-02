import { QdrantVectorStore } from "@langchain/qdrant";
import { embeddings } from "../config/embeddings.js";
import qdrantClient, { COLLECTION_NAME } from "../config/qdrant.js";

const therapyResources = [
  "Deep breathing exercise: Inhale for 4 counts, hold for 4, exhale for 6. Repeat 5 times to activate the parasympathetic nervous system.",
  "Grounding technique (5-4-3-2-1): Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste. Helps with anxiety and panic attacks.",
  "Cognitive reframing: Challenge negative thoughts by asking 'Is this thought based on facts or feelings? What would I tell a friend thinking this?'",
  "Progressive muscle relaxation: Tense each muscle group for 5 seconds then release, starting from toes up to face. Reduces physical tension from stress.",
  "Journaling prompt for anxiety: Write down your worry, the worst case scenario, the best case, and the most realistic outcome.",
  "Behavioral activation for depression: Schedule one small pleasurable activity per day. Start with 10 minutes. Momentum builds over time.",
  "Sleep hygiene for mental health: Keep consistent sleep times, avoid screens 1hr before bed, keep room cool and dark.",
  "Social support: Reaching out to one trusted person when overwhelmed can significantly reduce cortisol levels and feelings of isolation.",
  "Mindfulness: Focus on the present moment without judgment. Notice thoughts as passing clouds, not facts about yourself.",
  "Self-compassion: Treat yourself with the same kindness you would offer a good friend going through the same situation.",
  "Crisis coping: If feeling overwhelmed, use TIPP — Temperature (cold water on face), Intense exercise, Paced breathing, Paired muscle relaxation.",
  "Grief support: Grief is not linear. Allow yourself to feel without judgment. There is no timeline for healing.",
  "Anger management: Use the STOP technique — Stop, Take a breath, Observe your feelings, Proceed mindfully.",
  "Building resilience: Focus on what you can control. Break problems into small actionable steps.",
  "Suicide prevention: If you are having thoughts of suicide, please call 988 (US) or text HOME to 741741. You are not alone.",
];

export async function seedTherapyResources() {
  try {
    console.log("Seeding therapy resources into Qdrant...");

    const docs = therapyResources.map((text) => ({
      pageContent: text,
      metadata: { source: "therapy_knowledge_base" },
    }));

    await QdrantVectorStore.fromDocuments(
      docs,
      embeddings,
      {
        client: qdrantClient,
        collectionName: COLLECTION_NAME,
      }
    );

    console.log(`Seeded ${therapyResources.length} therapy resources successfully`);
  } catch (err) {
    console.error("Failed to seed resources:", err);
  }
}