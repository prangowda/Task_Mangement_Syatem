// ============================================================
// src/routes/auth.routes.ts — Authentication endpoints
// ============================================================

import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { authenticate } from '../middleware/auth.middleware';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from '../utils/validators';

const router = Router();

/**
 * @route   POST /auth/register
 * @desc    Register a new user and return token pair
 * @access  Public
 */
router.post('/register', validate(registerSchema), authController.register);

/**
 * @route   POST /auth/login
 * @desc    Authenticate user and return token pair
 * @access  Public
 */
router.post('/login', validate(loginSchema), authController.login);

/**
 * @route   POST /auth/refresh
 * @desc    Issue a new access token using a valid refresh token
 * @access  Public
 */
router.post('/refresh', validate(refreshTokenSchema), authController.refresh);

/**
 * @route   POST /auth/logout
 * @desc    Revoke the refresh token
 * @access  Public (token optional — best-effort)
 */
router.post('/logout', validate(refreshTokenSchema), authController.logout);

/**
 * @route   GET /auth/me
 * @desc    Return the currently authenticated user
 * @access  Protected
 */
router.get('/me', authenticate, authController.getMe);

export default router;
