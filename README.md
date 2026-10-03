# ChronoTask

> A full-stack task management and time-tracking application built with Next.js, TypeScript, MongoDB, and Mongoose.

ChronoTask helps users manage their tasks, track time spent on individual tasks, and understand their productivity through a live productivity dashboard.

## 🌐 Live Project

**Live Demo:** Add your Vercel URL here

**Repository:** `https://github.com/bishalpal29092025-sudo/ChronoTask`

---

## ✨ Features

### 🔐 Authentication & Security
- User signup and login
- Auth.js credential-based authentication
- Password hashing with bcryptjs
- JWT-based sessions
- Protected API routes
- User-specific data access
- Server-side authorization and task ownership checks
- Zod request validation
- Meaningful HTTP status codes and error handling

### 📝 Task Management
- Create tasks
- Update tasks
- Delete tasks
- Task descriptions
- Task status management:
  - Pending
  - In Progress
  - Completed
- User-specific task access
- Recent task dashboard view

### ⏱️ Time Tracking
- Start and stop timers for individual tasks
- Persistent timer sessions using MongoDB
- Server-side `startedAt` / `endedAt` timestamps
- Live elapsed-time display in the frontend
- Timer state survives page refreshes and navigation
- Multi-tab timer synchronization
- Backend prevention of multiple active timers
- Persistent time-log history
- Per-user and per-task time tracking

### 📊 Productivity Dashboard
- Total tasks
- Completed tasks
- In-progress tasks
- Pending tasks
- Tracked time today
- Tasks worked on today
- Today's activity timeline
- Recent tasks
- 7-day productivity chart
- Dashboard data calculated from actual MongoDB records

### 🎨 User Experience
- Responsive dark-themed interface
- Modern SaaS-style UI
- Animated statistics
- Framer Motion interactions
- Productivity visualization with Recharts
- Responsive task and dashboard layouts
- Animated landing page
- Dedicated signup and login pages

---

## 🛠️ Tech Stack

### Frontend

- Next.js 16
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts

### Backend

- Next.js Route Handlers
- Auth.js
- Zod
- bcryptjs

### Database

- MongoDB
- Mongoose
- MongoDB Atlas

### Development & Deployment

- Git
- GitHub
- Vercel

---

## 🏗️ Architecture

```text
                         ChronoTask
                              │
              ┌───────────────┴───────────────┐
              │                               │
        Next.js Frontend                 Next.js Backend
        React + TypeScript              Route Handlers
        Tailwind CSS                    REST APIs
        Framer Motion                        │
              │                              │
              └──────────────┬───────────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
                 Auth.js          Application APIs
                    │                 │
                    │        ┌────────┼────────┐
                    │        │        │        │
                    │      Tasks     Timer  Dashboard
                    │        │        │        │
                    └────────┴────────┼────────┘
                                     │
                                  Mongoose
                                     │
                                     ▼
                               MongoDB Atlas
                                     │
                         ┌───────────┼───────────┐
                         │           │           │
                       Users       Tasks      TimeLogs
```

The application uses Next.js for both the frontend and backend. Next.js Route Handlers expose protected REST-style APIs, while Mongoose provides the database model layer.

---

## ⏱️ Timer Architecture

ChronoTask uses MongoDB as the source of truth for active timers.

### Starting a timer

```text
User clicks Start
       ↓
POST /api/tasks/[id]/timer
       ↓
Server verifies authentication
       ↓
Server verifies task ownership
       ↓
Server checks for an existing active timer
       ↓
TimeLog created in MongoDB
       ↓
startedAt stored on the server
```

The frontend calculates the live elapsed time from the stored `startedAt` timestamp.

### Stopping a timer

```text
User clicks Stop
       ↓
POST /api/tasks/[id]/timer/stop
       ↓
Server verifies authentication
       ↓
Server verifies task ownership
       ↓
Active TimeLog is located
       ↓
endedAt is stored
       ↓
Duration is calculated
       ↓
Updated timer state returned to frontend
```

This design allows the timer to:

- Survive page refreshes
- Survive navigation
- Remain synchronized across browser tabs
- Continue independently of React's local state
- Calculate elapsed time from server timestamps
- Persist completed sessions in MongoDB

The backend prevents a user from creating multiple active timers at the same time.

---

## 🔄 Multi-Tab Timer Synchronization

ChronoTask periodically synchronizes the active timer with the backend.

```text
Browser Tab 1
      │
      │ Start / Stop Timer
      ▼
   MongoDB
      │
      ▼
 Active TimeLog
      │
      ▼
/api/tasks/timer/active
      │
    ┌─┴─┐
    ▼   ▼
  Tab 1 Tab 2
```

The frontend periodically requests the active timer endpoint and updates its local state.

