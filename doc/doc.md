 TaskMaster — Advanced Full-Stack Task Management System

1. Project Overview

TaskMaster is a modern full-stack web application designed to help users create, organize, track, and manage their daily tasks through an interactive dashboard.

The project demonstrates a complete web development workflow, including:

- Frontend development.
- Backend development.
- REST API development.
- Relational database design.
- SQL queries.
- Authentication.
- CRUD operations.
- Responsive UI/UX.
- Cloud deployment.

The application is designed as a complete Full-Stack project suitable for a professional portfolio and internship submission.
///
---

2. Project Goals

The main goals of TaskMaster are:

- Build a complete full-stack web application.
- Practice frontend and backend integration.
- Work with a relational MySQL database.
- Use SQL for database operations.
- Build and consume REST APIs.
- Implement user authentication.
- Implement complete CRUD operations.
- Create a responsive and modern dashboard.
- Deploy the application online.

---
/////
3. Main Features

🔐 Authentication

Users can:

- Create a new account.
- Log in.
- Log out. 
- Manage their profile.
- Access only their own tasks.

---

📋 Task Management

Users can:

- Create tasks.
- View tasks.
- Edit tasks.
- Delete tasks.
- Change task status.
- Set task priority.
- Add descriptions.
- Set due dates.

Task Status

- Pending
- In Progress
- Completed

Task Priority

- Low
- Medium
- High
- Urgent

---

🔎 Search & Filtering

Users can:

- Search tasks by title.
- Filter by status.
- Filter by priority.
- Sort tasks by due date.
- Quickly identify overdue tasks.

---

📊 Dashboard

The dashboard displays:

- Total Tasks.
- Completed Tasks.
- Pending Tasks.
- In Progress Tasks.
- Overdue Tasks.
- Completion percentage.

Example:

Total Tasks       24
Completed         15
In Progress        6
Overdue            3
Progress          62%

---

📈 Statistics & Charts

The dashboard includes visual statistics showing:

- Completed tasks.
- Pending tasks.
- In-progress tasks.
- Task priorities.

Charts help users understand their productivity at a glance.

---

🔔 Notifications

The system can notify users about:

- Upcoming deadlines.
- Overdue tasks.
- Important or urgent tasks.

---

👤 User Profile

Users can manage:

- Name.
- Email.
- Profile picture.
- Password.

---

🌙 Dark Mode

Users can switch between:

- Light Mode.
- Dark Mode.

The selected theme should be applied consistently across the application.

---

📱 Responsive Design

The application works on:

- Desktop.
- Laptop.
- Tablet.
- Mobile.

The interface uses responsive layouts with:

- CSS Flexbox.
- CSS Grid.
- Tailwind CSS responsive utilities.

---

4. Technology Stack

Frontend

- HTML5
- CSS3
- JavaScript
- Tailwind CSS
- FontAwesome
- Fetch API

Backend

- Node.js
- Express.js

Database

- MySQL
- SQL

Development & Deployment

- Git
- GitHub
- Render

---
/////
5. UI/UX Design

The application follows a modern and clean dashboard style.

Color Palette

Element| Color
Primary| "#2563EB"
Background| "#F8FAFC"
Cards| "#FFFFFF"
Completed| "#10B981"
In Progress| "#F59E0B"
Urgent| "#EF4444"

UI Characteristics

- Rounded cards.
- Soft shadows.
- Clear typography.
- Consistent spacing.
- Smooth transitions.
- Interactive buttons.
- Status badges.
- Responsive navigation.
- Clean dashboard layout.

---
////
6. Application Pages

6.1 Home Page

File:

views/index.html

Contains:

- TaskMaster branding.
- Project introduction.
- Login button.
- Register button.
- Main features.
- Call-to-action section.

---

6.2 Login Page

File:

views/login.html

Fields:

- Email.
- Password.

Functions:

- Validate credentials.
- Send login request.
- Redirect authenticated users to Dashboard.

---

6.3 Register Page

File:

views/register.html

Fields:

- Name.
- Email.
- Password.

Functions:

