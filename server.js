// TaskMaster - Express Server
// PHASE 1: Project Foundation

const express = require('express');
const path = require('path');
require('dotenv').config();

// Database connection
const { testConnection, db } = require('./config/db');

// Routes
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const userRoutes = require('./routes/userRoutes');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', authMiddleware, taskRoutes);
app.use('/api/categories', authMiddleware, categoryRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);
app.use('/api/notifications', authMiddleware, notificationRoutes);
app.use('/api/profile', authMiddleware, userRoutes);

// Page Routes
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'profile.html'));
});

// Root route - Home / landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Health check: verifies the app and its database connection (Render health check)
app.get('/api/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ ok: true, db: 'up' });
  } catch (err) {
    console.error('Health check DB error:', err);
    res.status(503).json({
      ok: false,
      db: 'down',
      code: err.code || null,
      error: String(err.message),
      config: {
        host: process.env.DB_HOST || '(unset)',
        user: process.env.DB_USER || '(unset)',
        database: process.env.DB_NAME || '(unset)',
        ssl: String(process.env.DB_SSL)
      }
    });
  }
});

// Unknown API route -> clean JSON 404 (Phase 17)
app.use('/api', (req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

// Central error handler (e.g. malformed JSON body) -> JSON response (Phase 17)
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON in request body' });
  }
  res.status(500).json({ message: 'Internal server error' });
});

// Unknown page route -> custom 404 page (Phase 21 UI polish)
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

// Test the database connection on startup
testConnection();

// Start the server
app.listen(PORT, () => {
  console.log(`TaskMaster server running on http://localhost:${PORT}`);
});