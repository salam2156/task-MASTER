// TaskMaster - Category Routes
// PHASE 9: Categories
// API: GET /api/categories | POST /api/categories
// Uses the existing "categories" table (one user -> many categories)

const express = require('express');
const router = express.Router();
const { db } = require('../config/db');

// GET /api/categories - retrieve the authenticated user's categories
router.get('/', async (req, res) => {
    try {
        const [categories] = await db.query(
            'SELECT id, name FROM categories WHERE user_id = ? ORDER BY name ASC',
            [req.user.id]
        );
        return res.json(categories);
    } catch (err) {
        console.error('Get categories error:', err.message);
        return res.status(500).json({ message: 'Server error while retrieving categories' });
    }
});

// POST /api/categories - create a new category for the authenticated user
router.post('/', async (req, res) => {
    const { name } = req.body;

    // Validation
    if (!name || name.trim() === '') {
        return res.status(400).json({ message: 'Category name is required' });
    }
    if (name.trim().length > 100) {
        return res.status(400).json({ message: 'Category name must be 100 characters or less' });
    }

    try {
        // Check for duplicate category name (per user)
        const [existing] = await db.query(
            'SELECT id FROM categories WHERE user_id = ? AND name = ?',
            [req.user.id, name.trim()]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: 'You already have a category with this name' });
        }

        const [result] = await db.query(
            'INSERT INTO categories (name, user_id) VALUES (?, ?)',
            [name.trim(), req.user.id]
        );

        return res.status(201).json({
            message: 'Category created successfully',
            category: { id: result.insertId, name: name.trim() }
        });
    } catch (err) {
        console.error('Create category error:', err.message);
        return res.status(500).json({ message: 'Server error while creating category' });
    }
});

// DELETE /api/categories/:id - delete the category (owner only)
// Tasks using it keep their category_id nulled via FK ON DELETE SET NULL
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query(
            'DELETE FROM categories WHERE id = ? AND user_id = ?',
            [req.params.id, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }

        return res.json({ message: 'Category deleted successfully' });
    } catch (err) {
        console.error('Delete category error:', err.message);
        return res.status(500).json({ message: 'Server error while deleting category' });
    }
});

module.exports = router;