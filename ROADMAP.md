# 🗺️ Roadmap - Fullstack Todo List (local)

🎯 **Final Goal**: Local app with separated frontend and backend, authentication (login/password + GitHub), SQLite database, clean interface, each user managing their private tasks.

---

## 🧱 1. Initial Setup
- [x] Create a new directory for the project
  - [x] `/backend`
  - [x] `/frontend`
- [x] Install Git and initialize a local repo

## 🔧 2. Backend - Fastify + TypeScript
- [x] Initialize a Node project in `/backend`
- [x] Install TypeScript, Fastify and types
- [x] Create a Fastify server with a first `GET /ping` returning "pong"
- [x] Configure the project to compile into `dist/` (TS → JS)
- [x] Add a simple logging system

## 💽 3. SQLite Database
- [x] Create a `database.db` file
- [x] Create a table setup script
- [x] Write all SQL queries manually
- [x] Add a `db.ts` module to centralize database access

## 🔐 4. Authentication
- [x] Create a `users` table in SQLite: `id`, `username`, `email`, `password_hash`
- [x] Implement registration (`POST /register`)
- [ ] Implement login (`POST /login`) with JWT (token) generation
- [ ] Middleware to protect private routes (authentication required)
- [ ] Integrate **GitHub OAuth** for GitHub login

## 🗃️ 5. Tasks - CRUD
- [ ] Create a `tasks` table:
  - `id`, `title`, `description`, `is_done`, `user_id`
- [ ] Route `GET /tasks`: fetch tasks for the authenticated user
- [ ] Route `POST /tasks`: add a new task
- [ ] Route `PUT /tasks/:id`: update a task
- [ ] Route `DELETE /tasks/:id`: delete a task

## 🌐 6. Frontend - HTML + Tailwind + TypeScript
- [ ] Initialize frontend in `/frontend`
- [ ] Setup Tailwind CSS
- [ ] Create pages:
  - [ ] Login page
  - [ ] Register page
  - [ ] Main task list page
- [ ] Manage user authentication state (via token)
- [ ] Call backend with `fetch` (REST API)

## 🔁 7. Frontend/Backend Integration
- [ ] On login/register → send user info to backend
- [ ] Retrieve token → store it (e.g., localStorage)
- [ ] Use token to access user tasks
- [ ] Display / add / update / delete tasks from the frontend

## 🎀 8. Optional Improvements
- [ ] Filter completed / incomplete tasks
- [ ] Sort tasks by date or alphabetically
- [ ] Add light/dark theme
- [ ] Logout button
- [ ] Client-side form validation
- [ ] Tailwind animations