- Validate input.
- Create a new user.
- Store user information in MySQL.
- Redirect to login.

---

6.4 Dashboard

File:

views/dashboard.html

Contains:

Sidebar

- Dashboard.
- My Tasks.
- Profile.
- Logout.

Header
 - Welcome message.
- User avatar.
- Notifications.
- Theme toggle.

Statistics

- Total tasks.
- Completed.
- Pending.
- In Progress.
- Overdue.

Task Section

- Search.
- Filters.
- Add Task button.
- Task list.
- Edit button.
- Delete button.
- Status controls.

---

6.5 Profile Page

Allows users to view and update their account information.

---
///
7. Project Structure

my-task-manager/
│
├── public/
│   │
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   ├── main.js
│   │   ├── api.js
│   │   ├── auth.js
│   │   └── dashboard.js
│   │
│   └── images/
│       └── avatar.png
│
├── views/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   └── profile.html
│
├── config/
│   └── db.js
│
├── routes/
│   ├── authRoutes.js
│   ├── taskRoutes.js
│   ├── userRoutes.js
│   └── notificationRoutes.js
│
├── middleware/
│   └── authMiddleware.js
│
├── .env
├── .gitignore
├── package.json
└── server.js

---

8. Frontend Architecture

The frontend is responsible for:

- Displaying pages.
- Handling forms.
- Validating user input.
- Sending API requests.
- Receiving API responses.
- Updating the UI dynamically.
- Managing filters.
- Managing dark mode.
- Displaying notifications.

The frontend communicates with the backend using the Fetch API.

Example:

User Action
     ↓
JavaScript
     ↓
Fetch API
     ↓
Express REST API
     ↓
JSON Response
     ↓
Update UI

---
/////
9. Backend Architecture

The backend is built using Node.js + Express.js.

It is responsible for:

- Handling HTTP requests.
- Authentication.
- API routes.
- Input validation.
- Database communication.
- CRUD operations.
- Returning JSON responses.

Architecture:

Client
  ↓
Express Server
  ↓
Middleware
  ↓
Routes
  ↓
MySQL Queries
  ↓
Database
  ↓
JSON Response

---
/////
10. REST API

Authentication

Register

POST /api/auth/register

Creates a new user.

Login

POST /api/auth/login

Authenticates the user.

Logout

POST /api/auth/logout

Ends the user session.

---

Tasks

Get Tasks

GET /api/tasks

Returns the authenticated user's tasks.

Create Task

POST /api/tasks

Creates a new task.

Update Task

PUT /api/tasks/:id

Updates an existing task.

Delete Task

DELETE /api/tasks/:id

Deletes a task.

---

Profile

Get Profile

GET /api/profile

Returns user information.

Update Profile

PUT /api/profile

Updates user information.

---

Dashboard

Get Statistics

GET /api/dashboard/stats

Returns dashboard statistics.

---

Notifications

Get Notifications

GET /api/notifications

Returns user notifications.

Mark as Read

PUT /api/notifications/:id

Marks a notification as read.

---
////
11. Database Design

The application uses a relational MySQL database.

Main tables:

users
tasks
categories
notifications
////
---

12. Users Table

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
/////
---

13. Categories Table

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    user_id INT NOT NULL,

    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

Example categories:

- Work
- Study
- Personal
- Urgent
/////
---

14. Tasks Table

CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category_id INT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status ENUM('pending', 'in_progress', 'completed')
        DEFAULT 'pending',
    priority ENUM('low', 'medium', 'high', 'urgent')
        DEFAULT 'medium',
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

    FOREIGN KEY (category_id)
    REFERENCES categories(id)
    ON DELETE SET NULL
);
/////
---

15. Notifications Table
 CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);
///////
---

16. Database Relationships

                    ┌──────────────┐
                    │    USERS     │
                    └──────┬───────┘
                           │
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼
        ┌─────────┐   ┌────────────┐  ┌───────────────┐
        │  TASKS  │   │ CATEGORIES │  │ NOTIFICATIONS │
        └────┬────┘   └────────────┘  └───────────────┘
             │
             └──── category_id

