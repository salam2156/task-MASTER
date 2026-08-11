// TaskMaster - User Profile Routes
// PHASE 13: Profile
// API: GET /api/profile | PUT /api/profile
// Users can view and update their own account information

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { db } = require('../config/db');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const urlRegex = /^https?:\/\/\S+$/i;

// GET /api/profile - return the authenticated user's information (never the password)
router.get('/', async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT id, name, email, avatar, created_at FROM users WHERE id = ?',
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.json(users[0]);
    } catch (err) {
        console.error('Get profile error:', err.message);
        return res.status(500).json({ message: 'Server error while retrieving profile' });
    }
});

// PUT /api/profile - update name, email, avatar and/or password
router.put('/', async (req, res) => {
    const { name, email, avatar, currentPassword, newPassword } = req.body;

    try {
        // Load the current user (with password hash) to verify identity
        const [users] = await db.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
        const user = users[0];

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // ---- Validate the provided fields ----
        if (name !== undefined && name.trim() === '') {
            return res.status(400).json({ message: 'Name cannot be empty' });
        }
        if (name !== undefined && name.trim().length > 100) {
            return res.status(400).json({ message: 'Name must be 100 characters or less' });
        }

        if (email !== undefined) {
            if (!emailRegex.test(email)) {
                return res.status(400).json({ message: 'Please enter a valid email address' });
            }
            if (email.trim().length > 150) {
                return res.status(400).json({ message: 'Email must be 150 characters or less' });
            }
            // Email must not belong to another user
            const [duplicates] = await db.query(
                'SELECT id FROM users WHERE email = ? AND id != ?',
                [email.trim(), req.user.id]
            );
            if (duplicates.length > 0) {
                return res.status(400).json({ message: 'Email is already in use' });
            }
        }

        // ---- Password change (requires the current password) ----
        let newPasswordHash = null;
        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ message: 'Current password is required' });
            }
            const passwordMatch = await bcrypt.compare(currentPassword, user.password);
            if (!passwordMatch) {
                return res.status(400).json({ message: 'Current password is incorrect' });
            }
            if (newPassword.length < 6) {
                return res.status(400).json({ message: 'New password must be at least 6 characters' });
            }
            newPasswordHash = await bcrypt.hash(newPassword, 10);
        }

        // ---- Avatar must be empty or a valid http(s) image URL ----
        const trimmedAvatar = avatar === undefined ? undefined : avatar.trim();
        if (trimmedAvatar !== undefined && trimmedAvatar !== '' && !urlRegex.test(trimmedAvatar)) {
            return res.status(400).json({ message: 'Avatar must be a valid http(s) image URL' });
        }

        // ---- Build the update dynamically ----
        const updates = [];
        const values = [];

        if (name !== undefined) { updates.push('name = ?'); values.push(name.trim()); }
        if (email !== undefined) { updates.push('email = ?'); values.push(email.trim()); }
        if (avatar !== undefined) { updates.push('avatar = ?'); values.push(avatar.trim() === '' ? null : avatar.trim()); }
        if (newPasswordHash) { updates.push('password = ?'); values.push(newPasswordHash); }

        if (updates.length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        values.push(req.user.id);
        await db.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);

        // Return the updated profile
        const [updated] = await db.query(
            'SELECT id, name, email, avatar, created_at FROM users WHERE id = ?',
            [req.user.id]
        );

        return res.json({
            message: 'Profile updated successfully',
            user: updated[0]
        });
    } catch (err) {
        console.error('Update profile error:', err.message);
        return res.status(500).json({ message: 'Server error while updating profile' });
    }
});

module.exports = router;