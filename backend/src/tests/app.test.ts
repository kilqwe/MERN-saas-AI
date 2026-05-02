import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app.js";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
}, 30000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Health Check", () => {
  it("GET /api/v1/health should return healthy", async () => {
    const res = await request(app).get("/api/v1/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("healthy");
  }, 15000);
});

describe("Auth Routes", () => {
  const testUser = {
    name: "Jest Test User",
    email: `jest_${Date.now()}@test.com`,
    password: "testpassword123",
  };

  it("POST /api/v1/user/signup should register a new user", async () => {
    const res = await request(app)
      .post("/api/v1/user/signup")
      .send(testUser);
    expect(res.status).toBe(201);
  }, 10000);

  it("POST /api/v1/user/login should login successfully", async () => {
    const res = await request(app)
      .post("/api/v1/user/login")
      .send({ email: testUser.email, password: testUser.password });
    expect(res.status).toBe(200);
  }, 10000);

  it("POST /api/v1/user/login should fail with wrong password", async () => {
    const res = await request(app)
      .post("/api/v1/user/login")
      .send({ email: testUser.email, password: "wrongpassword" });
    expect(res.status).toBe(403); // matches your app's actual response
  }, 10000);
});

describe("Chat Routes", () => {
  let authCookie: string;
  const testUser = {
    name: "Chat Test User",
    email: `chat_${Date.now()}@test.com`,
    password: "testpassword123",
  };

  beforeAll(async () => {
    await request(app).post("/api/v1/user/signup").send(testUser);
    const loginRes = await request(app)
      .post("/api/v1/user/login")
      .send({ email: testUser.email, password: testUser.password });

    // Extract the valid auth cookie (second one, not the expired one)
    const cookies = loginRes.headers["set-cookie"] as unknown as string[];
    authCookie = cookies
      .find((c: string) => !c.includes("Thu, 01 Jan 1970"))
      ?.split(";")[0] || "";
  }, 20000);

  it("GET /api/v1/chat/all-chats should return chats for authenticated user", async () => {
    const res = await request(app)
      .get("/api/v1/chat/all-chats")
      .set("Cookie", authCookie);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("chats");
  }, 10000);

  it("DELETE /api/v1/chat/delete should clear chats", async () => {
    const res = await request(app)
      .delete("/api/v1/chat/delete")
      .set("Cookie", authCookie);
    expect(res.status).toBe(200);
  }, 10000);

  it("POST /api/v1/chat/new without auth should return 401", async () => {
    const res = await request(app)
      .post("/api/v1/chat/new")
      .send({ message: "hello" });
    expect([401, 403]).toContain(res.status);
  }, 15000);
});