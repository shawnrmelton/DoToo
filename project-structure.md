# Task Flow Manager - Development Setup

## Project Structure

```
task-flow-manager/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── projectController.js
│   │   │   ├── taskController.js
│   │   │   ├── scheduleController.js
│   │   │   └── calendarController.js
│   │   ├── models/
│   │   │   ├── Project.js
│   │   │   ├── Task.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── projects.js
│   │   │   ├── tasks.js
│   │   │   ├── schedule.js
│   │   │   └── calendar.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── validation.js
│   │   ├── services/
│   │   │   ├── scheduleService.js
│   │   │   └── googleCalendarService.js
│   │   ├── database/
│   │   │   └── connection.js
│   │   └── app.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Projects/
│   │   │   ├── Schedule/
│   │   │   ├── Settings/
│   │   │   └── Common/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Projects.jsx
│   │   │   └── Schedule.jsx
│   │   ├── hooks/
│   │   │   ├── useProjects.js
│   │   │   └── useSchedule.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   │   └── dateUtils.js
│   │   └── App.jsx
│   ├── package.json
│   └── index.html
└── README.md
```

## Tech Stack

### Backend
- **Node.js** + **Express** - API server
- **PostgreSQL** - Database for reliability and complex queries
- **Sequelize** - ORM for database management
- **Google Calendar API** - Calendar integration
- **JWT** - Authentication
- **Joi** - Input validation

### Frontend
- **React** + **Vite** - Fast development and modern React features
- **Tailwind CSS** - Styling (matches our prototype)
- **React Query** - Server state management
- **React Router** - Navigation
- **Lucide React** - Icons (same as prototype)

## Step 1: Initial Setup Commands

### 1. Create Project Directory
```bash
mkdir task-flow-manager
cd task-flow-manager
```

### 2. Backend Setup
```bash
mkdir backend
cd backend
npm init -y
npm install express cors helmet morgan dotenv sequelize pg pg-hstore
npm install bcryptjs jsonwebtoken joi
npm install googleapis
npm install --save-dev nodemon concurrently
```

### 3. Frontend Setup
```bash
cd ../
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install @tanstack/react-query axios react-router-dom
npm install lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## Step 2: Database Schema

### Core Tables
```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  google_calendar_token TEXT,
  work_schedule JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  priority VARCHAR(50) NOT NULL CHECK (priority IN ('immediate', 'urgent', 'usual', 'if you have time', 'do whenever')),
  category VARCHAR(50) NOT NULL CHECK (category IN ('professional', 'personal', 'home', 'social')),
  due_date DATE,
  has_sequential_tasks BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks table
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  estimated_hours DECIMAL(4,2) NOT NULL,
  actual_hours DECIMAL(4,2) DEFAULT 0,
  task_order INTEGER,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Calendar commits table (tracks what's been synced)
CREATE TABLE calendar_commits (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  commit_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  days_committed INTEGER NOT NULL,
  google_event_ids JSONB DEFAULT '[]'
);
```

## Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://username:password@localhost:5432/taskflow
JWT_SECRET=your-super-secret-jwt-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3001/auth/google/callback
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

## Development Scripts

### Backend package.json scripts
```json
{
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js",
    "db:migrate": "node src/database/migrate.js"
  }
}
```

### Frontend package.json scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

## Next Steps

1. **Set up the database** - Install PostgreSQL and create the database
2. **Build the backend API** - Start with basic CRUD operations
3. **Create the frontend shell** - Set up routing and basic components
4. **Implement core features** - Projects, tasks, scheduling logic
5. **Add Google Calendar integration** - OAuth and sync functionality
6. **Polish and deploy** - Error handling, testing, deployment

## Quick Start Commands

After setting up the environment:

```bash
# Start backend
cd backend
npm run dev

# Start frontend (in new terminal)
cd frontend
npm run dev
```

This will give you:
- Backend API running on http://localhost:3001
- Frontend app running on http://localhost:5173
- Database on default PostgreSQL port (5432)

Ready to start with the backend API setup?