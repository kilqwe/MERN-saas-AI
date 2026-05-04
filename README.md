# VentBot — AI Therapy Chatbot

[![Node.js](https://img.shields.io/badge/Node.js-v20-339933?logo=node.js&logoColor=white&style=for-the-badge)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white&style=for-the-badge)](https://www.typescriptlang.org/)
[![LangGraph](https://img.shields.io/badge/LangGraph-Agent-FF6B35?style=for-the-badge)](https://langchain-ai.github.io/langgraphjs/)
[![Qdrant](https://img.shields.io/badge/Qdrant-VectorDB-DC244C?style=for-the-badge)](https://qdrant.tech/)
[![Redis](https://img.shields.io/badge/Redis-Cache-DC382D?logo=redis&logoColor=white&style=for-the-badge)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white&style=for-the-badge)](https://www.docker.com/)
[![Render](https://img.shields.io/badge/Render-Deployed-46E3B7?logo=render&logoColor=white&style=for-the-badge)](https://render.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?logo=vercel&logoColor=white&style=for-the-badge)](https://vercel.com/)

**Live Demo:** [mern-saas-ai-umber.vercel.app](https://mern-saas-ai-umber.vercel.app)
**Backend API:** [mern-saas-ai.onrender.com](https://mern-saas-ai.onrender.com)

---

## What is VentBot?

VentBot is a production-grade AI therapy chatbot powered by a **LangGraph agentic pipeline**. Unlike a simple chatbot that blindly calls an LLM, VentBot uses multi-step reasoning to first assess the user's emotional state, retrieve relevant coping resources, and then generate a contextually appropriate response — streamed token by token in real time.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Client (Browser)                            │
│              React + Vite + Chakra UI + TypeScript              │
│           Deployed on Vercel (SSE streaming supported)          │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTPS + SSE Stream
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Node.js + Express Backend                     │
│                      TypeScript, Deployed on Render             │
│                                                                 │
│  ┌─────────────┐    ┌──────────────┐    ┌──────────────────┐   │
│  │  /api/v1    │    │ Rate Limiter │    │   JWT Auth       │   │
│  │  chat/new   │───▶│  Redis       │───▶│   HttpOnly       │   │
│  │  chat/stream│    │  10req/min   │    │   Cookies        │   │
│  │  user/*     │    └──────────────┘    └──────────────────┘   │
│  └──────┬──────┘                                               │
│         │                                                       │
│    ┌────▼──────────────────────────────────────────────────┐   │
│    │              LangGraph Agent Pipeline                  │   │
│    │                                                        │   │
│    │  ┌─────────────┐         ┌──────────────────────────┐ │   │
│    │  │   Node 1    │         │         Node 2           │ │   │
│    │  │   Crisis    │─medium/─▶   RAG Resource Fetcher   │ │   │
│    │  │  Detector   │  high   │   Qdrant Vector DB       │ │   │
│    │  │  (LLaMA)    │         │   all-MiniLM-L6-v2       │ │   │
│    │  └──────┬──────┘         └────────────┬─────────────┘ │   │
│    │         │ low                         │               │   │
│    │         └─────────────────────────────┘               │   │
│    │                          │                             │   │
│    │                   ┌──────▼──────┐                      │   │
│    │                   │   Node 3    │                      │   │
│    │                   │  Response   │                      │   │
│    │                   │  Generator  │                      │   │
│    │                   │  (LLaMA 70B)│                      │   │
│    │                   └─────────────┘                      │   │
│    └────────────────────────────────────────────────────────┘   │
│                             │                                   │
│              ┌──────────────┼──────────────┐                   │
│              ▼              ▼              ▼                   │
│         MongoDB          Redis           Qdrant                │
│      (chat history)    (rate limit)  (vector store)            │
└─────────────────────────────────────────────────────────────────┘
                           │
                    ┌──────▼──────┐
                    │   GitHub    │
                    │   Actions   │
                    │  Jest Tests │
                    │     →       │
                    │   Deploy    │
                    └─────────────┘
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, TypeScript, Chakra UI |
| Backend | Node.js, Express, TypeScript |
| Agent | LangGraph.js |
| LLM | GROQ (LLaMA 3.3 70B Versatile) |
| RAG | LangChain.js + Qdrant Vector DB |
| Embeddings | HuggingFace all-MiniLM-L6-v2 |
| Cache + Rate Limiting | Redis (ioredis) |
| Database | MongoDB (Mongoose) |
| Auth | JWT + signed HttpOnly cookies |
| Streaming | SSE (Server-Sent Events) |
| Containerization | Docker + docker-compose |
| CI/CD | GitHub Actions |
| Deployment | Render (API) + Vercel (Frontend) |

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
- `high` — Crisis detected, provides immediate hotline resources (988, Crisis Text Line)

---

## Features

- **Agentic reasoning** — LangGraph pipeline with crisis detection and RAG tools
- **Real-time streaming** — SSE streams tokens word by word like ChatGPT
- **RAG pipeline** — Qdrant vector DB with 15 therapy/CBT knowledge resources
- **Crisis detection** — Automatic severity classification with appropriate response routing
- **JWT auth** — Signed HttpOnly cookies with secure/sameSite configuration
- **Rate limiting** — Redis-based 10 requests/minute per user
- **Persistent history** — Full conversation history stored in MongoDB
- **Health check** — `/api/v1/health` reporting MongoDB and Redis status
- **CI/CD** — GitHub Actions runs Jest suite before auto-deploying to Render

---

## API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/v1/health` | Service health check | None |
| POST | `/api/v1/user/signup` | Register new user | None |
| POST | `/api/v1/user/login` | Login, sets cookie | None |
| GET | `/api/v1/user/auth-status` | Verify auth status | Required |
| GET | `/api/v1/user/logout` | Logout, clears cookie | Required |
| POST | `/api/v1/chat/new` | Send message (full response) | Required |
| POST | `/api/v1/chat/stream` | Send message (SSE stream) | Required |
| GET | `/api/v1/chat/all-chats` | Get chat history | Required |
| DELETE | `/api/v1/chat/delete` | Clear all chats | Required |

### Example — Streaming Request

```bash
curl -X POST https://mern-saas-ai.onrender.com/api/v1/chat/stream \
  -H "Content-Type: application/json" \
  -H "Cookie: auth_token=<your_token>" \
  -d '{"message": "I have been feeling really anxious lately"}'
```

### Example — SSE Response

```
data: {"type":"crisis","level":"medium"}
data: {"type":"token","content":"I"}
data: {"type":"token","content":" hear"}
data: {"type":"token","content":" you"}
...
data: {"type":"done","crisisLevel":"medium"}
```

---

## Local Development

### Prerequisites
- Docker Desktop
- Node.js 20+

### Running with Docker

```bash
# Clone the repo
git clone https://github.com/kilqwe/MERN-saas-AI
cd MERN-saas-AI

# Add environment variables
cp backend/.env.example backend/.env
# Edit .env with your values

# Start all services
docker-compose up --build
```

Services:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- Health Check: `http://localhost:8000/api/v1/health`
- Qdrant Dashboard: `http://localhost:6333/dashboard`

### Environment Variables

```env
MONGODB_URI=your_mongodb_atlas_uri
GROQ_API_KEY=your_groq_api_key
JWT_SECRET=your_jwt_secret
COOKIE_SECRET=your_cookie_secret
REDIS_URL=redis://redis:6379
QDRANT_URL=http://qdrant:6333
PORT=8000
NODE_ENV=development
```

---

## Running Tests

```bash
cd backend
npm test
```

7 tests covering health check, auth routes, and chat routes using Jest + Supertest with MongoDB in-memory server.

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
│   │   │   ├── redis.ts            # Redis client
│   │   │   ├── qdrant.ts           # Qdrant client
│   │   │   └── embeddings.ts       # HuggingFace embeddings
│   │   ├── controllers/
│   │   │   ├── chat-controllers.ts # Chat + streaming logic
│   │   │   └── user-controllers.ts # Auth logic
│   │   ├── routes/
│   │   │   ├── chat-routes.ts
│   │   │   ├── user-routes.ts
│   │   │   └── health.ts
│   │   ├── utils/
│   │   │   ├── rate-limiter.ts     # Redis rate limiter
│   │   │   └── errors.ts           # Error handler
│   │   └── tests/
│   │       └── app.test.ts         # Jest + Supertest
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   └── Chat.tsx            # SSE streaming UI
│   │   ├── components/
│   │   │   └── chat/ChatItem.tsx
│   │   └── helpers/
│   │       └── api-communicator.ts # Fetch + SSE client
│   └── Dockerfile
├── docker-compose.yml
└── .github/
    └── workflows/
        └── deploy.yml              # CI/CD pipeline
```

---

## CI/CD Pipeline

```
Push to main
     │
     ▼
GitHub Actions
     │
     ├── Install dependencies
     ├── Run Jest test suite (7 tests)
     │
     ├── Tests fail? → Pipeline stops, no deploy
     │
     └── Tests pass? → Trigger Render deployment
                              │
                              ▼
                     Live API updated
```

---

*Built with LangGraph, GROQ LLaMA 3.3 70B, Qdrant, Redis, and Node.js/TypeScript.*