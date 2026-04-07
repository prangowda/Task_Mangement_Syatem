# Task Management System

A full-stack Task Management System built for a Software Engineering assessment.
It includes a secure Node.js/TypeScript backend API and a responsive Next.js/TypeScript frontend where users can register, log in, and manage personal tasks.

## Tech Stack

- Backend: Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, JWT, bcrypt
- Frontend: Next.js (App Router), React, TypeScript, Axios, Tailwind CSS, React Hook Form, Zod, React Hot Toast

## Project Structure

```text
Task Management System/
  backend/   # Express + Prisma API
  frontend/  # Next.js web app
```

## Features

### Authentication & Security

- User registration, login, logout
- JWT-based authentication:
  - Access token (short-lived)
  - Refresh token (long-lived)
- Password hashing with bcrypt
- Protected task routes (user-scoped data)

### Task Management

- Create, read, update, delete personal tasks
- Toggle task status (`PENDING` <-> `COMPLETED`)
- List tasks with:
  - Pagination
  - Status filtering
  - Title search

### Frontend UX

- Login and registration pages
- Auth session handling with automatic access-token refresh
- Task dashboard with responsive layout (mobile + desktop)
- Add/Edit/Delete/Toggle task UI flows
- Toast notifications for user actions

## API Endpoints

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`

### Tasks (Protected)

- `GET /tasks` (supports `page`, `limit`, `status`, `search`)
- `POST /tasks`
- `GET /tasks/:id`
- `PATCH /tasks/:id`
- `DELETE /tasks/:id`
- `PATCH /tasks/:id/toggle`

## Local Setup

## 1) Backend Setup (`backend/`)

### Prerequisites

- Node.js 18+ (recommended)
- PostgreSQL running locally

### Install

```bash
cd backend
npm install
```

### Environment

Create a `.env` file in `backend/` (or copy from `.env.example`) and configure:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/task_manager?schema=public"
JWT_ACCESS_SECRET=your_super_secret_access_key_change_in_production
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_in_production
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
ALLOWED_ORIGINS=http://localhost:3000
```

### Database

```bash
npm run db:generate
npm run db:migrate
```

### Run backend

```bash
npm run dev
```

Backend will be available at `http://localhost:5000`  
Health check: `http://localhost:5000/health`

## 2) Frontend Setup (`frontend/`)

### Install

```bash
cd frontend
npm install
```

### Environment

Create `.env.local` in `frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Run frontend

```bash
npm run dev
```

Frontend will be available at `http://localhost:3000`.

## Scripts

### Backend (`backend/package.json`)

- `npm run dev` - run API in development with hot reload
- `npm run build` - compile TypeScript to `dist/`
- `npm run start` - run compiled production build
- `npm run db:migrate` - run Prisma migrations
- `npm run db:generate` - generate Prisma client
- `npm run db:studio` - open Prisma Studio
- `npm run db:push` - push schema directly to DB

### Frontend (`frontend/package.json`)

- `npm run dev` - start Next.js dev server
- `npm run build` - production build
- `npm run start` - run production server
- `npm run lint` - run ESLint

## Assessment Requirement Mapping

### Mandatory Backend API (Node.js + TypeScript)

- Authentication (`/auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout`) implemented
- JWT access/refresh token flow implemented
- Password hashing with bcrypt implemented
- Task CRUD (`/tasks`, `/tasks/:id`, `/tasks/:id/toggle`) implemented
- Pagination, filtering, and search on `GET /tasks` implemented
- Prisma ORM + SQL database integration implemented
- Validation and HTTP error handling implemented

### Track A: Web Frontend (Next.js + TypeScript)

- Login/Register pages integrated with backend auth
- Token storage + refresh flow to keep users logged in
- Dashboard with searchable/filterable task list
- Responsive UI for desktop and mobile
- Full task CRUD + status toggle from UI
- Toast notifications for successful operations

## Notes

- `backend/.env` should not be committed with real secrets.
- Use strong JWT secrets in production.
- Set production CORS origins via `ALLOWED_ORIGINS`.