This keeps multiple browser tabs for the same authenticated user synchronized with the server-side timer state.

---

## 🔐 Authentication & Authorization

ChronoTask uses Auth.js with credential-based authentication.

### Signup flow

```text
User submits signup form
        ↓
POST /api/auth/signup
        ↓
Zod validates request
        ↓
Email is normalized
        ↓
Existing account is checked
        ↓
Password is hashed using bcrypt
        ↓
User stored in MongoDB
        ↓
Account created
```

Passwords are never stored as plain text.

### Login flow

Auth.js verifies the submitted credentials against the stored bcrypt password hash and creates a JWT-based session.

### Authorization

Protected API routes verify the authenticated user's session before accessing application data.

Task and time-log operations are scoped to the authenticated user's ID.

For example:

```ts
{
  taskId: taskId,
  userId: session.user.id
}
```

This prevents a user from accessing another user's task simply by changing a task ID in a request.

Unauthenticated requests return:

```text
401 Unauthorized
```

---

## 📊 Dashboard

The dashboard provides an overview of the user's productivity using real data from MongoDB.

### Dashboard statistics

- Total Tasks
- Completed Tasks
- In Progress Tasks
- Pending Tasks
- Tracked Time Today
- Tasks Worked on Today

### Recent Tasks

The dashboard displays recently created tasks and their current status.

### Today's Activity

The activity timeline displays time-tracking sessions from the current day, including:

- Task name
- Start time
- End time
- Duration
- Active timer state

### Productivity Chart

The dashboard includes a 7-day tracked-time visualization based on actual `TimeLog` records stored in MongoDB.

No static productivity data is used for the chart.

---

## 📡 API Overview

### Authentication

```text
POST /api/auth/signup
POST /api/auth/[...nextauth]
```

### Tasks

```text
GET    /api/tasks
POST   /api/tasks
PUT    /api/tasks/[id]
DELETE /api/tasks/[id]
```

### Timer

```text
POST /api/tasks/[id]/timer
POST /api/tasks/[id]/timer/stop
GET  /api/tasks/timer/active
```

### Time Logs

```text
GET /api/tasks/timelogs
```

### Dashboard

```text
GET /api/dashboard
```

Protected endpoints require an authenticated session.

---

## 🗄️ Data Models

### User

```text
User
├── _id
├── name
├── email
├── password
├── createdAt
└── updatedAt
```

### Task

```text
Task
├── _id
├── userId
├── title
├── description
├── status
├── createdAt
└── updatedAt
```

### TimeLog

```text
TimeLog
├── _id
├── taskId
├── userId
├── startedAt
├── endedAt
├── createdAt
└── updatedAt
```

---

## 📁 Project Structure

```text
chronotask/
├── app/
│   ├── (app)/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── tasks/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   │
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/
│   │   │   │   └── route.ts
│   │   │   └── signup/
│   │   │       └── route.ts
│   │   │
│   │   ├── dashboard/
│   │   │   └── route.ts
│   │   │
│   │   └── tasks/
│   │       ├── [id]/
│   │       │   ├── route.ts
│   │       │   └── timer/
│   │       │       ├── route.ts
│   │       │       └── stop/
│   │       │           └── route.ts
│   │       ├── route.ts
│   │       ├── timer/
│   │       │   └── active/
│   │       │       └── route.ts
│   │       └── timelogs/
│   │           └── route.ts
│   │
│   ├── login/
│   │   └── page.tsx
│   ├── signup/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── dashboard/
│   │   ├── AnimatedStats.tsx
│   │   └── ProductivityChart.tsx
│   ├── AuthStatus.tsx
│   ├── Navbar.tsx
│   └── Providers.tsx
│
├── lib/
│   └── mongodb.ts
│
├── models/
│   ├── User.ts
│   ├── Task.ts
│   └── TimeLog.ts
│
├── types/
│   └── next-auth.d.ts
│
├── auth.ts
├── package.json
├── next.config.ts
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/bishalpal29092025-sudo/ChronoTask.git
cd ChronoTask
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
MONGODB_URI=your_mongodb_connection_string
AUTH_SECRET=your_auth_secret
```

Do not commit `.env.local` to Git.

### 4. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB database connection string |
| `AUTH_SECRET` | Secret used by Auth.js for session security |

Never commit production credentials or `.env.local` to GitHub.

---

## 🧪 Testing & Verification

TypeScript validation:

```bash
npx tsc --noEmit
```

The application has been manually tested for:

- User signup
- User login
- Protected API routes
- Task creation
- Task updates
- Task deletion
- Task ownership
- Timer start
- Timer stop
- Timer persistence
- Timer persistence after browser refresh
- Multi-tab timer synchronization
- Multiple active timer prevention
- Dashboard statistics
- Time-log persistence
- Daily activity tracking
- 7-day productivity data
- Unauthorized API access

