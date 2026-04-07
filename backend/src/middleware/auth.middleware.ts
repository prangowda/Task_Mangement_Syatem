// ============================================================
// src/middleware/auth.middleware.ts — JWT Authentication guard
// ============================================================

import { Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { sendError } from '../utils/apiResponse';
import { AuthRequest } from '../types';

/**
 * Middleware: authenticate
 * Validates the Bearer token from the Authorization header.
 * Attaches decoded user payload to req.user on success.
 */
export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendError(res, 'Access token is required', 401);
    return;
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyAccessToken(token);

  if (!payload) {
    sendError(res, 'Invalid or expired access token', 401);
    return;
  }

  req.user = payload;
  next();
};
