const express = require('express');
const { neon } = require('@neondatabase/serverless');
const router = express.Router();

const sql = neon(process.env.DATABASE_URL);

// @route   GET /api/tasks
// @desc    Get all tasks
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { project_id, status, assigned_to } = req.query;

    let query = `
      SELECT t.*, p.name as project_name, u.name as assigned_user_name
      FROM tasks t
      LEFT JOIN projects p ON t.project_id = p.id
      LEFT JOIN users u ON t.assigned_to = u.id
    `;

    const conditions = [];
    const params = [];

    if (project_id) {
      conditions.push(`t.project_id = $${params.length + 1}`);
      params.push(project_id);
    }

    if (status) {
      conditions.push(`t.status = $${params.length + 1}`);
      params.push(status);
    }

    if (assigned_to) {
      conditions.push(`t.assigned_to = $${params.length + 1}`);
      params.push(assigned_to);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ` ORDER BY t.created_at DESC`;

    const tasks = await sql.unsafe(query, params);

    res.json({
      success: true,
      data: tasks
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/tasks/:id
// @desc    Get single task
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const tasks = await sql`
      SELECT t.*, p.name as project_name, u.name as assigned_user_name
      FROM tasks t
      LEFT JOIN projects p ON t.project_id = p.id
      LEFT JOIN users u ON t.assigned_to = u.id
      WHERE t.id = ${id}
      LIMIT 1
    `;

    if (tasks.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({
      success: true,
      data: tasks[0]
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/tasks
// @desc    Create new task
// @access  Private
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      project_id,
      assigned_to,
      status = 'todo',
      priority = 'medium',
      due_date
    } = req.body;

    if (!title || !project_id) {
      return res.status(400).json({ message: 'Title and project ID are required' });
    }

    const newTask = await sql`
      INSERT INTO tasks (title, description, project_id, assigned_to, status, priority, due_date)
      VALUES (${title}, ${description}, ${project_id}, ${assigned_to}, ${status}, ${priority}, ${due_date})
      RETURNING *
    `;

    res.status(201).json({
      success: true,
      data: newTask[0]
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update task
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, assigned_to, status, priority, due_date } = req.body;

    const updatedTask = await sql`
      UPDATE tasks SET
        title = COALESCE(${title}, title),
        description = COALESCE(${description}, description),
        assigned_to = COALESCE(${assigned_to}, assigned_to),
        status = COALESCE(${status}, status),
        priority = COALESCE(${priority}, priority),
        due_date = COALESCE(${due_date}, due_date),
        completed_at = CASE WHEN ${status} = 'completed' THEN CURRENT_TIMESTAMP ELSE completed_at END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;

    if (updatedTask.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({
      success: true,
      data: updatedTask[0]
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete task
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTask = await sql`
      DELETE FROM tasks WHERE id = ${id}
      RETURNING *
    `;

    if (deletedTask.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/tasks/kanban/:project_id
// @desc    Get tasks organized for Kanban board
// @access  Private
router.get('/kanban/:project_id', async (req, res) => {
  try {
    const { project_id } = req.params;

    const tasks = await sql`
      SELECT t.*, u.name as assigned_user_name
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      WHERE t.project_id = ${project_id}
      ORDER BY t.created_at ASC
    `;

    // Organize tasks by status
    const kanban = {
      todo: tasks.filter(task => task.status === 'todo'),
      'in-progress': tasks.filter(task => task.status === 'in-progress'),
      review: tasks.filter(task => task.status === 'review'),
      completed: tasks.filter(task => task.status === 'completed')
    };

    res.json({
      success: true,
      data: kanban
    });
  } catch (error) {
    console.error('Get kanban tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