Relationships

- One user → many tasks.
- One user → many categories.
- One user → many notifications.
- One category → many tasks.
- Each task belongs to one user.
- Each task can belong to one category.

---

17. SQL Operations

The backend will use SQL operations such as:

SELECT

Retrieve tasks:

SELECT *
FROM tasks
WHERE user_id = ?;

INSERT

Create a task:

INSERT INTO tasks
(user_id, title, description, status, priority)
VALUES (?, ?, ?, ?, ?);

UPDATE

Update a task:

UPDATE tasks
SET title = ?, status = ?, priority = ?
WHERE id = ? AND user_id = ?;

DELETE

Delete a task:

DELETE FROM tasks
WHERE id = ? AND user_id = ?;

JOIN

Retrieve tasks with their categories:

SELECT tasks.*, categories.name AS category_name
FROM tasks
LEFT JOIN categories
ON tasks.category_id = categories.id
WHERE tasks.user_id = ?;

GROUP BY

Dashboard statistics:

SELECT status, COUNT(*) AS total
FROM tasks
WHERE user_id = ?
GROUP BY status;

This demonstrates practical use of SQL and relational database concepts.

---
//////
18. Authentication & Security

The application should protect user data.

Security considerations include:

- Password hashing.
- Authentication middleware.
- Protected API routes.
- Environment variables.
- Input validation.
- User ownership checks.

A user must only be able to access or modify their own tasks.

For example:

User A
  ↓
Can access
  ↓
User A's Tasks

User A
  X
Cannot access
  ↓
User B's Tasks
/////
---

19. Environment Variables

Sensitive configuration is stored in ".env".

Example:

PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=task_manager

The ".env" file must not be uploaded to GitHub.
//////
---

20. ".gitignore"

node_modules/
.env

This prevents dependencies and sensitive configuration from being committed.

---

21. Local Setup

Step 1 — Install Node.js

Verify:

node -v
npm -v

Step 2 — Install Dependencies

npm install

Step 3 — Create Database

CREATE DATABASE task_manager;

Step 4 — Create Tables

Run the SQL table creation scripts.

Step 5 — Configure ".env"

Add MySQL credentials.

Step 6 — Start Server

node server.js

Open:

http://localhost:3000

---
///////
22. Application Workflow

The complete system works as follows:

                USER
                 │
                 ▼
            FRONTEND
        HTML/CSS/JavaScript
                 │
                 ▼
             FETCH API
                 │
                 ▼
          EXPRESS.JS API
                 │
          ┌──────┴──────┐
          ▼             ▼
    AUTH MIDDLEWARE    ROUTES
                          │
                          ▼
                       SQL
                          │
                          ▼
                       MYSQL
                          │
                          ▼
                    JSON RESPONSE
                          │
                          ▼
                      FRONTEND

---
///////
23. Example: Creating a Task

When the user clicks Add Task:

1. User fills the task form.
 2. JavaScript validates the form.
3. Fetch sends POST request.
4. Express receives the request.
5. Authentication middleware verifies the user.
6. Task route processes the request.
7. SQL INSERT query runs.
8. MySQL stores the task.
9. Backend returns JSON response.
10. Frontend updates the dashboard.

---

24. Testing

Authentication

- [ ] Registration works.
- [ ] Login works.
- [ ] Logout works.
- [ ] Invalid credentials are handled.
- [ ] Empty fields are validated.

Tasks

- [ ] Create task.
- [ ] View tasks.
- [ ] Edit task.
- [ ] Delete task.
- [ ] Change status.
- [ ] Change priority.
- [ ] Set due date.
- [ ] Search tasks.
- [ ] Filter tasks.
- [ ] Detect overdue tasks.

Dashboard

- [ ] Statistics are correct.
- [ ] Charts display correctly.
- [ ] Notifications work.
- [ ] Progress percentage is correct.

Database

- [ ] MySQL connection works.
- [ ] Users are stored correctly.
- [ ] Tasks are stored correctly.
- [ ] Relationships work.
- [ ] JOIN queries work.
- [ ] User data is isolated correctly.

