// ============================================================
// src/utils/jwt.ts — JWT utility functions
// ============================================================

import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types';

// ── Environment validation ───────────────────────────────────
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error('JWT secrets must be defined in environment variables');
}

// ── Token Generators ────────────────────────────────────────

/**
 * Generate a short-lived access token (default: 15 min)
 */
export const generateAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRES as jwt.SignOptions['expiresIn'],
  });
};

/**
 * Generate a long-lived refresh token (default: 7 days)
 */
export const generateRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRES as jwt.SignOptions['expiresIn'],
  });
};

// ── Token Verifiers ─────────────────────────────────────────

/**
 * Verify and decode an access token. Returns null on failure.
 */
export const verifyAccessToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
  } catch {
    return null;
  }
};

/**
 * Verify and decode a refresh token. Returns null on failure.
 */
export const verifyRefreshToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
  } catch {
    return null;
  }
};

/**
 * Calculate expiry date from a duration string (e.g. '7d', '15m')
 */
export const getExpiryDate = (duration: string): Date => {
  const now = new Date();
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) throw new Error(`Invalid duration format: ${duration}`);

  const value = parseInt(match[1]);
  const unit = match[2];

  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return new Date(now.getTime() + value * multipliers[unit]);
};
