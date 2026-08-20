

🚨 IMPORTANT: PROJECT SOURCE OF TRUTH

You are developing TaskMaster — Advanced Full-Stack Task Management System.

The Final Project Documentation is the single source of truth for this project.

You MUST return to the Final Documentation before starting, modifying, or completing ANY phase.

The project must always remain consistent with the approved architecture, features, database structure, API structure, and technology stack.

---

🔒 GLOBAL RULES — APPLY TO EVERY PHASE

These rules apply to ALL phases without exception.

1. Do not change the project concept

The project is:

«TaskMaster — Advanced Full-Stack Task Management System»

Do not transform it into another type of application.

---

2. Do not change the technology stack

The approved stack is:

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

Deployment

- Git
- GitHub
- Render

Do not replace these technologies unless I explicitly request it.

---

3. Do not change the database architecture

The approved database contains:

users
tasks
categories
notifications

Do not replace MySQL.

Do not create unnecessary tables.

Do not rename tables or important columns without approval.

Do not remove relationships.

---

4. Do not change the API architecture

The project uses REST APIs.

Do not randomly rename routes.

Do not create duplicate APIs.

Keep the API structure consistent throughout the project.

---

5. Do not remove existing features

Once a feature has been implemented and approved, do not remove or break it while implementing another feature.

---

6. Do not add major features without approval

If you think another feature would improve the project:

- Explain the idea.
- Explain why it is useful.
- Wait for approval.

Do not implement it automatically.

---

7. Never use fake data in the final application

The final application must use:

Frontend
   ↓
API
   ↓
Backend
   ↓
SQL
   ↓
MySQL

Do not permanently hardcode tasks, users, statistics, or notifications.

Temporary test data is allowed only during development.

---

8. Always inspect existing code first

Before modifying any file:

1. Read the existing implementation.
2. Understand the current architecture.
3. Identify dependencies.
4. Make the smallest necessary changes.
5. Do not overwrite working functionality unnecessarily.

---

9. Keep the code beginner-friendly

The code must be:

- Clean.
- Organized.
- Readable.
- Maintainable.
- Properly commented where necessary.
- Not unnecessarily complicated.

Avoid over-engineering.

---

10. Every feature must connect correctly

A feature is not considered complete unless all required layers are connected.

For database-driven features:

HTML
 ↓
JavaScript
 ↓
Fetch API
 ↓
Express Route
 ↓
SQL Query
 ↓
MySQL
 ↓
JSON Response
 ↓
JavaScript
 ↓
UI

---

🧩 DEVELOPMENT PHASE SYSTEM

The project will be developed through phases.

Each phase has ONE primary goal.

You must:

1. Read the Final Documentation.
2. Read the current phase.
3. Inspect the existing project.
4. Implement only the current phase.
5. Test the current phase.
6. Verify that previous features still work.
7. Report what was completed.
8. Wait for approval before moving to the next phase.

IMPORTANT

Do not automatically continue to the next phase.

When a phase is finished, stop and wait for my instruction.

---

PHASE 1 — PROJECT FOUNDATION

🎯 Goal

Create the basic Node.js + Express project foundation and approved folder structure.

Tasks

- Initialize Node.js project.
- Create "package.json".
- Install required dependencies.
- Create "server.js".
- Configure Express.
- Configure static files.
- Create project folders.
- Create ".env".
- Create ".gitignore".

Expected Structure

my-task-manager/
│
├── public/
│   ├── css/
│   ├── js/
│   └── images/
│
├── views/
│
├── config/
│
├── routes/
│
├── middleware/
│
├── .env
├── .gitignore
├── package.json
└── server.js

Do NOT
[8/10/2026 4:31 PM] salam: - Implement authentication.
- Implement tasks.
- Implement dashboard logic.
- Implement database queries.

Success Criteria

The Express server starts successfully.

node server.js

The application should respond successfully in the browser.

---

PHASE 2 — MYSQL DATABASE & SQL

🎯 Goal

Create the complete relational MySQL database according to the Final Documentation.

Tables

users
tasks
categories
notifications

Implement

Users

- Primary key.
- Name.
- Email.
- Password.
- Avatar.
- Created date.

Categories