UI

- [ ] Desktop layout works.
- [ ] Tablet layout works.
- [ ] Mobile layout works.
- [ ] Dark mode works.
- [ ] Navigation works.
- [ ] Buttons work.

---

25. Git & GitHub

Initialize the repository:

git init

Add files:

git add .

Create commit:

git commit -m "Initial TaskMaster project"

Set main branch:

git branch -M main

Connect GitHub repository:

git remote add origin YOUR_GITHUB_REPOSITORY

Push:

git push -u origin main

---

26. Deployment — Render

The backend can be deployed using Render.

Steps

1. Create a Render account.
2. Connect GitHub.
3. Create a new Web Service.
4. Select the TaskMaster repository.
5. Configure the service.

Build Command

npm install

Start Command

node server.js

---

27. Production Database

The deployed application requires a cloud-accessible MySQL database.

Render environment variables should contain:

PORT
DB_HOST
DB_USER
DB_PASSWORD
DB_NAME

The application will then connect to the production database instead of the local MySQL database.

---

28. Final Architecture

                         TASKMASTER
                             │
              ┌──────────────┴──────────────┐
              │                             │
          FRONTEND                       BACKEND
              │                             │
     HTML / CSS / JS                 Node.js / Express
              │                             │
        Tailwind CSS                    REST API
              │                             │
              └──────────────┬──────────────┘
                             │
                            SQL
                             │
                             ▼
                         MySQL
                             │
                             ▼
                      Cloud Database
                             │
                             ▼
                         Render
                             │
                             ▼
                       Live Website

---

29. Final Project Checklist

Frontend

- [ ] Home page.
- [ ] Login page.
- [ ] Register page.
- [ ] Dashboard.
- [ ] Profile page.
- [ ] Task management UI.
- [ ] Search.
- [ ] Filters.
- [ ] Notifications.
- [ ] Charts.
- [ ] Dark mode.
- [ ] Responsive design.

Backend

- [ ] Express server.
- [ ] Authentication.
- [ ] Authentication middleware.
- [ ] User routes.
- [ ] Task routes.
- [ ] Notification routes.
- [ ] REST API.
- [ ] CRUD operations.
- [ ] Input validation.
- [ ] Error handling.

Database

- [ ] MySQL database.
- [ ] Users table.
- [ ] Tasks table.
- [ ] Categories table.
- [ ] Notifications table.
- [ ] Primary keys.
- [ ] Foreign keys.
- [ ] Relationships.
- [ ] SELECT.
- [ ] INSERT.
- [ ] UPDATE.
- [ ] DELETE.
- [ ] JOIN.
- [ ] GROUP BY.

Deployment

- [ ] Git repository.
- [ ] GitHub repository.
- [ ] ".gitignore".
- [ ] ".env" excluded.
- [ ] Render deployment.
- [ ] Cloud MySQL.
- [ ] Live URL.

---

30. CodeAlpha Submission

The final submission should include:

GitHub Repository

The repository contains:
[8/10/2026 4:30 PM] salam: - Complete source code.
- Frontend.
- Backend.
- SQL/database structure.
- API routes.
- README documentation.
- "package.json".

Live Demo

A working online version deployed through Render.

Documentation

This README explains:

- Project purpose.
- Features.
- Technologies.
- Architecture.
- Database.
- SQL.
- API.
- Installation.
- Testing.
- Deployment.

---

🎯 Final Result

TaskMaster will be a complete Full-Stack Task Management System where the user can manage tasks through a modern dashboard while the backend handles authentication and business logic, and MySQL stores and manages the application's relational data.

The project demonstrates the complete development cycle:

Frontend
   ↓
JavaScript
   ↓
REST API
   ↓
Node.js + Express
   ↓
SQL
   ↓
MySQL Database
   ↓
GitHub
   ↓
Render
   ↓
Live Web Application

The final application is designed to be functional, responsive, database-driven, and deployable, making it suitable for both an internship project and a professional portfolio.