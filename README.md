# VentBot SaaS AI

[![Node.js](https://img.shields.io/badge/Node.js-v20-339933?logo=node.js&logoColor=white&style=for-the-badge)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white&style=for-the-badge)](https://www.typescriptlang.org/)
[![LangGraph](https://img.shields.io/badge/LangGraph-Agent-FF6B35?style=for-the-badge)](https://langchain-ai.github.io/langgraphjs/)
[![Qdrant](https://img.shields.io/badge/Qdrant-VectorDB-DC244C?style=for-the-badge)](https://qdrant.tech/)
[![Redis](https://img.shields.io/badge/Redis-Cache-DC382D?logo=redis&logoColor=white&style=for-the-badge)](https://redis.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v6-47A248?logo=mongodb&logoColor=white&style=for-the-badge)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white&style=for-the-badge)](https://www.docker.com/)
[![Render](https://img.shields.io/badge/Render-deployed-46E3B7?logo=render&logoColor=white&style=for-the-badge)](https://render.com/)
[![Vercel](https://img.shields.io/badge/Vercel-deployed-000000?logo=vercel&logoColor=white&style=for-the-badge)](https://vercel.com/)

---

## About VentBot

<a href="https://mern-saas-ai-umber.vercel.app/" target="_blank">
  <img src="https://img.shields.io/badge/GO%20TO%20FRONTEND-ORANGE?style=for-the-badge&logo=vercel&logoColor=white&color=ff6600&labelColor=ff9900" alt="LIVE">
</a>

VentBot is a production-grade AI therapy chatbot powered by a **LangGraph agentic pipeline**. Unlike a simple chatbot that blindly calls an LLM, VentBot uses multi-step reasoning to first assess the user's emotional state, retrieve relevant coping resources from a vector database, and then generate a contextually appropriate response — streamed token by token in real time like ChatGPT.

- Agentic AI using **LangGraph** with crisis detection and RAG tools
- RAG Pipeline — Qdrant vector DB with 15 therapy/CBT knowledge resources
- Real-time streaming — SSE streams tokens word by word to the frontend
- Crisis detection — Automatic severity classification with response routing
- Secure auth with **JWT and HttpOnly cookies**
- Rate limiting — Redis-based 10 requests/minute per user
- Persistent chat history stored in MongoDB
- Containerized — Docker orchestrating 4 services
- CI/CD — GitHub Actions runs Jest suite before auto-deploying to Render

---

## Tech Stack

- **Backend:** Node.js, Express, TypeScript
- **Frontend:** React, Vite, Chakra-UI, TypeScript
- **Agent:** LangGraph.js + LangChain.js
- **LLM:** GROQ SDK (LLaMA 3.3 70B Versatile)
- **Vector DB:** Qdrant + HuggingFace all-MiniLM-L6-v2 embeddings
- **Cache + Rate Limiting:** Redis (ioredis)
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT with signed HttpOnly cookies
- **Streaming:** SSE (Server-Sent Events)
- **Deployment:** Render (backend), Vercel (frontend)
- **CI/CD:** GitHub Actions + Jest + Supertest

---

## Agent Pipeline

VentBot uses a **3-node LangGraph state machine** that processes every message:

```
User Message
     │
     ▼
┌─────────────────┐
│ Node 1: Crisis  │  LLaMA classifies severity:
│    Detector     │  low / medium / high
└────────┬────────┘
         │
    low  │  medium/high
         │
    ┌────┴──────────────────┐
    │                       ▼
    │          ┌─────────────────────────┐
    │          │ Node 2: RAG Fetcher     │  Semantic search over
    │          │ Qdrant Vector Store     │  15 therapy resources
    │          └────────────┬────────────┘
    │                       │
    └───────────────────────┘
                │
                ▼
     ┌─────────────────────┐
     │ Node 3: Response    │  LLaMA 70B generates
     │    Generator        │  contextual response
     └─────────────────────┘
                │
                ▼
     Streamed token by token via SSE
```

**Crisis levels:**
- `low` — General conversation, skips RAG for faster response
- `medium` — Moderate distress, fetches coping resources, suggests professional help
- `high` — Crisis detected, provides hotline resources (988, Crisis Text Line)

---

## Features

- SIGN UP / LOGIN / LOGOUT with JWT + HttpOnly cookies
- Persistent chat history stored in MongoDB
- Real-time token streaming via SSE (like ChatGPT)
- LangGraph agentic pipeline with crisis detection and RAG
- Qdrant vector DB with 15 therapy/CBT resources
- Redis rate limiting (10 req/min per user)
- Syntax-highlighted code blocks in chat
- Clear conversation button
- Health check endpoint reporting MongoDB + Redis status
- Jest + Supertest test suite (7 tests)
- GitHub Actions CI/CD pipeline
- Docker Compose with 4 services (API, MongoDB, Redis, Qdrant)

---

## Getting Started (Dev Setup)

**1. Clone the repo**

```bash
git clone https://github.com/kilqwe/MERN-saas-AI
cd MERN-saas-AI
```

**2. Set environment variables**

Create `backend/.env`:

```env
PORT=8000
NODE_ENV=development
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
COOKIE_SECRET=your_cookie_secret
GROQ_API_KEY=your_groq_api_key
REDIS_URL=redis://redis:6379
QDRANT_URL=http://qdrant:6333
```

**3. Run with Docker**

```bash
docker-compose up --build
```

Services available at:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- Health Check: `http://localhost:8000/api/v1/health`
- Qdrant Dashboard: `http://localhost:6333/dashboard`

---

## API Endpoints

```
GET    /api/v1/health              → Service health check
POST   /api/v1/user/signup         → Register new user
POST   /api/v1/user/login          → Login, sets cookie
GET    /api/v1/user/auth-status    → Verify auth status
GET    /api/v1/user/logout         → Logout, clears cookie
POST   /api/v1/chat/new            → Send message (full response)
POST   /api/v1/chat/stream         → Send message (SSE stream)
GET    /api/v1/chat/all-chats      → Get chat history
DELETE /api/v1/chat/delete         → Clear all chats
```

**Example — Streaming response:**
```
data: {"type":"crisis","level":"medium"}
data: {"type":"token","content":"I hear you..."}
data: {"type":"done","crisisLevel":"medium"}
```

---

## Running Tests

```bash
cd backend
npm test
```

7 tests covering health check, auth routes, and chat routes using Jest + Supertest with MongoDB in-memory server.

---

## CI/CD Pipeline

Every push to `main`:

```
Push to main → GitHub Actions → Run Jest (7 tests)
                                      │
                              fail → stop, no deploy
                              pass → deploy to Render
```

---

## Project Structure

```
MERN-saas-AI/
├── backend/
│   ├── src/
│   │   ├── agents/
│   │   │   ├── ventbot-agent.ts    # LangGraph pipeline
│   │   │   └── seed-resources.ts   # Qdrant seeder
│   │   ├── config/
│   │   │   ├── redis.ts
│   │   │   ├── qdrant.ts
│   │   │   └── embeddings.ts
│   │   ├── controllers/
│   │   │   ├── chat-controllers.ts # Chat + SSE streaming
│   │   │   └── user-controllers.ts
│   │   ├── routes/
│   │   ├── utils/
│   │   │   ├── rate-limiter.ts
│   │   │   └── errors.ts
│   │   └── tests/
│   │       └── app.test.ts
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/Chat.tsx
│   │   ├── components/
│   │   └── helpers/
│   │       └── api-communicator.ts
│   └── Dockerfile
├── docker-compose.yml
└── .github/workflows/deploy.yml
```