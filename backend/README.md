# 🚀 VentBot SaaS AI
[![Node.js](https://img.shields.io/badge/Node.js-v20-339933?logo=node.js&logoColor=white&style=for-the-badge)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white&style=for-the-badge)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v6-47A248?logo=mongodb&logoColor=white&style=for-the-badge)](https://www.mongodb.com/)
[![Render](https://img.shields.io/badge/Render-deployed-ff3e00?logo=render&logoColor=white&style=for-the-badge)](https://render.com/)
[![Vercel](https://img.shields.io/badge/Vercel-deployed-000000?logo=vercel&logoColor=white&style=for-the-badge)](https://vercel.com/)

---

## 🌟 About VentBot

VentBot is an AI-powered chatbot platform for real-time conversations.  
It lets users chat with AI, view conversation history, and manage their sessions seamlessly.

- 🧠 AI-powered chats using **Groq SDK**
- 🔐 Secure authentication with **JWT & HttpOnly cookies**
- 💻 Full chat history and clear conversation functionality
- ⚡ Responsive and modern UI using **React + MUI**

---

## 📦 Tech Stack

- **Backend:** Node.js, Express, MongoDB  
- **Frontend:** React, Vite, MUI  
- **Deployment:** Render (backend), Vercel (frontend)  
- **Authentication:** JWT with cookies  
- **AI Integration:** Groq SDK

---

## 🎨 Features

- ✅ SIGN UP / LOGIN / LOGOUT  
- ✅ Persistent chat history  
- ✅ Clear conversation button  
- ✅ Syntax-highlighted code blocks in chat  
- ✅ CORS & secure cookie handling

---

## 🔗 TRY IT ONLINE

<a href="https://ventbot-saas-ai.vercel.app" target="_blank">
  <img src="https://img.shields.io/badge/🚀%20GO%20TO%20FRONTEND-ORANGE?style=for-the-badge&logo=vercel&logoColor=white&color=ff6600&labelColor=ff9900" alt="Go to Frontend">
</a>

## 🛠️ Getting Started (Dev Setup)

1. **Clone the repo**

```bash
git clone https://github.com/<your-username>/ventbot-saas-ai.git
cd ventbot-saas-ai
```
Install dependencies

```bash

npm install
Set environment variables
```
Create a .env file with:
```
PORT=5000
MONGO_URI=<your-mongo-uri>
COOKIE_SECRET=<your-cookie-secret>
GROQ_API_KEY=<your-groq-api-key>
FRONTEND_URL=https://ventbot-saas-ai.vercel.app

```
Run locally
```bash

npm run dev
```
📄 API Endpoints
```
POST /api/v1/user/login → Log in user

POST /api/v1/user/signup → Sign up user

GET /api/v1/user/auth-status → Check auth status

GET /api/v1/user/logout → Logout user

POST /api/v1/chat/new → Send new chat

GET /api/v1/chat/all-chats → Get user chats

DELETE /api/v1/chat/delete → Clear all chats
```
