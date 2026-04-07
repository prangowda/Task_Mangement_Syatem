// ============================================================
// src/utils/apiResponse.ts — Standardized API response helpers
// ============================================================

import { Response } from 'express';
import { ApiResponse, PaginationMeta } from '../types';

/**
 * Send a successful response (2xx)
 */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200,
  meta?: PaginationMeta
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    ...(meta && { meta }),
  };
  return res.status(statusCode).json(response);
};

/**
 * Send an error response (4xx / 5xx)
 */
export const sendError = (
  res: Response,
  message: string,
  statusCode = 500,
  errors?: Record<string, string[]>
): Response => {
  const response: ApiResponse = {
    success: false,
    message,
    ...(errors && { errors }),
  };
  return res.status(statusCode).json(response);
};

/**
 * Calculate pagination metadata
 */
export const buildPaginationMeta = (
  total: number,
  page: number,
  limit: number
): PaginationMeta => {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};
