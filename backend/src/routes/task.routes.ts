// ============================================================
// src/routes/task.routes.ts — Task endpoints (all protected)
// ============================================================

import { Router } from 'express';
import * as taskController from '../controllers/task.controller';
import { validate } from '../middleware/validate.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { createTaskSchema, updateTaskSchema } from '../utils/validators';

const router = Router();

// All task routes require a valid access token
router.use(authenticate);

/**
 * @route   GET /tasks
 * @desc    Get all tasks for the authenticated user (paginated, filterable)
 * @query   page, limit, status, search
 * @access  Protected
 */
router.get('/', taskController.getTasks);

/**
 * @route   POST /tasks
 * @desc    Create a new task
 * @access  Protected
 */
router.post('/', validate(createTaskSchema), taskController.createTask);

/**
 * @route   GET /tasks/:id
 * @desc    Get a single task by ID
 * @access  Protected
 */
router.get('/:id', taskController.getTask);

/**
 * @route   PATCH /tasks/:id
 * @desc    Update a task (partial update)
 * @access  Protected
 */
router.patch('/:id', validate(updateTaskSchema), taskController.updateTask);

/**
 * @route   DELETE /tasks/:id
 * @desc    Delete a task
 * @access  Protected
 */
router.delete('/:id', taskController.deleteTask);

/**
 * @route   PATCH /tasks/:id/toggle
 * @desc    Toggle task status between PENDING and COMPLETED
 * @access  Protected
 */
router.patch('/:id/toggle', taskController.toggleTask);

export default router;
