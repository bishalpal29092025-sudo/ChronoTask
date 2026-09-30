# ChronoTask

> A full-stack task management and time tracking application built with Next.js, TypeScript, MongoDB, and Mongoose.

ChronoTask helps users manage their tasks, track time spent on individual tasks, and understand their productivity through a real-time dashboard.

---

## ✨ Features

- 🔐 Secure user authentication
- 👤 User-specific task access
- 📝 Create, update, and delete tasks
- 📌 Task status management
  - Pending
  - In Progress
  - Completed
- ⏱️ Real-time task time tracking
- 💾 Persistent timer sessions using MongoDB
- 🔄 Multi-tab timer synchronization
- 🚫 Server-side prevention of multiple active timers
- 📊 7-day productivity chart
- 📅 Daily activity timeline
- 📈 Productivity statistics
- 🔒 Protected API routes
- ✅ Request validation and error handling
- 📱 Responsive dark-themed UI
- 🎨 Modern animated dashboard interface

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

### Development & Deployment

- Git
- GitHub
- Vercel
- MongoDB Atlas

---

## 🏗️ Architecture

    ┌───────────────────────────────┐
    │          Next.js UI           │
    │      React + TypeScript       │
    └───────────────┬───────────────┘
                    │
                    ▼
    ┌───────────────────────────────┐
    │       Next.js Route Handlers   │
    │            REST APIs           │
    └───────────────┬───────────────┘
                    │
          ┌─────────┼─────────┐
          │         │         │
          ▼         ▼         ▼
       Auth API  Task API  Timer API
          │         │         │
          └─────────┼─────────┘
                    │
                    ▼
    ┌───────────────────────────────┐
    │            Mongoose           │
    └───────────────┬───────────────┘
                    │
                    ▼
    ┌───────────────────────────────┐
    │            MongoDB            │
    │      Users / Tasks / Logs     │
    └───────────────────────────────┘

---

## ⏱️ Timer Architecture

ChronoTask uses MongoDB as the source of truth for active timers.

When a user starts a timer:

    User clicks Start
           ↓
    POST /api/tasks/[id]/timer
           ↓
    Server verifies authentication
           ↓
    Server verifies task ownership
           ↓
    Server checks for existing active timer
           ↓
    TimeLog created in MongoDB
           ↓
    startedAt stored on the server

The frontend then calculates the live elapsed time using the stored `startedAt` timestamp.

This approach allows the timer to:

- Survive page refreshes
- Survive navigation
- Remain synchronized across browser tabs
- Continue running independently of React state
- Maintain accurate elapsed time using server timestamps

The backend also prevents a user from creating multiple active timers simultaneously.

---

## 🔄 Multi-Tab Timer Synchronization

ChronoTask periodically synchronizes the active timer with the backend.

    Browser Tab 1
          │
          │ Start Timer
          ▼
       MongoDB
          │
          ▼
    Active TimeLog
          │
          ▼
    /api/tasks/timer/active
          │
       ┌──┴──┐
       ▼     ▼
     Tab 1  Tab 2

This ensures that when a timer is started or stopped in one browser tab, other tabs belonging to the same authenticated user can detect the updated timer state.

---

## 🔐 Authentication & Authorization

ChronoTask uses Auth.js with credential-based authentication.

User passwords are securely hashed using bcrypt before being stored in MongoDB.

Protected API routes verify the authenticated user's session before accessing application data.

Task and time-log operations are scoped to the authenticated user's ID.

For example:

    {
      _id: taskId,
      userId: session.user.id
    }

This prevents users from accessing another user's tasks by simply changing a task ID in a request.

Unauthenticated requests to protected endpoints return:

    401 Unauthorized

---

## 📊 Dashboard

The ChronoTask dashboard provides an overview of the user's productivity.

### Dashboard Statistics

- Total Tasks
- Completed Tasks
- In Progress Tasks
- Tracked Time Today

### Recent Tasks

Displays the user's most recently created tasks along with their current status.