---

## 🔒 API Security

### Unauthenticated requests

Protected endpoints return:

```text
401 Unauthorized
```

### Multiple active timers

If a user attempts to start another timer while an active timer already exists, the server returns:

```text
409 Conflict
```

Example:

```text
You already have an active timer.
```

### Task ownership

Task operations verify both:

```text
Task ID
+
Authenticated User ID
```

This ensures that users can only access and modify their own tasks.

### Validation

Incoming signup and API data is validated before database operations. Invalid requests return appropriate client-error status codes instead of being processed blindly.

---

## 🎯 Design Principles

### Server-Side Source of Truth

Important application state, especially active timers and completed time sessions, is persisted on the server.

### User Data Isolation

Tasks and time logs are associated with the authenticated user's ID.

### Real-Time User Experience

The frontend provides a live timer display and periodically synchronizes timer state with the backend.

### Clean Separation of Responsibilities

The application separates:

- UI components
- API routes
- Database models
- Authentication
- Dashboard calculations
- Data visualization

---

## 💡 Key Technical Highlights

### 1. Persistent Timer

Timer state is persisted in MongoDB using `TimeLog` documents instead of relying only on browser state.

### 2. Server-Side Timer Validation

The backend checks for an existing active timer before creating a new timer session.

### 3. Multi-Tab Synchronization

Multiple browser tabs periodically query the active timer endpoint so that timer state stays synchronized.

### 4. Protected Data Access

Database queries use the authenticated user's ID to prevent cross-user data access.

### 5. Real-Time Dashboard Data

Dashboard statistics and charts are calculated from actual task and time-log records.

### 6. Production Deployment

The application is deployed on Vercel and connected to MongoDB Atlas. The GitHub repository is connected to Vercel so changes pushed to the `main` branch can trigger a new deployment automatically.

---

## 🚀 Deployment

ChronoTask is deployed using:

- **Vercel** — Next.js application hosting
- **MongoDB Atlas** — cloud database
- **GitHub** — source control and deployment integration

Production environment variables are configured through Vercel:

```env
MONGODB_URI=your_production_mongodb_uri
AUTH_SECRET=your_production_auth_secret
```

Production secrets are not stored in the GitHub repository.

### Deployment workflow

```text
Local Development
       ↓
Test Application
       ↓
git add .
       ↓
git commit
       ↓
git push
       ↓
GitHub main
       ↓
Vercel Deployment
       ↓
Live ChronoTask
```

---

## 🧠 Challenges & Solutions

### Timer State Synchronization

One of the main technical challenges was keeping the frontend timer state synchronized with the backend.

A timer could be stopped successfully on the server while the frontend temporarily displayed the previous state.

The solution was to treat the backend as the source of truth and periodically synchronize the frontend with:

```text
GET /api/tasks/timer/active
```

The stop flow was also updated to clear the client-side timer state after the server confirms the operation.

This made the timer more reliable across refreshes, navigation, and multiple browser tabs.

---

## 🎤 Project Explanation

ChronoTask can be summarized as:

> **“A full-stack productivity application where users can manage tasks and track the actual time they spend working on them. I built the application end-to-end using Next.js, TypeScript, MongoDB, Mongoose and Auth.js. The timer uses persistent server-side time logs, while the dashboard calculates productivity statistics and weekly activity from real database records.”**

### What I built

- Frontend UI and responsive layouts
- Authentication and signup flow
- Protected REST-style APIs
- MongoDB/Mongoose data models
- Task CRUD operations
- Persistent task timers
- Time-log management
- Timer synchronization
- Dashboard aggregation logic
- Productivity visualization
- Vercel deployment

---

## 🔮 Future Improvements

Potential future improvements include:

- 🤖 AI-assisted task creation
- 📊 Advanced weekly productivity analytics
- 🎯 Productivity goals
- 🔔 Task reminders
- 📅 Calendar integration
- 👥 Team collaboration
- 🔔 Browser notifications
- 📈 More detailed productivity reports

---

## 📌 Project Status

**ChronoTask is a deployed full-stack productivity and time-tracking application.**

Current functionality includes:

- Authentication
- Task management
- Task authorization
- Persistent time tracking
- Multi-tab timer synchronization
- Dashboard analytics
- Productivity visualization
- Protected REST APIs
- MongoDB persistence
- Production deployment on Vercel

The application is actively being refined with additional UI and productivity features.

---

## 👨‍💻 Author

**Bishal Pal**

Full-Stack Developer

---

## 📄 License

This project is intended for learning, portfolio, and demonstration purposes.
