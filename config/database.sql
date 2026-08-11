-- =============================================================
-- TaskMaster - MySQL Database Schema
-- PHASE 2: MySQL Database & SQL
-- Follows the Final Documentation (doc.md) exactly:
--   users, tasks, categories, notifications
-- =============================================================

-- 1. Create the database
CREATE DATABASE IF NOT EXISTS task_manager;

USE task_manager;

-- 2. USERS table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. CATEGORIES table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    user_id INT NOT NULL,

    UNIQUE KEY uq_user_category (user_id, name),

    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

-- 4. TASKS table
CREATE TABLE IF NOT EXISTS tasks (
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

-- 5. NOTIFICATIONS table
CREATE TABLE IF NOT EXISTS notifications (
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

-- =============================================================
-- OPTIONAL TEST DATA (DEVELOPMENT ONLY - REMOVE FOR PRODUCTION)
-- =============================================================

-- Example categories for a test user (user id 1):
-- INSERT INTO categories (name, user_id) VALUES
-- ('Work', 1),
-- ('Study', 1),
-- ('Personal', 1),
-- ('Urgent', 1);

-- Example task for a test user (user id 1):
-- INSERT INTO tasks (user_id, category_id, title, description, status, priority, due_date)
-- VALUES (1, 1, 'Finish TaskMaster project', 'Complete the full-stack task management system', 'in_progress', 'high', '2026-08-31');