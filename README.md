# 🚀 LeetLab

A full-stack coding platform inspired by LeetCode that allows users to solve problems, execute code in multiple languages, and track submissions.

---

## 🌟 Features

- 🧠 Create and solve coding problems
- ⚡ Real-time code execution using Judge0
- 🔐 JWT Authentication (Login/Register)
- 📊 Submission tracking (Accepted / Wrong Answer)
- 🏷️ Tags & Difficulty filtering
- 📚 Playlist system
- 👨‍💻 Admin problem management
- 🎨 Modern UI with React + Tailwind + DaisyUI

---

## 🛠 Tech Stack

### Frontend
- React.js (Vite)
- Zustand (State Management)
- React Hook Form + Zod
- Axios
- TailwindCSS + DaisyUI
- Monaco Editor

### Backend
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication
- bcrypt

### Code Execution
- Judge0 API (Self-hosted via Docker OR Hosted API)

---

## 🗂 Project Structure

```
LeetLab/
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── store/
│       └── lib/
│
├── backend/
│   └── src/
│       ├── controllers/
│       ├── routes/
│       ├── middleware/
│       ├── libs/
│       └── prisma/
```

---

## ⚙️ Environment Setup

### Backend `.env`

```env
PORT=8080
DATABASE_URL="postgresql://user:password@localhost:5432/leetlab"
JWT_SECRET=your_secret_key

# If using hosted Judge0
JUDGE0_BASE_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=your_api_key
```

---

## 🚀 Running Locally

### 1️⃣ Start PostgreSQL (Docker)

```bash
docker run --name leetlab-postgres \
-e POSTGRES_PASSWORD=yourpassword \
-e POSTGRES_DB=leetlab \
-p 5432:5432 \
-d postgres
```

---

### 2️⃣ Run Prisma Migration

```bash
cd backend
npx prisma migrate dev
```

---

### 3️⃣ Start Backend

```bash
npm run dev
```

Runs on:

```
http://localhost:8080
```

---

### 4️⃣ Start Frontend

```bash
cd frontend
npm run dev
```

Runs on:

```
http://localhost:5173
```

---

# 🐳 Judge0 Docker Warning (Important)

Many developers face:

- 🔥 High CPU usage (1500%+)
- 🔥 Docker memory spikes
- 🔥 Worker containers looping
- 🔥 500 Internal Server Error on submission

If Judge0 becomes unstable:

Stop containers:

```bash
docker compose down
```

Remove unused containers:

```bash
docker system prune -a
```

Restart clean:

```bash
docker compose up -d
```

---

### ⚠️ Recommended for Development

Instead of self-hosting Judge0 locally (which consumes high CPU),
use the hosted Judge0 API during development.

Just update your `judge0.lib.js` base URL to the hosted endpoint.

---

## 🐛 Common Issues & Fixes

### ❌ Blank screen after login

Error:
```
Cannot read properties of undefined (reading 'some')
```

Fix:
Use optional chaining in frontend:

```js
problem.solvedBy?.some(...) || false
```

---

### ❌ Prisma Can't Reach Database

Error:
```
Can't reach database server at localhost:5432
```

Fix:
Make sure PostgreSQL container is running:

```bash
docker ps
```

---

### ❌ High Docker CPU Usage

Cause:
Judge0 worker containers stuck in loop.

Fix:
Use hosted Judge0 instead of local Docker during development.

---

## 🧠 Future Improvements

- Contest mode
- Real-time leaderboard
- AI-based hints
- Deployment (AWS / Render / Railway)
- Code plagiarism detection

---

## 👨‍💻 Author

**Rohit Rana**

GitHub: https://github.com/rohittrana  

---

⭐ If you like this project, consider giving it a star.
