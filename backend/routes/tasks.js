const express = require('express');
const Task = require('../models/Task');
const { auth } = require('../middleware/auth');
const router = express.Router();

// GET all tasks
router.get('/', auth, async (req, res) => {
  try {
    const { project, status, assignedTo } = req.query;
    const filter = {};

    if (project) filter.project = project;
    if (status) filter.status = status;
    if (assignedTo) filter.assignedTo = { $in: assignedTo.split(',') };

    const tasks = await Task.find(filter)
      .populate('project', 'name category budget_amount')
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: tasks });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// CREATE new task
router.post('/', auth, async (req, res) => {
  try {
    const {
      title,
      description,
      project,
      status = 'todo',
      priority = 'medium',
      assignedTo = [],
      category = 'design',
      dueDate,
      startDate,
      estimatedHours,
      tags = [],
    } = req.body;

    // Validate required fields
    if (!title || !project) {
      return res.status(400).json({ success: false, message: 'Title and project are required' });
    }

    const task = new Task({
      title,
      description,
      project,
      category,
      status,
      priority,
      assignedTo,
      createdBy: req.user._id,
      dueDate,
      startDate,
      estimatedHours,
      tags,
    });

    const savedTask = await task.save();
    res.status(201).json({ success: true, data: savedTask });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// UPDATE task
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.json({ success: true, data: task });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;
