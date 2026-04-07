// ============================================================
// src/middleware/error.middleware.ts — Centralized error handler
// ============================================================

import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

/**
 * Custom application error with HTTP status code
 */
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error handling middleware.
 * Must be registered LAST in the middleware chain.
 */
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('[Error]', err);

  // Known application error
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Prisma — record not found
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2025') {
      res.status(404).json({ success: false, message: 'Resource not found' });
      return;
    }
    if (err.code === 'P2002') {
      res.status(409).json({ success: false, message: 'Duplicate entry — resource already exists' });
      return;
    }
  }

  // Unknown server error
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
};

/**
 * 404 handler for unmatched routes
 */
export const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route ${_req.method} ${_req.originalUrl} not found`,
  });
};