- Primary key.
- Category name.
- User relationship.

Tasks

- Primary key.
- User relationship.
- Category relationship.
- Title.
- Description.
- Status.
- Priority.
- Due date.
- Created date.
- Updated date.

Notifications

- Primary key.
- User relationship.
- Title.
- Message.
- Read status.
- Created date.

Relationships

users
  │
  ├── tasks
  ├── categories
  └── notifications

SQL Concepts Required

The project must support practical use of:

- CREATE TABLE
- INSERT
- SELECT
- UPDATE
- DELETE
- WHERE
- ORDER BY
- GROUP BY
- JOIN
- Foreign Keys

Do NOT

- Replace MySQL.
- Add unnecessary tables.
- Remove foreign keys.
- Change the approved relationships without approval.

Success Criteria

All tables are created successfully and relationships work correctly.

---

PHASE 3 — MYSQL CONNECTION

🎯 Goal

Connect the Express backend to the MySQL database.

File

config/db.js

Implement

- MySQL connection.
- Environment variables.
- Connection error handling.
- Database connection testing.

Environment Variables

PORT=3000
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=task_manager

Success Criteria

The Node.js application successfully connects to MySQL.

---

PHASE 4 — AUTHENTICATION BACKEND

🎯 Goal

Create the backend authentication system.

Features

- Register.
- Login.
- Logout.
- Authentication middleware.
- Password security.
- Validation.

Files

routes/authRoutes.js
middleware/authMiddleware.js

API

POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout

Security

- Passwords must not be stored as plain text.
- Protected routes require authentication.
- User identity must be verified.
- User data must remain private.

Success Criteria

A user can register and authenticate through the backend API.

---

PHASE 5 — AUTHENTICATION FRONTEND

🎯 Goal

Connect the frontend authentication pages to the real backend.

Pages

views/login.html
views/register.html

Implement

Register

- Name.
- Email.
- Password.
- Validation.
- API request.
- Error handling.

Login

- Email.
- Password.
- API request.
- Error handling.
- Successful redirect to dashboard.

Important

Do not create fake login behavior.

The frontend must communicate with:

Frontend
 ↓
Fetch API
 ↓
Express
 ↓
MySQL

Success Criteria

A real user can register, log in, and access the protected application.

---

PHASE 6 — TASK CRUD BACKEND

🎯 Goal

Implement complete task CRUD functionality through the backend.

CRUD

CREATE
READ
UPDATE
DELETE

API

GET    /api/tasks
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id

Task Fields

title
description
status
priority
category
due_date
created_at
updated_at

Rules

Every task must belong to a user.

Users can only:

- View their own tasks.
- Edit their own tasks.
- Delete their own tasks.

Success Criteria

All CRUD operations work through MySQL.

---

PHASE 7 — TASK MANAGEMENT FRONTEND

🎯 Goal

Connect the dashboard task interface to the real Task API.

Implement

- Display tasks.
- Add task.
- Edit task.
- Delete task.
- Change status.
- Change priority.
- Set due date.
- Display category.

Important

Tasks must be retrieved from:

MySQL
 ↓
Express API
 ↓
Fetch
 ↓
Dashboard

No permanent hardcoded tasks.

Success Criteria

The user can manage real database tasks from the dashboard.

---

PHASE 8 — SEARCH & FILTER

🎯 Goal

Make task management easier through search, filtering, and sorting.

Features

- Search by title.
- Filter by status.
- Filter by priority.
- Filter by category.
- Sort by due date.
- Identify overdue tasks.

Important
[8/10/2026 4:31 PM] salam: Filters must operate on real task data.

Do not create fake filtered results.

Success Criteria

Users can quickly find and organize their tasks.

---

PHASE 9 — CATEGORIES

🎯 Goal

Implement task categories using the existing "categories" table.

Example

Work
Study
Personal
Urgent

Features

- Create category.
- Retrieve categories.
- Assign category to task.
- Display category.
- Filter by category.

Important

Use the existing database architecture.

Do not create unnecessary category tables.

Success Criteria

Tasks can be organized by categories.

---

PHASE 10 — DASHBOARD STATISTICS

🎯 Goal

Create real dashboard statistics using MySQL and SQL.

Display

