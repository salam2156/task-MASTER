// TaskMaster - Task Routes (CRUD)
// PHASE 6: Task CRUD Backend
// API: GET /api/tasks | POST /api/tasks | PUT /api/tasks/:id | DELETE /api/tasks/:id
// All routes are protected - every task belongs to the authenticated user

const express = require('express');
const router = express.Router();
const { db } = require('../config/db');

// Valid values for status and priority
const VALID_STATUSES = ['pending', 'in_progress', 'completed'];
const VALID_PRIORITIES = ['low', 'medium', 'high', 'urgent'];

// Helper: validate due_date format (real date, not just shape)
function isValidDate(dateString) {
    if (!dateString) return true;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return false;
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.getUTCFullYear() === year &&
        date.getUTCMonth() === month - 1 &&
        date.getUTCDate() === day;
}

// Helper: verify that a category belongs to the current user
async function categoryBelongsToUser(categoryId, userId) {
    if (!categoryId) return true;
    const [categories] = await db.query(
        'SELECT id FROM categories WHERE id = ? AND user_id = ?',
        [categoryId, userId]
    );
    return categories.length > 0;
}

// GET /api/tasks - retrieve the authenticated user's tasks (with category name)
router.get('/', async (req, res) => {
    try {
        const [tasks] = await db.query(
            `SELECT tasks.*, categories.name AS category_name
             FROM tasks
             LEFT JOIN categories
             ON tasks.category_id = categories.id
             WHERE tasks.user_id = ?
             ORDER BY tasks.created_at DESC`,
            [req.user.id]
        );
        return res.json(tasks);
    } catch (err) {
        console.error('Get tasks error:', err.message);
        return res.status(500).json({ message: 'Server error while retrieving tasks' });
    }
});

// POST /api/tasks - create a new task for the authenticated user
router.post('/', async (req, res) => {
    const { title, description, status, priority, category_id, due_date } = req.body;

    // Validation
    if (!title || title.trim() === '') {
        return res.status(400).json({ message: 'Title is required' });
    }
    if (title.trim().length > 200) {
        return res.status(400).json({ message: 'Title must be 200 characters or less' });
    }
    if (status && !VALID_STATUSES.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }
    if (priority && !VALID_PRIORITIES.includes(priority)) {
        return res.status(400).json({ message: 'Invalid priority' });
    }
    if (!isValidDate(due_date)) {
        return res.status(400).json({ message: 'Invalid due date (use YYYY-MM-DD)' });
    }

    try {
        // Verify the category belongs to this user
        if (!(await categoryBelongsToUser(category_id, req.user.id))) {
            return res.status(400).json({ message: 'Invalid category' });
        }

        const [result] = await db.query(
            `INSERT INTO tasks (user_id, category_id, title, description, status, priority, due_date)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                req.user.id,
                category_id || null,
                title.trim(),
                description || null,
                status || 'pending',
                priority || 'medium',
                due_date || null
            ]
        );

        // Return the created task with its category name
        const [created] = await db.query(
            `SELECT tasks.*, categories.name AS category_name
             FROM tasks
             LEFT JOIN categories ON tasks.category_id = categories.id
             WHERE tasks.id = ? AND tasks.user_id = ?`,
            [result.insertId, req.user.id]
        );

        return res.status(201).json(created[0]);
    } catch (err) {
        console.error('Create task error:', err.message);
        return res.status(500).json({ message: 'Server error while creating task' });
    }
});

// PUT /api/tasks/:id - update an existing task (only the owner)
router.put('/:id', async (req, res) => {
    const taskId = req.params.id;
    const { title, description, status, priority, category_id, due_date } = req.body;

    // Validate provided values
    if (title !== undefined && title.trim() === '') {
        return res.status(400).json({ message: 'Title cannot be empty' });
    }
    if (title !== undefined && title.trim().length > 200) {
        return res.status(400).json({ message: 'Title must be 200 characters or less' });
    }
    if (status !== undefined && !VALID_STATUSES.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }
    if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
        return res.status(400).json({ message: 'Invalid priority' });
    }
    if (!isValidDate(due_date)) {
        return res.status(400).json({ message: 'Invalid due date (use YYYY-MM-DD)' });
    }

    try {
        // Verify the category belongs to this user
        if (category_id !== undefined && !(await categoryBelongsToUser(category_id, req.user.id))) {
            return res.status(400).json({ message: 'Invalid category' });
        }

        // Build the update dynamically from the provided fields
        const updates = [];
        const values = [];

        if (title !== undefined) { updates.push('title = ?'); values.push(title.trim()); }
        if (description !== undefined) { updates.push('description = ?'); values.push(description === '' ? null : description); }
        if (status !== undefined) { updates.push('status = ?'); values.push(status); }
        if (priority !== undefined) { updates.push('priority = ?'); values.push(priority); }
        if (due_date !== undefined) { updates.push('due_date = ?'); values.push(due_date === '' ? null : due_date); }
        if (category_id !== undefined) { updates.push('category_id = ?'); values.push(category_id === '' ? null : category_id); }

        if (updates.length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        // Only the owner can update the task
        values.push(taskId, req.user.id);
        const [result] = await db.query(
            `UPDATE tasks SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`,
            values
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Return the updated task
        const [updated] = await db.query(
            `SELECT tasks.*, categories.name AS category_name
             FROM tasks
             LEFT JOIN categories ON tasks.category_id = categories.id
             WHERE tasks.id = ? AND tasks.user_id = ?`,
            [taskId, req.user.id]
        );

        return res.json(updated[0]);
    } catch (err) {
        console.error('Update task error:', err.message);
        return res.status(500).json({ message: 'Server error while updating task' });
    }
});

// DELETE /api/tasks/:id - delete an existing task (only the owner)
router.delete('/:id', async (req, res) => {
    const taskId = req.params.id;

    try {
        // Only the owner can delete the task
        const [result] = await db.query(
            'DELETE FROM tasks WHERE id = ? AND user_id = ?',
            [taskId, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        return res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        console.error('Delete task error:', err.message);
        return res.status(500).json({ message: 'Server error while deleting task' });
    }
});

module.exports = router;