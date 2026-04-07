// ============================================================
// src/controllers/auth.controller.ts — Auth HTTP handlers
// ============================================================

import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { sendSuccess } from '../utils/apiResponse';
import { AuthRequest } from '../types';

// ── POST /auth/register ──────────────────────────────────────
export const register = async (req: Request, res: Response): Promise<void> => {
  const result = await authService.registerUser(req.body);
  sendSuccess(res, result, 'Account created successfully', 201);
};

// ── POST /auth/login ─────────────────────────────────────────
export const login = async (req: Request, res: Response): Promise<void> => {
  const result = await authService.loginUser(req.body);
  sendSuccess(res, result, 'Login successful');
};

// ── POST /auth/refresh ───────────────────────────────────────
export const refresh = async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.body;
  const tokens = await authService.refreshAccessToken(refreshToken);
  sendSuccess(res, tokens, 'Token refreshed');
};

// ── POST /auth/logout ────────────────────────────────────────
export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  const { refreshToken } = req.body;
  await authService.logoutUser(refreshToken);
  sendSuccess(res, null, 'Logged out successfully');
};

// ── GET /auth/me ─────────────────────────────────────────────
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  sendSuccess(res, req.user, 'Authenticated user');
};
