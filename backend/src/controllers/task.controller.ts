// ============================================================
// src/controllers/task.controller.ts — Task HTTP handlers
// ============================================================

import { Response } from 'express';
import * as taskService from '../services/task.service';
import { sendSuccess } from '../utils/apiResponse';
import { AuthRequest, TaskQueryParams } from '../types';
import { AppError } from '../middleware/error.middleware';

// ── GET /tasks ───────────────────────────────────────────────
export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw new AppError('Unauthorized', 401);

  const query = req.query as TaskQueryParams;
  const { tasks, meta } = await taskService.getUserTasks(req.user.userId, query);

  sendSuccess(res, tasks, 'Tasks retrieved successfully', 200, meta);
};

// ── POST /tasks ──────────────────────────────────────────────
export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw new AppError('Unauthorized', 401);

  const task = await taskService.createTask(req.user.userId, req.body);
  sendSuccess(res, task, 'Task created successfully', 201);
};

// ── GET /tasks/:id ───────────────────────────────────────────
export const getTask = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw new AppError('Unauthorized', 401);

  const task = await taskService.getTaskById(req.params.id, req.user.userId);
  sendSuccess(res, task, 'Task retrieved successfully');
};

// ── PATCH /tasks/:id ─────────────────────────────────────────
export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw new AppError('Unauthorized', 401);

  const task = await taskService.updateTask(req.params.id, req.user.userId, req.body);
  sendSuccess(res, task, 'Task updated successfully');
};

// ── DELETE /tasks/:id ────────────────────────────────────────
export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw new AppError('Unauthorized', 401);

  await taskService.deleteTask(req.params.id, req.user.userId);
  sendSuccess(res, null, 'Task deleted successfully');
};

// ── PATCH /tasks/:id/toggle ──────────────────────────────────
export const toggleTask = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw new AppError('Unauthorized', 401);

  const task = await taskService.toggleTaskStatus(req.params.id, req.user.userId);
  sendSuccess(res, task, `Task marked as ${task.status.toLowerCase()}`);
};
