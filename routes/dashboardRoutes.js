// TaskMaster - Dashboard Statistics Route
// PHASE 10: Dashboard Statistics
// API: GET /api/dashboard/stats
// All values are calculated live from the database (no hardcoded numbers)

const express = require('express');
const router = express.Router();
const { db } = require('../config/db');

// GET /api/dashboard/stats - real statistics for the authenticated user
router.get('/stats', async (req, res) => {
    try {
        // Total tasks
        const [totalRows] = await db.query(
            'SELECT COUNT(*) AS total FROM tasks WHERE user_id = ?',
            [req.user.id]
        );

        // Status distribution (GROUP BY)
        const [statusRows] = await db.query(
            `SELECT status, COUNT(*) AS total
             FROM tasks
             WHERE user_id = ?
             GROUP BY status`,
            [req.user.id]
        );

        // Overdue tasks: due date passed and not completed
        const [overdueRows] = await db.query(
            `SELECT COUNT(*) AS total
             FROM tasks
             WHERE user_id = ? AND due_date < CURDATE() AND status != 'completed'`,
            [req.user.id]
        );

        // Priority distribution for charts (GROUP BY)
        const [priorityRows] = await db.query(
            `SELECT priority, COUNT(*) AS total
             FROM tasks
             WHERE user_id = ?
             GROUP BY priority`,
            [req.user.id]
        );

        // Build the status counts
        const byStatus = { pending: 0, in_progress: 0, completed: 0 };
        statusRows.forEach(row => {
            if (row.status in byStatus) byStatus[row.status] = row.total;
        });

        // Build chart distributions with a fixed label order
        const statusLabels = ['Pending', 'In Progress', 'Completed'];
        const statusKeys = ['pending', 'in_progress', 'completed'];
        const statusChartData = statusKeys.map(key => byStatus[key]);

        const byPriority = { low: 0, medium: 0, high: 0, urgent: 0 };
        priorityRows.forEach(row => {
            if (row.priority in byPriority) byPriority[row.priority] = row.total;
        });
        const priorityLabels = ['Low', 'Medium', 'High', 'Urgent'];
        const priorityKeys = ['low', 'medium', 'high', 'urgent'];
        const priorityChartData = priorityKeys.map(key => byPriority[key]);

        const total = totalRows[0].total;
        const completed = byStatus.completed;
        const completionPercentage = total === 0 ? 0 : Math.round((completed / total) * 100);

        return res.json({
            total,
            pending: byStatus.pending,
            inProgress: byStatus.in_progress,
            completed,
            overdue: overdueRows[0].total,
            completionPercentage,
            charts: {
                status: { labels: statusLabels, data: statusChartData },
                priority: { labels: priorityLabels, data: priorityChartData },
                completion: { completed, remaining: total - completed }
            }
        });
    } catch (err) {
        console.error('Get stats error:', err.message);
        return res.status(500).json({ message: 'Server error while retrieving statistics' });
    }
});

module.exports = router;