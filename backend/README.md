# VentBot Backend

Production-grade Node.js/TypeScript backend for VentBot, an AI therapy chatbot powered by a LangGraph agentic pipeline.

## What it does

Processes user messages through a 3-node LangGraph state machine:
1. **Crisis Detector** — classifies message severity (low/medium/high) using LLaMA 3.3 70B
2. **RAG Fetcher** — retrieves relevant therapy resources from Qdrant vector DB (medium/high only)
3. **Response Generator** — generates contextual response, streamed token by token via SSE

## Tech

- Node.js + Express + TypeScript
- LangGraph.js + LangChain.js
- GROQ API (LLaMA 3.3 70B Versatile)
- Qdrant vector DB + HuggingFace embeddings
- Redis rate limiting
- MongoDB (Mongoose)
- JWT auth + signed HttpOnly cookies
- Docker + docker-compose

## Run locally

**Prerequisites:** Docker Desktop, Node.js 20+

```bash
# Clone the repo
git clone https://github.com/kilqwe/MERN-saas-AI
cd MERN-saas-AI

# Add environment variables
cp backend/.env.example backend/.env
# Fill in your values

# Start all services (API + MongoDB + Redis + Qdrant)
docker-compose up --build
```

API runs at `http://localhost:8000`
Health check: `http://localhost:8000/api/v1/health`

## Key files

- `src/agents/ventbot-agent.ts` — LangGraph pipeline
- `src/agents/seed-resources.ts` — Qdrant vector DB seeder
- `src/controllers/chat-controllers.ts` — chat + SSE streaming
- `src/config/` — Redis, Qdrant, embeddings setup
- `src/utils/rate-limiter.ts` — Redis rate limiter
- `src/tests/app.test.ts` — Jest + Supertest suite

## Tests

```bash
cd backend
npm test
```

## API

```
POST /api/v1/chat/stream   → SSE streaming response
POST /api/v1/chat/new      → full response
GET  /api/v1/health        → service health
POST /api/v1/user/signup   → register
POST /api/v1/user/login    → login
```