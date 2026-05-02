import { QdrantClient } from "@qdrant/js-client-rest";

const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL || "http://localhost:6333",
  apiKey: process.env.QDRANT_API_KEY,
});

export const COLLECTION_NAME = "therapy_resources";

export async function initQdrant() {
  const collections = await qdrant.getCollections();
  const exists = collections.collections.some(
    (c) => c.name === COLLECTION_NAME
  );

  if (!exists) {
    await qdrant.createCollection(COLLECTION_NAME, {
      vectors: { size: 384, distance: "Cosine" },
    });
    console.log(`Qdrant collection '${COLLECTION_NAME}' created`);
  } else {
    console.log(`Qdrant collection '${COLLECTION_NAME}' already exists`);
  }
}

export default qdrant;