Total Tasks
Completed
Pending
In Progress
Overdue
Completion Percentage

API

GET /api/dashboard/stats

SQL

Use real SQL calculations such as:

COUNT()
WHERE
GROUP BY

Important

Statistics must come from the database.

Do not hardcode values such as:

12
8
4

Success Criteria

Dashboard statistics automatically change when the user changes their tasks.

---

PHASE 11 — CHARTS & PRODUCTIVITY

🎯 Goal

Represent real task statistics visually.

Charts

Examples:

- Task status distribution.
- Priority distribution.
- Completed vs incomplete.

Important

Chart values must come from the API.

MySQL
 ↓
SQL
 ↓
API
 ↓
JavaScript
 ↓
Chart

Do not hardcode chart data.

Success Criteria

Charts accurately reflect the user's database information.

---

PHASE 12 — NOTIFICATIONS

🎯 Goal

Implement the notification system.

Notifications

Generate/display notifications for:

- Upcoming deadlines.
- Overdue tasks.
- Urgent tasks.

API

GET /api/notifications
PUT /api/notifications/:id

Database

Use:

notifications

Success Criteria

Users can see notifications and mark them as read.

---

PHASE 13 — PROFILE

🎯 Goal

Create user profile management.

Features

- View profile.
- Update name.
- Update email.
- Update avatar.
- Change password.

API

GET /api/profile
PUT /api/profile

Important

Changes must be saved to MySQL.

Success Criteria

The user can manage their account information.

---

PHASE 14 — DARK MODE

🎯 Goal

Implement Light/Dark Mode.

Requirements

- Theme toggle.
- Consistent colors.
- Dashboard compatibility.
- Mobile compatibility.
- Persistent preference where practical.

Important

Do not redesign the application.

Keep the approved TaskMaster design.

Success Criteria

The complete UI works correctly in both themes.

---

PHASE 15 — RESPONSIVE DESIGN

🎯 Goal

Make the entire application responsive.

Test

- Desktop.
- Laptop.
- Tablet.
- Mobile.

Check

- Sidebar.
- Navigation.
- Cards.
- Forms.
- Tables.
- Buttons.
- Dashboard.
- Profile.
- Notifications.

Success Criteria

The application remains usable and visually consistent on all screen sizes.

---

PHASE 16 — UI/UX POLISH

🎯 Goal

Improve the visual quality without changing the project architecture.

Check

- Colors.
- Typography.
- Spacing.
- Buttons.
- Cards.
- Icons.
- Shadows.
- Hover effects.
- Loading states.
- Empty states.
- Error messages.
- Success messages.

Important

Do not replace the entire design.

Use the approved palette:

Primary     #2563EB
Background  #F8FAFC
Cards       #FFFFFF
Completed   #10B981
Progress    #F59E0B
Urgent      #EF4444

---

PHASE 17 — SECURITY & VALIDATION

🎯 Goal

Review the application for security, validation, and data protection.

Check

- Password security.
- Authentication.
- Authorization.
- Protected routes.
- User ownership.
- Input validation.
- SQL injection protection.
- Environment variables.
- Error handling.

Critical Rule

User A must never be able to access User B's private tasks.

---

PHASE 18 — COMPLETE TESTING

🎯 Goal

Test the complete system before deployment.

Authentication

- [ ] Register.
- [ ] Login.
- [ ] Logout.
- [ ] Invalid credentials.
- [ ] Validation.

Tasks

- [ ] Create.
- [ ] Read.
- [ ] Update.
- [ ] Delete.
- [ ] Status.
- [ ] Priority.
- [ ] Category.
- [ ] Due date.
- [ ] Search.
- [ ] Filter.
- [ ] Overdue.

Dashboard

- [ ] Statistics.
- [ ] Progress.
- [ ] Charts.

Notifications
[8/10/2026 4:31 PM] salam: - [ ] Display.
- [ ] Mark as read.

Profile

- [ ] View.
- [ ] Update.

UI

- [ ] Desktop.
- [ ] Tablet.
- [ ] Mobile.
- [ ] Dark mode.

---

PHASE 19 — GITHUB

🎯 Goal

Prepare the project for GitHub.

Include

Source Code
README.md
package.json
SQL/database documentation

