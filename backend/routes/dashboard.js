const express = require('express');
const { neon } = require('@neondatabase/serverless');
const router = express.Router();

const sql = neon(process.env.DATABASE_URL);

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    // Get basic counts
    const projectStats = await sql`
      SELECT 
        COUNT(*) as total_projects,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_projects,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_projects,
        AVG(progress) as avg_progress
      FROM projects
    `;

    const taskStats = await sql`
      SELECT 
        COUNT(*) as total_tasks,
        COUNT(CASE WHEN status = 'todo' THEN 1 END) as todo_tasks,
        COUNT(CASE WHEN status = 'in-progress' THEN 1 END) as active_tasks,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_tasks
      FROM tasks
    `;

    const printJobStats = await sql`
      SELECT 
        COUNT(*) as total_print_jobs,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_jobs,
        COUNT(CASE WHEN status = 'printing' THEN 1 END) as active_jobs,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_jobs
      FROM print_jobs
    `.catch(() => [{ total_print_jobs: 0, pending_jobs: 0, active_jobs: 0, completed_jobs: 0 }]);

    const invoiceStats = await sql`
      SELECT 
        COUNT(*) as total_invoices,
        COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid_invoices,
        COUNT(CASE WHEN status IN ('pending', 'sent') THEN 1 END) as pending_invoices,
        SUM(total_amount) as total_revenue,
        SUM(CASE WHEN status = 'paid' THEN total_amount ELSE 0 END) as paid_revenue,
        SUM(CASE WHEN status IN ('pending', 'sent') THEN total_amount ELSE 0 END) as outstanding_revenue
      FROM invoices
    `;

    const userStats = await sql`
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN role = 'client' THEN 1 END) as total_clients
      FROM users
    `;

    res.json({
      success: true,
      data: {
        projects: projectStats[0],
        tasks: taskStats[0],
        printJobs: printJobStats[0],
        invoices: invoiceStats[0],
        users: userStats[0]
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/dashboard/recent-activities
// @desc    Get recent activities across the system
// @access  Private
router.get('/recent-activities', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    // Get recent projects
    const recentProjects = await sql`
      SELECT 'project' as type, name as title, created_at, status
      FROM projects
      ORDER BY created_at DESC
      LIMIT 5
    `;

    // Get recent tasks
    const recentTasks = await sql`
      SELECT 'task' as type, title, created_at, status
      FROM tasks
      ORDER BY created_at DESC
      LIMIT 5
    `;

    // Get recent invoices
    const recentInvoices = await sql`
      SELECT 'invoice' as type, invoice_number as title, created_at, status
      FROM invoices
      ORDER BY created_at DESC
      LIMIT 5
    `;

    // Combine and sort all activities
    const allActivities = [
      ...recentProjects.map(item => ({ ...item, icon: '📁' })),
      ...recentTasks.map(item => ({ ...item, icon: '✅' })),
      ...recentInvoices.map(item => ({ ...item, icon: '📄' }))
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
     .slice(0, limit);

    res.json({
      success: true,
      data: allActivities
    });
  } catch (error) {
    console.error('Get recent activities error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/dashboard/revenue-chart
// @desc    Get revenue data for charts
// @access  Private
router.get('/revenue-chart', async (req, res) => {
  try {
    const { period = '6months' } = req.query;

    let dateCondition = '';
    if (period === '6months') {
      dateCondition = "WHERE created_at >= CURRENT_DATE - INTERVAL '6 months'";
    } else if (period === '1year') {
      dateCondition = "WHERE created_at >= CURRENT_DATE - INTERVAL '1 year'";
    }

    const revenueData = await sql.unsafe(`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        SUM(total_amount) as total_amount,
        COUNT(*) as invoice_count,
        currency
      FROM invoices
      ${dateCondition}
      GROUP BY DATE_TRUNC('month', created_at), currency
      ORDER BY month DESC
    `);

    res.json({
      success: true,
      data: revenueData
    });
  } catch (error) {
    console.error('Get revenue chart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/dashboard/project-status-chart
// @desc    Get project status distribution for charts
// @access  Private
router.get('/project-status-chart', async (req, res) => {
  try {
    const statusData = await sql`
      SELECT 
        status,
        COUNT(*) as count,
        AVG(progress) as avg_progress
      FROM projects
      GROUP BY status
      ORDER BY count DESC
    `;

    res.json({
      success: true,
      data: statusData
    });
  } catch (error) {
    console.error('Get project status chart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/dashboard/upcoming-deadlines
// @desc    Get upcoming project deadlines
// @access  Private
router.get('/upcoming-deadlines', async (req, res) => {
  try {
    const deadlines = await sql`
      SELECT p.*, u.name as client_name
      FROM projects p
      LEFT JOIN users u ON p.client_id = u.id
      WHERE p.deadline >= CURRENT_DATE
      AND p.deadline <= CURRENT_DATE + INTERVAL '30 days'
      AND p.status != 'completed'
      ORDER BY p.deadline ASC
      LIMIT 10
    `;

    res.json({
      success: true,
      data: deadlines
    });
  } catch (error) {
    console.error('Get upcoming deadlines error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/dashboard/overdue-items
// @desc    Get overdue projects and invoices
// @access  Private
router.get('/overdue-items', async (req, res) => {
  try {
    // Overdue projects
    const overdueProjects = await sql`
      SELECT 'project' as type, id, name as title, deadline as due_date, client_id
      FROM projects
      WHERE deadline < CURRENT_DATE AND status != 'completed'
      ORDER BY deadline ASC
    `;

    // Overdue invoices
    const overdueInvoices = await sql`
      SELECT 'invoice' as type, id, invoice_number as title, due_date, client_id
      FROM invoices
      WHERE due_date < CURRENT_DATE AND status IN ('pending', 'sent')
      ORDER BY due_date ASC
    `;

    const allOverdue = [...overdueProjects, ...overdueInvoices]
      .sort((a, b) => new Date(a.due_date) - new Date(b.due_date));

    res.json({
      success: true,
      data: allOverdue
    });
  } catch (error) {
    console.error('Get overdue items error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/dashboard/top-clients
// @desc    Get top clients by revenue
// @access  Private
router.get('/top-clients', async (req, res) => {
  try {
    const topClients = await sql`
      SELECT 
        u.id, u.name, u.company_name,
        COUNT(DISTINCT p.id) as project_count,
        COUNT(DISTINCT i.id) as invoice_count,
        COALESCE(SUM(i.total_amount), 0) as total_revenue
      FROM users u
      LEFT JOIN projects p ON u.id = p.client_id
      LEFT JOIN invoices i ON u.id = i.client_id
      WHERE u.role = 'client'
      GROUP BY u.id, u.name, u.company_name
      HAVING COUNT(DISTINCT p.id) > 0 OR COUNT(DISTINCT i.id) > 0
      ORDER BY total_revenue DESC
      LIMIT 10
    `;

    res.json({
      success: true,
      data: topClients
    });
  } catch (error) {
    console.error('Get top clients error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
