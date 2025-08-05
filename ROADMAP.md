# 🗺️ Roadmap - Fullstack Todo List (local)

🎯 **Final Goal**: Local app with separated frontend and backend, authentication (login/password + GitHub), SQLite database, clean interface, each user managing their private tasks.

---

## 🧱 1. Initial Setup
- [ ] Create a `my-todo-app` folder with:
  - [ ] `/backend`
  - [ ] `/frontend`
- [ ] Install Git and initialize a local repo

## 🔧 2. Backend - Fastify + TypeScript
- [ ] Initialize a Node project in `/backend`
- [ ] Install TypeScript, Fastify and types
- [ ] Create a Fastify server with a first `GET /ping` returning "pong"
- [ ] Configure the project to compile into `dist/` (TS → JS)
- [ ] Add a simple logging system

## 🔐 3. Authentication
- [ ] Create a `users` table in SQLite: `id`, `username`, `email`, `password_hash`
- [ ] Implement registration (`POST /register`)
- [ ] Implement login (`POST /login`) with JWT (token) generation
- [ ] Middleware to protect private routes (authentication required)
- [ ] Integrate **GitHub OAuth** for GitHub login

## 🗃️ 4. Tasks - CRUD
- [ ] Create a `tasks` table:
  - `id`, `title`, `description`, `is_done`, `user_id`
- [ ] Route `GET /tasks`: fetch tasks for the authenticated user
- [ ] Route `POST /tasks`: add a new task
- [ ] Route `PUT /tasks/:id`: update a task
- [ ] Route `DELETE /tasks/:id`: delete a task

## 💽 5. SQLite Database
- [ ] Create a `database.db` file
- [ ] Create a table setup script
- [ ] Write all SQL queries manually
- [ ] Add a `db.ts` module to centralize database access

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