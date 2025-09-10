const express = require('express');
const { neon } = require('@neondatabase/serverless');
const router = express.Router();

const sql = neon(process.env.DATABASE_URL);

// @route   GET /api/projects
// @desc    Get all projects
// @access  Private
router.get('/', async (req, res) => {
  try {
    const projects = await sql`
      SELECT p.*, u.name as client_name, u.company_name
      FROM projects p
      LEFT JOIN users u ON p.client_id = u.id
      ORDER BY p.created_at DESC
    `;

    res.json({
      success: true,
      data: projects
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/projects/:id
// @desc    Get single project
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const projects = await sql`
      SELECT p.*, u.name as client_name, u.company_name, u.email as client_email
      FROM projects p
      LEFT JOIN users u ON p.client_id = u.id
      WHERE p.id = ${id}
      LIMIT 1
    `;

    if (projects.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Get project tasks
    const tasks = await sql`
      SELECT * FROM tasks WHERE project_id = ${id}
      ORDER BY created_at DESC
    `;

    res.json({
      success: true,
      data: {
        ...projects[0],
        tasks
      }
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/projects
// @desc    Create new project
// @access  Private
router.post('/', async (req, res) => {
  try {
    const {
      name,
      description,
      client_id,
      status = 'draft',
      priority = 'medium',
      category,
      deadline,
      budget_amount,
      budget_currency = 'AED',
      progress = 0
    } = req.body;

    // Validation
    if (!name || !category) {
      return res.status(400).json({ message: 'Name and category are required' });
    }

    const newProject = await sql`
      INSERT INTO projects (
        name, description, client_id, status, priority, category,
        deadline, budget_amount, budget_currency, progress
      )
      VALUES (
        ${name}, ${description}, ${client_id}, ${status}, ${priority}, ${category},
        ${deadline}, ${budget_amount}, ${budget_currency}, ${progress}
      )
      RETURNING *
    `;

    res.status(201).json({
      success: true,
      data: newProject[0]
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      client_id,
      status,
      priority,
      category,
      deadline,
      budget_amount,
      budget_currency,
      progress
    } = req.body;

    const updatedProject = await sql`
      UPDATE projects SET
        name = COALESCE(${name}, name),
        description = COALESCE(${description}, description),
        client_id = COALESCE(${client_id}, client_id),
        status = COALESCE(${status}, status),
        priority = COALESCE(${priority}, priority),
        category = COALESCE(${category}, category),
        deadline = COALESCE(${deadline}, deadline),
        budget_amount = COALESCE(${budget_amount}, budget_amount),
        budget_currency = COALESCE(${budget_currency}, budget_currency),
        progress = COALESCE(${progress}, progress),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;

    if (updatedProject.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({
      success: true,
      data: updatedProject[0]
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Delete related tasks first
    await sql`DELETE FROM tasks WHERE project_id = ${id}`;

    // Delete project
    const deletedProject = await sql`
      DELETE FROM projects WHERE id = ${id}
      RETURNING *
    `;

    if (deletedProject.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/projects/client/:clientId
// @desc    Get projects by client
// @access  Private
router.get('/client/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;

    const projects = await sql`
      SELECT * FROM projects
      WHERE client_id = ${clientId}
      ORDER BY created_at DESC
    `;

    res.json({
      success: true,
      data: projects
    });
  } catch (error) {
    console.error('Get client projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
