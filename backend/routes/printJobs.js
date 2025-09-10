const express = require('express');
const { neon } = require('@neondatabase/serverless');
const router = express.Router();

const sql = neon(process.env.DATABASE_URL);

// @route   GET /api/print-jobs
// @desc    Get all print jobs
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { status, machine, priority } = req.query;

    let query = `
      SELECT pj.*, p.name as project_name, u.name as operator_name
      FROM print_jobs pj
      LEFT JOIN projects p ON pj.project_id = p.id
      LEFT JOIN users u ON pj.operator_id = u.id
    `;

    const conditions = [];
    const params = [];

    if (status) {
      conditions.push(`pj.status = $${params.length + 1}`);
      params.push(status);
    }

    if (machine) {
      conditions.push(`pj.machine_name = $${params.length + 1}`);
      params.push(machine);
    }

    if (priority) {
      conditions.push(`pj.priority = $${params.length + 1}`);
      params.push(priority);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ` ORDER BY pj.created_at DESC`;

    const printJobs = await sql.unsafe(query, params);

    res.json({
      success: true,
      data: printJobs
    });
  } catch (error) {
    console.error('Get print jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/print-jobs/:id
// @desc    Get single print job
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const printJobs = await sql`
      SELECT pj.*, p.name as project_name, u.name as operator_name
      FROM print_jobs pj
      LEFT JOIN projects p ON pj.project_id = p.id
      LEFT JOIN users u ON pj.operator_id = u.id
      WHERE pj.id = ${id}
      LIMIT 1
    `;

    if (printJobs.length === 0) {
      return res.status(404).json({ message: 'Print job not found' });
    }

    res.json({
      success: true,
      data: printJobs[0]
    });
  } catch (error) {
    console.error('Get print job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/print-jobs
// @desc    Create new print job
// @access  Private
router.post('/', async (req, res) => {
  try {
    const {
      job_title,
      project_id,
      operator_id,
      machine_name,
      status = 'pending',
      priority = 'medium',
      quantity_ordered,
      quantity_printed = 0,
      paper_type,
      print_settings,
      estimated_completion,
      notes
    } = req.body;

    if (!job_title || !project_id || !machine_name || !quantity_ordered) {
      return res.status(400).json({ 
        message: 'Job title, project ID, machine name, and quantity ordered are required' 
      });
    }

    const newPrintJob = await sql`
      INSERT INTO print_jobs (
        job_title, project_id, operator_id, machine_name, status, priority,
        quantity_ordered, quantity_printed, paper_type, print_settings,
        estimated_completion, notes
      )
      VALUES (
        ${job_title}, ${project_id}, ${operator_id}, ${machine_name}, ${status}, ${priority},
        ${quantity_ordered}, ${quantity_printed}, ${paper_type}, ${print_settings},
        ${estimated_completion}, ${notes}
      )
      RETURNING *
    `;

    res.status(201).json({
      success: true,
      data: newPrintJob[0]
    });
  } catch (error) {
    console.error('Create print job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/print-jobs/:id
// @desc    Update print job
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      job_title,
      operator_id,
      machine_name,
      status,
      priority,
      quantity_ordered,
      quantity_printed,
      paper_type,
      print_settings,
      estimated_completion,
      actual_completion,
      notes
    } = req.body;

    const updatedPrintJob = await sql`
      UPDATE print_jobs SET
        job_title = COALESCE(${job_title}, job_title),
        operator_id = COALESCE(${operator_id}, operator_id),
        machine_name = COALESCE(${machine_name}, machine_name),
        status = COALESCE(${status}, status),
        priority = COALESCE(${priority}, priority),
        quantity_ordered = COALESCE(${quantity_ordered}, quantity_ordered),
        quantity_printed = COALESCE(${quantity_printed}, quantity_printed),
        paper_type = COALESCE(${paper_type}, paper_type),
        print_settings = COALESCE(${print_settings}, print_settings),
        estimated_completion = COALESCE(${estimated_completion}, estimated_completion),
        actual_completion = COALESCE(${actual_completion}, actual_completion),
        notes = COALESCE(${notes}, notes),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;

    if (updatedPrintJob.length === 0) {
      return res.status(404).json({ message: 'Print job not found' });
    }

    res.json({
      success: true,
      data: updatedPrintJob[0]
    });
  } catch (error) {
    console.error('Update print job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/print-jobs/:id/status
// @desc    Update print job status
// @access  Private
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, quantity_printed } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const updateData = { status };

    if (quantity_printed !== undefined) {
      updateData.quantity_printed = quantity_printed;
    }

    if (status === 'completed') {
      updateData.actual_completion = new Date().toISOString();
    }

    const updatedPrintJob = await sql`
      UPDATE print_jobs SET
        status = ${status},
        quantity_printed = COALESCE(${quantity_printed}, quantity_printed),
        actual_completion = CASE WHEN ${status} = 'completed' THEN CURRENT_TIMESTAMP ELSE actual_completion END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;

    if (updatedPrintJob.length === 0) {
      return res.status(404).json({ message: 'Print job not found' });
    }

    res.json({
      success: true,
      data: updatedPrintJob[0]
    });
  } catch (error) {
    console.error('Update print job status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/print-jobs/:id
// @desc    Delete print job
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPrintJob = await sql`
      DELETE FROM print_jobs WHERE id = ${id}
      RETURNING *
    `;

    if (deletedPrintJob.length === 0) {
      return res.status(404).json({ message: 'Print job not found' });
    }

    res.json({
      success: true,
      message: 'Print job deleted successfully'
    });
  } catch (error) {
    console.error('Delete print job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/print-jobs/queue/:machine
// @desc    Get print queue for specific machine
// @access  Private
router.get('/queue/:machine', async (req, res) => {
  try {
    const { machine } = req.params;

    const queue = await sql`
      SELECT pj.*, p.name as project_name
      FROM print_jobs pj
      LEFT JOIN projects p ON pj.project_id = p.id
      WHERE pj.machine_name = ${machine}
      AND pj.status IN ('pending', 'printing', 'paused')
      ORDER BY 
        CASE pj.priority 
          WHEN 'urgent' THEN 1 
          WHEN 'high' THEN 2 
          WHEN 'medium' THEN 3 
          WHEN 'low' THEN 4 
        END,
        pj.created_at ASC
    `;

    res.json({
      success: true,
      data: queue
    });
  } catch (error) {
    console.error('Get print queue error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
