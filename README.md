# TaskMaster — Advanced Full-Stack Task Management System

A responsive task management web application built with a Node.js + Express REST API and a MySQL database, featuring user authentication, task & category management, dashboard statistics, charts, notifications, profile management, and dark mode.

## Features

- **Authentication** — register, login, logout with JWT (7-day expiry) and bcrypt password hashing (10 rounds)
- **Tasks** — create, read, update, delete; title, description, priority, status, category, due date; overdue detection
- **Search & Filter** — search by title, filter by status/priority, sort by date (frontend)
- **Categories** — create, rename, delete; unique per user; tasks keep working when a category is deleted (SET NULL)
- **Dashboard** — live statistics (total, pending, in progress, completed, overdue), progress bar, Chart.js charts (status & priority), overdue list
- **Notifications** — automatic generation (task created / overdue / urgent), mark as read, no duplicates
- **Profile** — view/update name, email, avatar (URL validated); secure password change
- **Responsive UI** — mobile → desktop with Tailwind CSS, dark mode toggle, accessibility (focus rings, selection colors)

## Tech Stack

| Layer      | Technology                              |
| ---------- | --------------------------------------- |
| Frontend   | HTML5, CSS3, JavaScript (Fetch API), Tailwind CSS (CDN), Font Awesome, Chart.js |
| Backend    | Node.js, Express                        |
| Database   | MySQL 8.x                               |
| Auth       | JWT (jsonwebtoken), bcryptjs            |

## Project Structure

```
task-master/
├── server.js                  # Entry point, routes, error handling
├── config/
│   ├── db.js                  # MySQL connection pool
│   └── database.sql           # Database schema & seed data
├── middleware/
│   └── authMiddleware.js      # JWT verification
├── routes/
│   ├── authRoutes.js          # /api/auth (register, login, logout)
│   ├── taskRoutes.js          # /api/tasks
│   ├── categoryRoutes.js      # /api/categories
│   ├── dashboardRoutes.js     # /api/dashboard (statistics)
│   ├── notificationRoutes.js  # /api/notifications
│   └── userRoutes.js          # /api/user (profile)
├── views/                     # login, register, dashboard, profile (server-rendered pages)
├── public/
│   ├── css/style.css          # Core styling (dark mode, responsive, scrollbars)
│   ├── js/                    # api.js, auth.js, dashboard.js, main.js
│   └── images/
├── tests/
│   └── complete-test.js       # Full end-to-end test suite (92 checks)
├── start-mysql.bat            # Windows helper: start MySQL if not running
└── .env                       # Environment variables (NOT committed)
```

## Database Documentation

Schema is defined in [`config/database.sql`](config/database.sql). Import before first run:

```bash
mysql -u root -p < config/database.sql
```

**Tables:**

| Table         | Purpose                                    | Key relationships                                    |
| ------------- | ------------------------------------------ | ---------------------------------------------------- |
| `users`       | Accounts (name, email, password hash, avatar) | `id` referenced by all other tables               |
| `tasks`       | Task items                                 | `user_id` → users (`ON DELETE CASCADE`), `category_id` → categories (`ON DELETE SET NULL`) |
| `categories`  | User categories                            | `user_id` → users (`ON DELETE CASCADE`), unique per user/name |
| `notifications` | User notifications (task created / overdue / urgent) | `user_id` → users (`ON DELETE CASCADE`) |

All queries use **parameterized statements** (SQL-injection safe). Every user-owned row enforces ownership via `WHERE user_id = ?`.

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL 8.x running locally (Windows tip: run `start-mysql.bat`)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Create the database & tables
mysql -u root -p < config/database.sql

# 3. Create .env (see .env.example)
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=task_manager
JWT_SECRET=<64+ random hex characters>

# 4. Start the server
npm start
```

Open http://localhost:3000 — register a new account or log in with the seeded demo users.

### API Overview

| Method | Endpoint                 | Description                        | Auth |
| ------ | ------------------------ | ---------------------------------- | ---- |
| POST   | `/api/auth/register`     | Create account                     | —    |
| POST   | `/api/auth/login`        | Login → JWT token                  | —    |
| POST   | `/api/auth/logout`       | Invalidate session                 | ✓    |
| GET    | `/api/tasks`             | List my tasks                      | ✓    |
| POST   | `/api/tasks`             | Create task                        | ✓    |
| PUT    | `/api/tasks/:id`         | Update task                        | ✓    |
| DELETE | `/api/tasks/:id`         | Delete task                        | ✓    |
| GET    | `/api/categories`        | List my categories                 | ✓    |
| POST   | `/api/categories`        | Create category                    | ✓    |
| PUT    | `/api/categories/:id`    | Rename category                    | ✓    |
| DELETE | `/api/categories/:id`    | Delete category                    | ✓    |
| GET    | `/api/dashboard`         | Statistics + chart data            | ✓    |
| GET    | `/api/notifications`     | List my notifications              | ✓    |
| PUT    | `/api/notifications/:id/read` | Mark as read                   | ✓    |
| GET    | `/api/user/profile`      | View profile                       | ✓    |
| PUT    | `/api/user/profile`      | Update profile / change password   | ✓    |

## Running the Tests

Full end-to-end suite (92 checks: auth, tasks, categories, dashboard, notifications, profile, isolation, pages, UI artifacts):

```bash
# Server must be running on :3000 with the DB imported
npm start          # separate terminal
node tests/complete-test.js
```

The suite creates throwaway user accounts and cleans them up automatically.

## Deployment (Render)

Production **must use a cloud-accessible MySQL database** — never local MySQL.

1. **Provision a cloud MySQL** (Render has no managed MySQL; good options: Aiven free tier, Railway, TiDB Cloud). Note: host, port, user, password, database name.
2. **Create the schema** on the cloud DB — import [`config/database.sql`](config/database.sql) remotely (it contains `CREATE DATABASE IF NOT EXISTS task_manager`).
3. **Push to GitHub**, then in [Render.com](https://render.com): **New + → Blueprint** and select the `task-MASTER` repo — `render.yaml` is picked up automatically (build `npm install`, start `node server.js`).
4. **Provide secrets** in the Render service's **Environment** tab: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` (the blueprint marks them as `sync: false` so you set real values; `PORT` = `10000` is preset).

The service deploys and is reachable at `https://task-master.onrender.com`. The free plan sleeps after inactivity — the first request after a pause takes ~30–50s to wake up.

## Security Notes

- `.env` and `node_modules/` are excluded via `.gitignore` — never commit secrets
- Passwords are bcrypt-hashed; never returned by the API
- Input validation: title length, email format, priority/status enums, real calendar dates, avatar must be an http(s) URL
- Central error handling returns JSON for API routes; HTML 404 fallback for pages