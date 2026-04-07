// ============================================================
// src/app.ts — Express application setup
// ============================================================

import 'express-async-errors'; // Must be imported before express
import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Routes
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';

// Middleware
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

// Load environment variables
dotenv.config();

const app: Application = express();

// ── Security & Parsing ───────────────────────────────────────

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy: origin ${origin} not allowed`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Health Check ─────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Task Management API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ── API Routes ───────────────────────────────────────────────
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

// ── Error Handling ───────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