Exclude

node_modules/
.env

Commit Examples

Initial project setup
Add MySQL database
Implement authentication
Add task CRUD
Add categories
Add dashboard statistics
Add notifications
Add profile
Add responsive UI
Prepare deployment

Success Criteria

The GitHub repository is clean, organized, and contains no secrets.

---

PHASE 20 — RENDER DEPLOYMENT

🎯 Goal

Deploy the complete application online.

Platform

Render

Build Command

npm install

Start Command

node server.js

Environment Variables

PORT
DB_HOST
DB_USER
DB_PASSWORD
DB_NAME

Important

Production must use a cloud-accessible MySQL database.

Do not use local MySQL in production.

Success Criteria

The application is accessible through a public URL.

---

PHASE 21 — FINAL AUDIT

🎯 Goal

Confirm that the final project exactly follows the Final Documentation.

Frontend

- [ ] Home
- [ ] Login
- [ ] Register
- [ ] Dashboard
- [ ] Profile
- [ ] Task management
- [ ] Search
- [ ] Filters
- [ ] Notifications
- [ ] Charts
- [ ] Dark mode
- [ ] Responsive design

Backend

- [ ] Node.js
- [ ] Express.js
- [ ] Authentication
- [ ] Middleware
- [ ] REST API
- [ ] CRUD
- [ ] Validation
- [ ] Error handling

Database

- [ ] MySQL
- [ ] Users
- [ ] Tasks
- [ ] Categories
- [ ] Notifications
- [ ] Primary keys
- [ ] Foreign keys
- [ ] Relationships
- [ ] SQL queries
- [ ] JOIN
- [ ] GROUP BY

Deployment

- [ ] Git
- [ ] GitHub
- [ ] Render
- [ ] Cloud MySQL
- [ ] Environment variables
- [ ] Live URL

---

🧠 REQUIRED RESPONSE FORMAT AFTER EVERY PHASE

When you finish any phase, respond using this structure:

Phase Completed

State the phase number and name.

What Was Implemented

List exactly what was added or changed.

Files Created

List new files.

Files Modified

List modified files.

Architecture Connection

Explain briefly:

Frontend
↓
Backend
↓
API
↓
SQL
↓
Database

and explain where the current phase fits.

Testing

Explain exactly how I can test the phase.

Documentation Check

Confirm that the implementation follows the Final Documentation.

Problems / Warnings

If something cannot be completed or conflicts with the documentation, explain it clearly.

Next Phase

Mention only the next phase name.

Do not start the next phase automatically.

---

🚨 FINAL NON-NEGOTIABLE RULE

The Final Documentation is the project's single source of truth.

Before every phase, modification, refactor, or feature:

READ DOCUMENTATION
       ↓
CHECK CURRENT CODE
       ↓
CHECK CURRENT PHASE
       ↓
IMPLEMENT
       ↓
TEST
       ↓
VERIFY
       ↓
STOP
       ↓
WAIT FOR APPROVAL

Never silently change:

- Project concept.
- Technology stack.
- Database.
- Tables.
- Relationships.
- API architecture.
- Approved features.
- Folder structure.

If a change is necessary, explain it first and wait for approval.

The goal is not simply to make the application work. The goal is to build the exact TaskMaster Full-Stack project described in the Final Documentation, in a controlled and organized way.
[8/10/2026 4:31 PM] salam: إي، فهمت عليكِ. بدك نفس الـ Master Prompt، لكن يكون كل Phase فيه واضح جدًا: Goal + المطلوب + الملفات + الممنوع + النتيجة المتوقعة، بدون ما نغيّر فكرة المشروع أو نعمل Prompt مختلف لكل Phase.

استخدمي هيدا بدل النسخة السابقة:

TASKMASTER — MASTER DEVELOPMENT PROMPT

🚨 IMPORTANT: PROJECT SOURCE OF TRUTH

You are developing TaskMaster — Advanced Full-Stack Task Management System.

The Final Project Documentation is the single source of truth for this project.

You MUST return to the Final Documentation before starting, modifying, or completing ANY phase.

The project must always remain consistent with the approved architecture, features, database structure, API structure, and technology stack.

---

🔒 GLOBAL RULES — APPLY TO EVERY PHASE

