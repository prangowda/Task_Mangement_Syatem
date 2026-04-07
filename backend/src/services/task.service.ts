// ============================================================
// src/services/task.service.ts — Task business logic
// ============================================================

import { TaskStatus } from '@prisma/client';
import prisma from '../utils/prismaClient';
import { AppError } from '../middleware/error.middleware';
import { buildPaginationMeta } from '../utils/apiResponse';
import type { CreateTaskInput, UpdateTaskInput } from '../utils/validators';
import type { TaskQueryParams } from '../types';

// ── Task Service ─────────────────────────────────────────────

/**
 * Get paginated tasks for a user with optional filter & search
 */
export const getUserTasks = async (userId: string, query: TaskQueryParams) => {
  const page = Math.max(1, parseInt(query.page || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || '10', 10)));
  const skip = (page - 1) * limit;

  // Build Prisma where clause
  const where: Parameters<typeof prisma.task.findMany>[0]['where'] = {
    userId,
    ...(query.status && { status: query.status as TaskStatus }),
    ...(query.search && {
      title: { contains: query.search, mode: 'insensitive' },
    }),
  };

  // Run count + data queries in parallel
  const [total, tasks] = await Promise.all([
    prisma.task.count({ where }),
    prisma.task.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
      },
    }),
  ]);

  const meta = buildPaginationMeta(total, page, limit);
  return { tasks, meta };
};

/**
 * Get a single task by ID — must belong to the user
 */
export const getTaskById = async (taskId: string, userId: string) => {
  const task = await prisma.task.findFirst({
    where: { id: taskId, userId },
  });

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  return task;
};

/**
 * Create a new task for the user
 */
export const createTask = async (userId: string, input: CreateTaskInput) => {
  return prisma.task.create({
    data: {
      title: input.title,
      description: input.description,
      status: (input.status as TaskStatus) || 'PENDING',
      userId,
    },
  });
};

/**
 * Update an existing task — must belong to the user
 */
export const updateTask = async (
  taskId: string,
  userId: string,
  input: UpdateTaskInput
) => {
  // Verify ownership first
  await getTaskById(taskId, userId);

  return prisma.task.update({
    where: { id: taskId },
    data: {
      ...(input.title !== undefined && { title: input.title }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.status !== undefined && { status: input.status as TaskStatus }),
    },
  });
};

/**
 * Delete a task — must belong to the user
 */
export const deleteTask = async (taskId: string, userId: string) => {
  // Verify ownership first
  await getTaskById(taskId, userId);

  return prisma.task.delete({ where: { id: taskId } });
};

/**
 * Toggle task status between PENDING and COMPLETED
 */
export const toggleTaskStatus = async (taskId: string, userId: string) => {
  const task = await getTaskById(taskId, userId);
  const newStatus: TaskStatus =
    task.status === 'PENDING' ? 'COMPLETED' : 'PENDING';

  return prisma.task.update({
    where: { id: taskId },
    data: { status: newStatus },
  });
};
