# TaskHive - Task Management System

A production-grade, full-stack, responsive Task Management application built with React (Vite), Node.js, Express, PostgreSQL, and TypeScript.

---

## Live Links & Deployment Summary

- **Live Frontend App**: [https://koncepthive-task-management-system.vercel.app/](https://koncepthive-task-management-system.vercel.app/)
- **Live Backend API**: [https://koncepthivetaskmanagementsystem-production.up.railway.app/](https://koncepthivetaskmanagementsystem-production.up.railway.app/)
- **Frontend Hosting**: Vercel
- **Backend & Database Hosting**: Railway (Managed Node.js + Managed PostgreSQL)

---

## Project Overview

TaskHive is designed to manage daily tasks, workflows, and productivity. It features full CRUD capabilities, JWT-based authentication with HTTP-only silent refresh tokens, interactive dashboard metrics, searching, filtering, sorting, pagination, client/server Zod validation, and dark mode support.

### Key Features
- **Authentication**: JWT token authorization paired with HTTP-only cookies for silent refresh handling.
- **Dashboard Overview**: Real-time metrics tracking Total, Pending, In Progress, Completed, and Overdue tasks.
- **Task CRUD**: Create, read, update, and delete tasks seamlessly via modal dialogs.
- **Search & Filters**: Instant search by task title, filtered by priority or status.
- **Sorting & Pagination**: Responsive paginated table/card view sorted by creation date or due date.
- **Data Validation**: Strict schema validation using Zod on both client and server layers.
- **Theme Support**: Dark mode and light mode toggles using CSS custom variants.
- **Containerization**: Included Docker Compose setup for local containerized development.

---

## Technology Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS v4, React Hook Form, Zod, Axios, Lucide Icons, React Hot Toast
- **Backend**: Node.js, Express.js, TypeScript, PostgreSQL (`pg`), JSON Web Tokens (JWT), Zod, Jest, `ts-jest`
- **Infrastructure / DevOps**: Docker, Docker Compose, Vercel, Railway

---

## Environment Variables

#### Backend Environment Variables (`backend/.env`)
env
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/task_management
JWT_SECRET=super_secret_jwt_key
JWT_REFRESH_SECRET=super_secret_refresh_key
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

#### Frontend Environment Variables (frontend/.env)

VITE_API_URL=http://localhost:5000/api
Note: In production on Vercel, set VITE_API_URL to https://koncepthivetaskmanagementsystem-production.up.railway.app/api.


## Database Setup

The SQL DDL file defining table structures is located at database/schema.sql.
Tables consist of users and tasks with foreign keys and default timestamps.
To seed default assessment credentials (admin@test.com / 123456), run:

cd backend
npm run seed

## Installation & Local Execution Instructions

Prerequisites

Node.js (v18 or higher)
PostgreSQL (or Docker Desktop)

### 1. Database Setup (Docker Alternative)

docker-compose up -d

### 2. Backend Setup

cd backend
npm install
npm run seed
npm run dev
The backend server starts on http://localhost:5000.

### 3. Frontend Setup

cd frontend
npm install
npm run dev
The frontend app starts on http://localhost:5173.

## Running Backend Unit Tests

Unit tests covering validation logic and Zod error handling are implemented using Jest:

cd backend
npm run test

## API Documentation

### Authentication Endpoints

POST /api/auth/login: Authenticates the user and returns a short-lived access token along with an HTTP-only refresh cookie.

POST /api/auth/refresh: Silently issues a new access token using the refresh cookie.

POST /api/auth/logout: Clears the HTTP-only authentication cookies.

### Task Management Endpoints (Protected)

GET /api/tasks/stats: Fetches the aggregate count of tasks grouped by status and overdue state. (Query Parameters: None)

GET /api/tasks: Fetches a paginated list of tasks. (Query Parameters: page, limit, search, status, priority, sortBy)

GET /api/tasks/:id: Fetches details for a single task by its ID. (Query Parameters: None)

POST /api/tasks: Creates a new task. (Requires payload body)

PUT /api/tasks/:id: Updates an existing task by its ID. (Requires payload body)

DELETE /api/tasks/:id: Removes a task by its ID. (Query Parameters: None)

## Assessment Default Credentials

Email: admin@test.com
Password: 123456

## Assumptions Made

Authentication State Persistence: Access tokens are kept in-memory for security, while silent auto-refresh hooks maintain state across browser reloads via HTTP-only cookies.

Overdue Task Logic: A task is considered overdue if its due_date is earlier than today's date and its status is not set to Completed.

Database Schema Enforcement: Title is required, Due Date cannot be in the past at creation/update time, Priority must be one of ['Low', 'Medium', 'High'], and Status must be one of ['Pending', 'In Progress', 'Completed'].

## Known Limitations

User Scope: The application currently targets a single-tenant or shared task workflow; task records are globally managed across authenticated users.

Third-Party Cookies in Safari: Certain private browser modes block third-party cross-site HTTP-only cookies unless custom subdomains are configured across Vercel and Railway.