These rules apply to ALL phases without exception.

1. Do not change the project concept

The project is:

«TaskMaster — Advanced Full-Stack Task Management System»

Do not transform it into another type of application.

---

2. Do not change the technology stack

The approved stack is:

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

Deployment

- Git
- GitHub
- Render

Do not replace these technologies unless I explicitly request it.

---

3. Do not change the database architecture

The approved database contains:

users
tasks
categories
notifications

Do not replace MySQL.

Do not create unnecessary tables.

Do not rename tables or important columns without approval.

Do not remove relationships.

---

4. Do not change the API architecture

The project uses REST APIs.

Do not randomly rename routes.

Do not create duplicate APIs.

Keep the API structure consistent throughout the project.

---

5. Do not remove existing features

Once a feature has been implemented and approved, do not remove or break it while implementing another feature.

---

6. Do not add major features without approval

If you think another feature would improve the project:

- Explain the idea.
- Explain why it is useful.
- Wait for approval.

Do not implement it automatically.

---

7. Never use fake data in the final application

The final application must use:

Frontend
   ↓
API
   ↓
Backend
   ↓
SQL
   ↓
MySQL

Do not permanently hardcode tasks, users, statistics, or notifications.

Temporary test data is allowed only during development.

---

8. Always inspect existing code first

Before modifying any file:

1. Read the existing implementation.
2. Understand the current architecture.
3. Identify dependencies.
4. Make the smallest necessary changes.
5. Do not overwrite working functionality unnecessarily.

---

9. Keep the code beginner-friendly

The code must be:

- Clean.
- Organized.
- Readable.
- Maintainable.
- Properly commented where necessary.
- Not unnecessarily complicated.

Avoid over-engineering.

---

10. Every feature must connect correctly

A feature is not considered complete unless all required layers are connected.

For database-driven features:

HTML
 ↓
JavaScript
 ↓
Fetch API
 ↓
Express Route
 ↓
SQL Query
 ↓
MySQL
 ↓
JSON Response
 ↓
JavaScript
 ↓
UI

---

🧩 DEVELOPMENT PHASE SYSTEM

The project will be developed through phases.

Each phase has ONE primary goal.

You must:

1. Read the Final Documentation.
2. Read the current phase.
3. Inspect the existing project.
4. Implement only the current phase.
5. Test the current phase.
6. Verify that previous features still work.
7. Report what was completed.
8. Wait for approval before moving to the next phase.

IMPORTANT

Do not automatically continue to the next phase.

When a phase is finished, stop and wait for my instruction.

---

PHASE 1 — PROJECT FOUNDATION

🎯 Goal

Create the basic Node.js + Express project foundation and approved folder structure.

Tasks

- Initialize Node.js project.
- Create "package.json".
- Install required dependencies.
- Create "server.js".
- Configure Express.
- Configure static files.
- Create project folders.
- Create ".env".
- Create ".gitignore".

Expected Structure
[8/10/2026 4:31 PM] salam: my-task-manager/
│
├── public/
│   ├── css/
│   ├── js/
│   └── images/
│
├── views/
│
├── config/
│
├── routes/
│
├── middleware/
│
├── .env
├── .gitignore
├── package.json
└── server.js

Do NOT

- Implement authentication.
- Implement tasks.
- Implement dashboard logic.
- Implement database queries.

Success Criteria

The Express server starts successfully.

node server.js

The application should respond successfully in the browser.

---

PHASE 2 — MYSQL DATABASE & SQL

🎯 Goal

Create the complete relational MySQL database according to the Final Documentation.

Tables

users
tasks
categories
notifications

Implement

Users

- Primary key.
- Name.
- Email.
- Password.
- Avatar.
- Created date.

Categories

- Primary key.
- Category name.
- User relationship.

Tasks

- Primary key.
- User relationship.
- Category relationship.
- Title.
- Description.
- Status.
- Priority.
- Due date.
- Created date.
- Updated date.

Notifications

- Primary key.
- User relationship.
- Title.
- Message.
- Read status.
- Created date.

Relationships

users
  │
  ├── tasks
  ├── categories
  └── notifications

SQL Concepts Required

The project must support practical use of:

