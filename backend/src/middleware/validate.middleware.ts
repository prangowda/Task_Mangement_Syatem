// ============================================================
// src/middleware/validate.middleware.ts — Request validation
// ============================================================

import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { sendError } from '../utils/apiResponse';

/**
 * Factory: returns a middleware that validates req.body against a Zod schema.
 * Responds with 400 + field-level errors on failure.
 */
export const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = formatZodErrors(result.error);
      sendError(res, 'Validation failed', 400, errors);
      return;
    }

    // Replace req.body with the parsed (and coerced) data
    req.body = result.data;
    next();
  };

/**
 * Converts ZodError to a flat field → messages map
 */
const formatZodErrors = (error: ZodError): Record<string, string[]> => {
  const errors: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const field = issue.path.join('.');
    if (!errors[field]) errors[field] = [];
    errors[field].push(issue.message);
  }

  return errors;
};
