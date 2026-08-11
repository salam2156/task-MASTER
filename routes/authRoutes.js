// TaskMaster - Authentication Routes
// PHASE 4: Authentication Backend
// API: POST /api/auth/register | POST /api/auth/login | POST /api/auth/logout

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../config/db');

// Helper: validate a single required field
function requireField(value, fieldName) {
    if (!value || value.trim() === '') {
        return `${fieldName} is required`;
    }
    return null;
}

// POST /api/auth/register - create a new user
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    // Input validation
    const errors = [
        requireField(name, 'Name'),
        requireField(email, 'Email'),
        requireField(password, 'Password')
    ].filter(error => error !== null);

    if (errors.length > 0) {
        return res.status(400).json({ message: errors.join('. ') });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    if (name.trim().length > 100) {
        return res.status(400).json({ message: 'Name must be 100 characters or less' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Please enter a valid email address' });
    }
    if (email.trim().length > 150) {
        return res.status(400).json({ message: 'Email must be 150 characters or less' });
    }

    try {
        // Check if the email is already registered
        const [existing] = await db.query(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: 'Email is already registered' });
        }

        // Hash the password (never store plain text)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        const [result] = await db.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name.trim(), email.trim(), hashedPassword]
        );

        return res.status(201).json({
            message: 'Registered successfully',
            user: { id: result.insertId, name: name.trim(), email: email.trim() }
        });
    } catch (err) {
        console.error('Register error:', err.message);
        return res.status(500).json({ message: 'Server error during registration' });
    }
});

// POST /api/auth/login - authenticate a user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // Find the user by email
        const [users] = await db.query(
            'SELECT id, name, email, password, avatar FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = users[0];

        // Compare the provided password with the stored hash
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Create a JWT token for the authenticated user
        const token = jwt.sign(
            { id: user.id, name: user.name, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return res.json({
            message: 'Logged in successfully',
            token,
            user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar }
        });
    } catch (err) {
        console.error('Login error:', err.message);
        return res.status(500).json({ message: 'Server error during login' });
    }
});

// POST /api/auth/logout - end the user session
// With JWT the client simply discards its token
router.post('/logout', (req, res) => {
    return res.json({ message: 'Logged out successfully' });
});

module.exports = router;