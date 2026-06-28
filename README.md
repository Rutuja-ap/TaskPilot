<<<<<<< HEAD
# 📋 TaskTracker — MERN Stack Task Management App

> A full-stack task management web application built with MongoDB, Express.js, React.js, and Node.js.

---

## ✨ Features

### Mandatory
- ✅ **Full CRUD** — Create, Read, Update, Delete tasks
- ✅ **Form Validation** — Client-side + server-side validation
- ✅ **REST API** — Clean, structured Express REST API
- ✅ **MongoDB Integration** — Mongoose ODM with proper schema design
- ✅ **Responsive UI** — Mobile-first design, works on all screen sizes
- ✅ **Dynamic Updates** — No page refresh needed (React state + Context API)

### Bonus Features
- 🔍 **Search** — Real-time search across title, description, and tags
- 🎯 **Filter** — Filter by status (todo / in-progress / completed) and priority
- ↕️ **Sort** — Sort by date, due date, priority, or title
- 🏷️ **Tags** — Add comma-separated tags to tasks
- 📅 **Due Dates** — Set due dates with overdue/today visual indicators
- 📊 **Dashboard Stats** — Live count of tasks by status + completion rate bar
- 🔄 **Status Cycling** — Quick-cycle status with one click
- 🗑️ **Bulk Delete** — Clear all completed tasks at once
- 🌙 **Dark Theme** — Clean dark UI
- 🔔 **Toast Notifications** — Success/error feedback for every action
- ⚙️ **Environment Variables** — All secrets in `.env` files

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Context API, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Deployment | Vercel (frontend) + Render (backend) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 16
- MongoDB Atlas account (free at mongodb.com/atlas)
- Git

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/tasktracker.git
cd tasktracker
```

### 2. Set up the Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/tasktracker
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

```bash
npm run dev   # starts on http://localhost:5000
```

### 3. Set up the Frontend

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

```bash
npm start    # starts on http://localhost:3000
```

---

## 🔌 REST API Reference

Base URL: `http://localhost:5000/api`

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | Get all tasks (supports filters) |
| GET | `/tasks/:id` | Get single task |
| POST | `/tasks` | Create task |
| PUT | `/tasks/:id` | Full update |
| PATCH | `/tasks/:id/status` | Quick status update |
| DELETE | `/tasks/:id` | Delete task |
| DELETE | `/tasks?status=completed` | Bulk delete by status |
| GET | `/health` | Health check |

### Query Parameters (GET /tasks)
| Param | Values | Description |
|-------|--------|-------------|
| `status` | todo, in-progress, completed | Filter by status |
| `priority` | low, medium, high | Filter by priority |
| `search` | string | Search title, description, tags |
| `sortBy` | createdAt, dueDate, priority, title | Sort field |
| `order` | asc, desc | Sort direction |

### Task Schema
```json
{
  "title": "string (required, 3-100 chars)",
  "description": "string (optional, max 500 chars)",
  "status": "todo | in-progress | completed",
  "priority": "low | medium | high",
  "dueDate": "ISO date string (optional)",
  "tags": ["array", "of", "strings"]
}
```

### Example Response
```json
{
  "success": true,
  "data": [
    {
      "_id": "666abc...",
      "title": "Build MERN app",
      "description": "Complete the internship assignment",
      "status": "in-progress",
      "priority": "high",
      "dueDate": "2025-07-01T00:00:00.000Z",
      "tags": ["react", "internship"],
      "createdAt": "2025-06-28T10:00:00.000Z",
      "updatedAt": "2025-06-28T12:00:00.000Z"
    }
  ],
  "summary": {
    "todo": 2,
    "inProgress": 1,
    "completed": 3,
    "total": 6
  }
}
```

---

## ☁️ Deployment

### Backend → Render.com
1. Push code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repo
4. Set build command: `cd backend && npm install`
5. Set start command: `cd backend && npm start`
6. Add environment variables: `MONGODB_URI`, `FRONTEND_URL`, `NODE_ENV=production`
7. Deploy → copy the URL (e.g. `https://tasktracker-api.onrender.com`)

### Frontend → Vercel
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Set root directory to `frontend`
4. Add environment variable: `REACT_APP_API_URL=https://tasktracker-api.onrender.com/api`
5. Deploy → your app is live!

---

## 📁 Project Structure

```
tasktracker/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── middleware/
│   │   └── validate.js        # express-validator rules
│   ├── models/
│   │   └── Task.js            # Mongoose schema
│   ├── routes/
│   │   └── tasks.js           # REST API routes
│   ├── server.js              # Express app entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── components/
        │   ├── Badge.jsx       # Reusable status/priority badges
        │   ├── EmptyState.jsx  # Empty list component
        │   ├── FilterBar.jsx   # Search + filter + sort UI
        │   ├── Modal.jsx       # Reusable modal
        │   ├── StatsBar.jsx    # Dashboard summary
        │   ├── TaskCard.jsx    # Individual task card
        │   └── TaskForm.jsx    # Create/edit form
        ├── context/
        │   └── TaskContext.jsx # Global state (useReducer)
        ├── hooks/
        │   └── useTaskForm.js  # Form state + validation hook
        ├── pages/
        │   └── HomePage.jsx    # Main page layout
        ├── utils/
        │   └── api.js          # Axios API service
        ├── App.jsx
        ├── index.js
        └── styles.css
```

---

## 🧠 Architecture Decisions

- **Context API + useReducer** instead of Redux — sufficient for this scale, no extra dependencies
- **Custom hooks** (`useTaskForm`) — separation of concerns, reusable form logic
- **Server-side + client-side validation** — defense in depth, better UX
- **Debounced search** — reduces API calls while typing
- **Optimistic UI** via context dispatch — instant feedback, then reconcile with server
- **Environment variables** on both ends — no hardcoded URLs, deployment-ready

---

## 👤 Author

Built as an internship assignment demonstrating full-stack MERN development.
=======
# TaskPilot
>>>>>>> 1d2932aa9389b5e8b12878ce6093f46373a0539b
