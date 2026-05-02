import { jest } from "@jest/globals";

// Mock Redis
jest.mock("../config/redis.js", () => {
  return {
    default: {
      incr: jest.fn().mockImplementation(() => Promise.resolve(1)),
      expire: jest.fn().mockImplementation(() => Promise.resolve(1)),
      ping: jest.fn().mockImplementation(() => Promise.resolve("PONG")),
      on: jest.fn(),
    },
  };
});


// Mock Qdrant
jest.mock("../config/qdrant.js", () => {
  return {
    default: {
      getCollections: jest.fn().mockImplementation(() =>
        Promise.resolve({ collections: [] })
      ),
      createCollection: jest.fn().mockImplementation(() =>
        Promise.resolve({})
      ),
    },
    COLLECTION_NAME: "therapy_resources",
    initQdrant: jest.fn().mockImplementation(() => Promise.resolve()),
  };
});
// Mock the agent entirely
jest.mock("../agents/ventbot-agent.js", () => {
  return {
    runVentbotAgent: jest.fn().mockImplementation(() => Promise.resolve({
      "response": "I hear you. How are you feeling?",
      "crisisLevel": "low",
    })),
  };
});
