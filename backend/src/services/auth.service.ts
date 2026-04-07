// ============================================================
// src/services/auth.service.ts — Authentication business logic
// ============================================================

import bcrypt from 'bcryptjs';
import prisma from '../utils/prismaClient';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  getExpiryDate,
} from '../utils/jwt';
import { AppError } from '../middleware/error.middleware';
import type { RegisterInput, LoginInput } from '../utils/validators';

const BCRYPT_ROUNDS = 12;
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

// ── Auth Service ─────────────────────────────────────────────

/**
 * Register a new user
 */
export const registerUser = async (input: RegisterInput) => {
  const { email, password, name } = input;

  // Check for existing user
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new AppError('Email is already registered', 409);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

  // Create user
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name },
    select: { id: true, email: true, name: true, createdAt: true },
  });

  // Issue token pair
  const tokenPair = await issueTokenPair(user.id, user.email);

  return { user, ...tokenPair };
};

/**
 * Login an existing user
 */
export const loginUser = async (input: LoginInput) => {
  const { email, password } = input;

  // Find user
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  // Verify password
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new AppError('Invalid email or password', 401);
  }

  // Issue token pair
  const tokenPair = await issueTokenPair(user.id, user.email);

  return {
    user: { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt },
    ...tokenPair,
  };
};

/**
 * Refresh the access token using a valid refresh token
 */
export const refreshAccessToken = async (token: string) => {
  // Verify signature
  const payload = verifyRefreshToken(token);
  if (!payload) {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  // Check token exists in DB (ensures it hasn't been revoked)
  const stored = await prisma.refreshToken.findUnique({ where: { token } });
  if (!stored) {
    throw new AppError('Refresh token not found or already revoked', 401);
  }

  // Check expiry stored in DB
  if (stored.expiresAt < new Date()) {
    await prisma.refreshToken.delete({ where: { id: stored.id } });
    throw new AppError('Refresh token has expired', 401);
  }

  // Issue new access token (rotate refresh token for security)
  await prisma.refreshToken.delete({ where: { id: stored.id } });
  const tokenPair = await issueTokenPair(payload.userId, payload.email);

  return tokenPair;
};

/**
 * Logout — invalidate the refresh token
 */
export const logoutUser = async (token: string) => {
  // Silently ignore if token doesn't exist (idempotent)
  await prisma.refreshToken.deleteMany({ where: { token } });
};

// ── Internal helpers ─────────────────────────────────────────

/**
 * Create a token pair (access + refresh) and persist refresh token
 */
const issueTokenPair = async (userId: string, email: string) => {
  const jwtPayload = { userId, email };

  const accessToken = generateAccessToken(jwtPayload);
  const refreshToken = generateRefreshToken(jwtPayload);
  const expiresAt = getExpiryDate(REFRESH_EXPIRES);

  // Store refresh token
  await prisma.refreshToken.create({
    data: { token: refreshToken, userId, expiresAt },
  });

  return { accessToken, refreshToken };
};
