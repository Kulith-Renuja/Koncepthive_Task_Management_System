# Task Management System (TaskHive)

A full-stack, responsive Task Management System built with React, Node.js, Express, PostgreSQL, and TypeScript.

---

## Features

- **Authentication**: JWT-based login/logout with secure HTTP-only refresh tokens.
- **Dashboard Metrics**: Live task summaries (Total, Pending, In Progress, Completed, Overdue).
- **Task Management (CRUD)**: Create, view, update, and delete tasks.
- **Search & Filters**: Search by title, filter by status and priority.
- **Sorting & Pagination**: Sort by creation date or due date with paginated list views.
- **Form Validation**: Strict schema validation with Zod on both client and server (Title required, Due date $\ge$ today, Priority required, Status required).
- **Responsive UI & Dark Mode**: Mobile, tablet, and desktop viewports with dynamic dark theme support.
- **Bonus Features**: Docker support, Unit testing with Jest, Toast notifications, Silent refresh tokens.

---

## Tech Stack

- **Frontend**: React (Vite), TypeScript, Tailwind CSS v4, React Hook Form, Zod, Lucide Icons, React Hot Toast
- **Backend**: Node.js, Express, TypeScript, PostgreSQL (`pg`), JWT, Zod, Jest
- **Deployment**: Vercel (Frontend), Railway (Backend & PostgreSQL)

---

## Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/task_management
JWT_SECRET=super_secret_jwt_key
JWT_REFRESH_SECRET=super_secret_refresh_key
NODE_ENV=development

Installation & Local Setup
1. Database Setup
Start a local PostgreSQL database or run the included Docker Compose configuration:

Bash
docker-compose up -d
2. Backend Setup
Bash
cd backend
npm install
npm run seed  # Seeds admin@test.com / 123456
npm run dev
3. Frontend Setup
Bash
cd frontend
npm install
npm run dev
Default Credentials
Email: admin@test.com

Password: 123456

Running Unit Tests
Bash
cd backend
npm run test