- CREATE TABLE
- INSERT
- SELECT
- UPDATE
- DELETE
- WHERE
- ORDER BY
- GROUP BY
- JOIN
- Foreign Keys

Do NOT

- Replace MySQL.
- Add unnecessary tables.
- Remove foreign keys.
- Change the approved relationships without approval.

Success Criteria

All tables are created successfully and relationships work correctly.

---

PHASE 3 — MYSQL CONNECTION

🎯 Goal

Connect the Express backend to the MySQL database.

File

config/db.js

Implement

- MySQL connection.
- Environment variables.
- Connection error handling.
- Database connection testing.

Environment Variables

PORT=3000
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=task_manager

Success Criteria

The Node.js application successfully connects to MySQL.

---

PHASE 4 — AUTHENTICATION BACKEND

🎯 Goal

Create the backend authentication system.

Features

- Register.
- Login.
- Logout.
- Authentication middleware.
- Password security.
- Validation.

Files

routes/authRoutes.js
middleware/authMiddleware.js

API

POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout

Security

- Passwords must not be stored as plain text.
- Protected routes require authentication.
- User identity must be verified.
- User data must remain private.

Success Criteria

A user can register and authenticate through the backend API.

---

PHASE 5 — AUTHENTICATION FRONTEND

🎯 Goal

Connect the frontend authentication pages to the real backend.

Pages

views/login.html
views/register.html

Implement

Register

- Name.
- Email.
- Password.
- Validation.
- API request.
- Error handling.

Login

- Email.
- Password.
- API request.
- Error handling.
- Successful redirect to dashboard.

Important

Do not create fake login behavior.

The frontend must communicate with:

Frontend
 ↓
Fetch API
 ↓
Express
 ↓
MySQL

Success Criteria

A real user can register, log in, and access the protected application.

---

PHASE 6 — TASK CRUD BACKEND

🎯 Goal

Implement complete task CRUD functionality through the backend.

CRUD

CREATE
READ
UPDATE
DELETE

API

GET    /api/tasks
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id

Task Fields

title
description
status
priority
category
due_date
created_at
updated_at

Rules

Every task must belong to a user.

Users can only:

- View their own tasks.
- Edit their own tasks.
- Delete their own tasks.

Success Criteria

All CRUD operations work through MySQL.

---

PHASE 7 — TASK MANAGEMENT FRONTEND

🎯 Goal

Connect the dashboard task interface to the real Task API.

Implement

- Display tasks.
- Add task.
- Edit task.
- Delete task.
- Change status.
- Change priority.
- Set due date.
- Display category.

Important

Tasks must be retrieved from:

MySQL
 ↓
Express API
 ↓
Fetch
 ↓
Dashboard

No permanent hardcoded tasks.

Success Criteria

The user can manage real database tasks from the dashboard.

---

PHASE 8 — SEARCH & FILTER

🎯 Goal
[8/10/2026 4:31 PM] salam: Make task management easier through search, filtering, and sorting.

Features

- Search by title.
- Filter by status.
- Filter by priority.
- Filter by category.
- Sort by due date.
- Identify overdue tasks.

Important

Filters must operate on real task data.

Do not create fake filtered results.

Success Criteria

Users can quickly find and organize their tasks.

---

PHASE 9 — CATEGORIES

🎯 Goal

Implement task categories using the existing "categories" table.

Example

Work
Study
Personal
Urgent

Features

- Create category.
- Retrieve categories.
- Assign category to task.
- Display category.
- Filter by category.

Important

Use the existing database architecture.

Do not create unnecessary category tables.

Success Criteria

Tasks can be organized by categories.

---

PHASE 10 — DASHBOARD STATISTICS

🎯 Goal

Create real dashboard statistics using MySQL and SQL.

Display

Total Tasks
Completed
Pending
In Progress
Overdue
Completion Percentage

API

GET /api/dashboard/stats

SQL

Use real SQL calculations such as:

COUNT()
WHERE
GROUP BY

Important

Statistics must come from the database.

Do not hardcode values such as:

12
8
4

Success Criteria

Dashboard statistics automatically change when the user changes their tasks.

---

PHASE 11 — CHARTS & PRODUCTIVITY

🎯 Goal

