import app from "./app.js";
import { connectToDatabase } from "./db/connection.js";
import { initQdrant } from "./config/qdrant.js";
import { seedTherapyResources } from "./agents/seed-resources.js";

const PORT = process.env.PORT || 8000;

async function main() {
  await connectToDatabase();
  await initQdrant();
  await seedTherapyResources();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

main().catch(console.error);