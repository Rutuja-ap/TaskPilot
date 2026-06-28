const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { taskValidationRules, validate } = require('../middleware/validate');

// ─── GET /api/tasks ────────────────────────────────────────────────────────────
// Fetch all tasks with optional filtering, sorting, and searching
router.get('/', async (req, res) => {
  try {
    const {
      status,
      priority,
      search,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 50,
    } = req.query;

    // Build filter object dynamically
    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (priority && priority !== 'all') filter.priority = priority;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    // Sort direction
    const sortOrder = order === 'asc' ? 1 : -1;
    const allowedSortFields = ['createdAt', 'updatedAt', 'dueDate', 'priority', 'title'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(parseInt(limit)),
      Task.countDocuments(filter),
    ]);

    // Summary counts for dashboard
    const [todoCount, inProgressCount, completedCount] = await Promise.all([
      Task.countDocuments({ status: 'todo' }),
      Task.countDocuments({ status: 'in-progress' }),
      Task.countDocuments({ status: 'completed' }),
    ]);

    res.json({
      success: true,
      data: tasks,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
      summary: {
        todo: todoCount,
        inProgress: inProgressCount,
        completed: completedCount,
        total: todoCount + inProgressCount + completedCount,
      },
    });
  } catch (error) {
    console.error('GET /tasks error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching tasks' });
  }
});

// ─── GET /api/tasks/:id ────────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.json({ success: true, data: task });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid task ID' });
    }
    res.status(500).json({ success: false, message: 'Server error fetching task' });
  }
});

// ─── POST /api/tasks ───────────────────────────────────────────────────────────
router.post('/', taskValidationRules, validate, async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, tags } = req.body;

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate: dueDate || null,
      tags: tags || [],
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    console.error('POST /tasks error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error creating task' });
  }
});

// ─── PUT /api/tasks/:id ────────────────────────────────────────────────────────
router.put('/:id', taskValidationRules, validate, async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, tags } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, status, priority, dueDate: dueDate || null, tags: tags || [] },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: task,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid task ID' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error updating task' });
  }
});

// ─── PATCH /api/tasks/:id/status ──────────────────────────────────────────────
// Quick status update (drag-and-drop / quick toggle use case)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['todo', 'in-progress', 'completed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.json({ success: true, message: 'Status updated', data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating status' });
  }
});

// ─── DELETE /api/tasks/:id ─────────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.json({ success: true, message: 'Task deleted successfully', data: task });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid task ID' });
    }
    res.status(500).json({ success: false, message: 'Server error deleting task' });
  }
});

// ─── DELETE /api/tasks ─────────────────────────────────────────────────────────
// Delete all completed tasks (bulk cleanup)
router.delete('/', async (req, res) => {
  try {
    const { status } = req.query;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Provide a status query param to bulk delete' });
    }
    const result = await Task.deleteMany({ status });
    res.json({ success: true, message: `Deleted ${result.deletedCount} tasks`, deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error bulk deleting tasks' });
  }
});

module.exports = router;