Represent real task statistics visually.

Charts

Examples:

- Task status distribution.
- Priority distribution.
- Completed vs incomplete.

Important

Chart values must come from the API.

MySQL
 ↓
SQL
 ↓
API
 ↓
JavaScript
 ↓
Chart

Do not hardcode chart data.

Success Criteria

Charts accurately reflect the user's database information.

---

PHASE 12 — NOTIFICATIONS

🎯 Goal

Implement the notification system.

Notifications

Generate/display notifications for:

- Upcoming deadlines.
- Overdue tasks.
- Urgent tasks.

API

GET /api/notifications
PUT /api/notifications/:id

Database

Use:

notifications

Success Criteria

Users can see notifications and mark them as read.

---

PHASE 13 — PROFILE

🎯 Goal

Create user profile management.

Features

- View profile.
- Update name.
- Update email.
- Update avatar.
- Change password.

API

GET /api/profile
PUT /api/profile

Important

Changes must be saved to MySQL.

Success Criteria

The user can manage their account information.

---

PHASE 14 — DARK MODE

🎯 Goal

Implement Light/Dark Mode.

Requirements

- Theme toggle.
- Consistent colors.
- Dashboard compatibility.
- Mobile compatibility.
- Persistent preference where practical.

Important

Do not redesign the application.

Keep the approved TaskMaster design.

Success Criteria

The complete UI works correctly in both themes.

---

PHASE 15 — RESPONSIVE DESIGN

🎯 Goal

Make the entire application responsive.

Test

- Desktop.
- Laptop.
- Tablet.
- Mobile.

Check

- Sidebar.
- Navigation.
- Cards.
- Forms.
- Tables.
- Buttons.
- Dashboard.
- Profile.
- Notifications.

Success Criteria

The application remains usable and visually consistent on all screen sizes.

---

PHASE 16 — UI/UX POLISH

🎯 Goal

Improve the visual quality without changing the project architecture.

Check

- Colors.
- Typography.
- Spacing.
- Buttons.
- Cards.
- Icons.
- Shadows.
- Hover effects.
- Loading states.
- Empty states.
- Error messages.
- Success messages.

Important

Do not replace the entire design.

Use the approved palette:

Primary     #2563EB
Background  #F8FAFC
Cards       #FFFFFF
Completed   #10B981
Progress    #F59E0B
Urgent      #EF4444

---

PHASE 17 — SECURITY & VALIDATION

🎯 Goal

Review the application for security, validation, and data protection.

Check

- Password security.
- Authentication.
- Authorization.
- Protected routes.
- User ownership.
- Input validation.
- SQL injection protection.
- Environment variables.
- Error handling.

Critical Rule

User A must never be able to access User B's private tasks.

---

PHASE 18 — COMPLETE TESTING

🎯 Goal

Test the complete system before deployment.

Authentication

- [ ] Register.
- [ ] Login.
- [ ] Logout.
- [ ] Invalid credentials.
- [ ] Validation.

Tasks
 - [ ] Create.
- [ ] Read.
- [ ] Update.
- [ ] Delete.
- [ ] Status.
- [ ] Priority.
- [ ] Category.
- [ ] Due date.
- [ ] Search.
- [ ] Filter.
- [ ] Overdue.

Dashboard

- [ ] Statistics.
- [ ] Progress.
- [ ] Charts.

Notifications

- [ ] Display.
- [ ] Mark as read.

Profile

- [ ] View.
- [ ] Update.

UI

- [ ] Desktop.
- [ ] Tablet.
- [ ] Mobile.
- [ ] Dark mode.

---

PHASE 19 — GITHUB

🎯 Goal

Prepare the project for GitHub.

Include

Source Code
README.md
package.json
SQL/database documentation

Exclude

node_modules/
.env

Commit Examples

Initial project setup
Add MySQL database
Implement authentication
Add task CRUD
Add categories
Add dashboard statistics
Add notifications
Add profile
Add responsive UI
Prepare deployment

Success Criteria

The GitHub repository is clean, organized, and contains no secrets.

---

PHASE 20 — RENDER DEPLOYMENT

🎯 Goal

Deploy the complete application online.

Platform

Render

Build Command

npm install

Start Command

