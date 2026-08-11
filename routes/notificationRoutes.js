// TaskMaster - Notification Routes
// PHASE 12: Notifications
// API: GET /api/notifications | PUT /api/notifications/:id
// Notifications are generated from the user's real tasks:
//   - Overdue tasks
//   - Upcoming deadlines (next 3 days)
//   - Urgent priority tasks

const express = require('express');
const router = express.Router();
const { db } = require('../config/db');

// Format a due date into YYYY-MM-DD
function formatDate(dateValue) {
    if (!dateValue) return '';
    if (dateValue instanceof Date) return dateValue.toISOString().slice(0, 10);
    return String(dateValue).slice(0, 10);
}

// Generate notifications for the user from their current tasks (no duplicates)
async function generateNotifications(userId) {
    // Overdue tasks
    const [overdue] = await db.query(
        `SELECT id, title, due_date FROM tasks
         WHERE user_id = ? AND due_date < CURDATE() AND status != 'completed'`,
        [userId]
    );

    // Upcoming deadlines (next 3 days)
    const [upcoming] = await db.query(
        `SELECT id, title, due_date FROM tasks
         WHERE user_id = ? AND due_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 3 DAY) AND status != 'completed'`,
        [userId]
    );

    // Urgent priority tasks
    const [urgent] = await db.query(
        `SELECT id, title FROM tasks
         WHERE user_id = ? AND priority = 'urgent' AND status != 'completed'`,
        [userId]
    );

    // Insert the notification only if there is no identical one already
    // (dedup by title regardless of read state, so marking it read sticks)
    async function insertIfNew(title, message) {
        const [existing] = await db.query(
            'SELECT id FROM notifications WHERE user_id = ? AND title = ?',
            [userId, title]
        );
        if (existing.length === 0) {
            await db.query(
                'INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)',
                [userId, title, message]
            );
        }
    }

    for (const task of overdue) {
        await insertIfNew(
            `Task overdue: ${task.title}`,
            `Task "${task.title}" was due on ${formatDate(task.due_date)}.`
        );
    }

    for (const task of upcoming) {
        await insertIfNew(
            `Upcoming deadline: ${task.title}`,
            `Task "${task.title}" is due on ${formatDate(task.due_date)}.`
        );
    }

    for (const task of urgent) {
        await insertIfNew(
            `Urgent priority: ${task.title}`,
            `Task "${task.title}" has urgent priority.`
        );
    }
}

// GET /api/notifications - generate + return the user's notifications
router.get('/', async (req, res) => {
    try {
        await generateNotifications(req.user.id);

        const [notifications] = await db.query(
            `SELECT id, title, message, is_read, created_at
             FROM notifications
             WHERE user_id = ?
             ORDER BY is_read ASC, created_at DESC`,
            [req.user.id]
        );

        return res.json(notifications);
    } catch (err) {
        console.error('Get notifications error:', err.message);
        return res.status(500).json({ message: 'Server error while retrieving notifications' });
    }
});

// PUT /api/notifications/:id - mark one notification as read (owner only)
router.put('/:id', async (req, res) => {
    try {
        const [result] = await db.query(
            'UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?',
            [req.params.id, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        return res.json({ message: 'Notification marked as read' });
    } catch (err) {
        console.error('Mark notification error:', err.message);
        return res.status(500).json({ message: 'Server error while updating notification' });
    }
});

module.exports = router;