// ============================================================
// src/types/index.ts — Shared TypeScript types
// ============================================================

import { Request } from 'express';
import { TaskStatus } from '@prisma/client';

// ── Auth ────────────────────────────────────────────────────
export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

/** Extends Express Request to include the authenticated user */
export interface AuthRequest extends Request {
  user?: JwtPayload;
}

// ── Task Query Params ────────────────────────────────────────
export interface TaskQueryParams {
  page?: string;
  limit?: string;
  status?: TaskStatus;
  search?: string;
}

// ── API Response utilities ───────────────────────────────────
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
  errors?: Record<string, string[]>;
}