node server.js

Environment Variables

PORT
DB_HOST
DB_USER
DB_PASSWORD
DB_NAME

Important

Production must use a cloud-accessible MySQL database.

Do not use local MySQL in production.

Success Criteria

The application is accessible through a public URL.

---

PHASE 21 — FINAL AUDIT

🎯 Goal

Confirm that the final project exactly follows the Final Documentation.

Frontend

- [ ] Home
- [ ] Login
- [ ] Register
- [ ] Dashboard
- [ ] Profile
- [ ] Task management
- [ ] Search
- [ ] Filters
- [ ] Notifications
- [ ] Charts
- [ ] Dark mode
- [ ] Responsive design

Backend

- [ ] Node.js
- [ ] Express.js
- [ ] Authentication
- [ ] Middleware
- [ ] REST API
- [ ] CRUD
- [ ] Validation
- [ ] Error handling

Database

- [ ] MySQL
- [ ] Users
- [ ] Tasks
- [ ] Categories
- [ ] Notifications
- [ ] Primary keys
- [ ] Foreign keys
- [ ] Relationships
- [ ] SQL queries
- [ ] JOIN
- [ ] GROUP BY

Deployment

- [ ] Git
- [ ] GitHub
- [ ] Render
- [ ] Cloud MySQL
- [ ] Environment variables
- [ ] Live URL

---

🧠 REQUIRED RESPONSE FORMAT AFTER EVERY PHASE

When you finish any phase, respond using this structure:

Phase Completed

State the phase number and name.

What Was Implemented

List exactly what was added or changed.

Files Created

List new files.

Files Modified

List modified files.

Architecture Connection

Explain briefly:

Frontend
↓
Backend
↓
API
↓
SQL
↓
Database

and explain where the current phase fits.

Testing

Explain exactly how I can test the phase.

Documentation Check

Confirm that the implementation follows the Final Documentation.

Problems / Warnings

If something cannot be completed or conflicts with the documentation, explain it clearly.

Next Phase

Mention only the next phase name.

Do not start the next phase automatically.

---

🚨 FINAL NON-NEGOTIABLE RULE

The Final Documentation is the project's single source of truth.

Before every phase, modification, refactor, or feature:

READ DOCUMENTATION
       ↓
CHECK CURRENT CODE
       ↓
CHECK CURRENT PHASE
       ↓
IMPLEMENT
       ↓
TEST
       ↓
VERIFY
       ↓
STOP
       ↓
WAIT FOR APPROVAL

Never silently change:

- Project concept.
- Technology stack.
- Database.
- Tables.
- Relationships.
- API architecture.
- Approved features.
- Folder structure.

If a change is necessary, explain it first and wait for approval.

The goal is not simply to make the application work. The goal is to build the exact TaskMaster Full-Stack project described in the Final Documentation, in a controlled and organized way.

---

PHASE 22 � FRONT-END REVIEW & POLISH (BONUS)

?? Goal

Review the complete frontend against the project blueprint (design system, pages, navigation, UX polish) and confirm every item is implemented.

Design System

- [x] Color palette: Primary Blue #2563EB, Green (completed), Amber (in-progress), Red (urgent).
- [x] Rounded cards with soft shadows, clean typography.
- [x] Smooth dark-mode transition + persistent preference.

Pages (with consistent Navbar and Footer)

- [x] Home (/): navbar (logo + Log In / Sign Up Free), intro, features, CTA, professional footer (quick links, social icons, copyright).
- [x] Login (/login): centered card with icons, navbar + footer, real-time validation hints, toasts, loading state.
- [x] Register (/register): centered card with icons, navbar + footer, real-time validation (name/email/password), toasts.
- [x] Dashboard (/dashboard): responsive sidebar (collapses to icons on mobile), header (avatar, notification bell, theme toggle), stat cards, progress bar, empty states, loading spinners.
- [x] Profile (/profile): edit personal info + change password.

UI/UX Polish

- [x] Toast notifications (floating success/error, auto-dismiss).
- [x] Custom 404 page (views/404.html) served with status 404.

Success Criteria

The frontend matches the blueprint in full; all pages verified live (200), /api/health db: up, custom 404 confirmed, working tree clean.
