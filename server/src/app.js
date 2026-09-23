const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const env = require('./config/env');
const { errorHandler } = require('./middleware/errorMiddleware');

const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const buyerRoutes = require('./routes/buyerRoutes');
const outreachRoutes = require('./routes/outreachRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

const app = express();

// Security Headers
app.use(helmet());

// CORS Configuration
app.use(cors({
  origin: [env.clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register API Routes
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/buyers', buyerRoutes);
app.use('/api/outreach', outreachRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/settings', settingsRoutes);

// 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

module.exports = app;