### Today's Activity

Displays time-tracking sessions from the current day, including:

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

    POST /api/auth/signup
    POST /api/auth/[...nextauth]

### Tasks

    GET    /api/tasks
    POST   /api/tasks
    PUT    /api/tasks/[id]
    DELETE /api/tasks/[id]

### Timer

    POST /api/tasks/[id]/timer
    POST /api/tasks/[id]/timer/stop
    GET    /api/tasks/timer/active

### Time Logs

    GET /api/tasks/timelogs

### Dashboard

    GET /api/dashboard

Protected endpoints require an authenticated session.

---

## 🗄️ Data Models

### User

    User
    ├── _id
    ├── name
    ├── email
    ├── password
    ├── createdAt
    └── updatedAt

### Task

    Task
    ├── _id
    ├── userId
    ├── title
    ├── description
    ├── status
    ├── createdAt
    └── updatedAt

### TimeLog

    TimeLog
    ├── _id
    ├── taskId
    ├── userId
    ├── startedAt
    ├── endedAt
    ├── createdAt
    └── updatedAt

---

## 📁 Project Structure

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

---

## 🚀 Getting Started

### 1. Clone the repository

    git clone <your-repository-url>
    cd chronotask

### 2. Install dependencies

    npm install

### 3. Configure environment variables

Create a `.env.local` file in the project root.

    MONGODB_URI=your_mongodb_connection_string
    AUTH_SECRET=your_auth_secret

Do not commit `.env.local` to Git.

### 4. Start the development server

    npm run dev

Open the application at:

    http://localhost:3000

---

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB database connection string |
| `AUTH_SECRET` | Secret used by Auth.js for session security |

Never commit production credentials or `.env.local` to the repository.

---

## 🧪 Testing

TypeScript validation:

    npx tsc --noEmit

The application has been manually tested for:

- User authentication
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

ChronoTask protects API routes using authenticated sessions.

### Unauthenticated requests

Protected endpoints return:

    401 Unauthorized

### Multiple active timers

If a user attempts to start another timer while an active timer already exists, the server returns:

    409 Conflict

Example message:

    You already have an active timer.

### Task ownership

Task operations verify both:

    task ID

and:

    authenticated user ID

This ensures that users can only access and modify their own tasks.

---

## 🎯 Design Principles

### Server-Side Source of Truth

Important application state, including active timers and completed time sessions, is persisted on the server.

### User Data Isolation

Tasks and time logs are always associated with the authenticated user's ID.

### Real-Time Experience

The frontend provides a live timer display while periodically synchronizing the active timer with the backend.

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

### Persistent Timer

Timer state is persisted in MongoDB using `TimeLog` documents instead of relying only on browser state.

### Server-Side Timer Validation

The backend checks for an existing active timer before creating a new timer session.

### Multi-Tab Synchronization

Multiple browser tabs periodically query the active timer endpoint so that timer state stays synchronized.

### Protected Data Access

Database queries use the authenticated user's ID to prevent cross-user data access.

### Real-Time Dashboard Data

Dashboard statistics and charts are calculated from actual task and time-log records.

---

## 🚀 Deployment

ChronoTask is designed to be deployed using:

- Vercel for the Next.js application
- MongoDB Atlas for the database

Production environment variables:

    MONGODB_URI=your_production_mongodb_uri
    AUTH_SECRET=your_production_auth_secret

These values should be configured through the deployment platform's environment-variable settings.

Never commit production secrets to GitHub.

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

ChronoTask currently provides the core functionality of a full-stack productivity and time-tracking application, including:

- Authentication
- Task management
- Task authorization
- Persistent time tracking
- Multi-tab synchronization
- Dashboard analytics
- Productivity visualization
- Protected REST APIs
- MongoDB persistence

The project is being prepared for production deployment.

---

## 👨‍💻 Author

**Bishal Pal**

Full-Stack Developer

---

## 📄 License

This project is intended for learning, portfolio, and demonstration purposes.