const express = require('express');
const router = express.Router();

const Project = require('../models/Project');
const Task = require('../models/Task');
const PrintJob = require('../models/PrintJob');
const Invoice = require('../models/Invoice');
const User = require('../models/User');

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    const projects = await Project.aggregate([
      { $group: {
        _id: null,
        total_projects: { $sum: 1 },
        active_projects: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
        completed_projects: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
        avg_progress: { $avg: '$progress' }
      }}
    ]);

    const tasks = await Task.aggregate([
      { $group: {
        _id: null,
        total_tasks: { $sum: 1 },
        todo_tasks: { $sum: { $cond: [{ $eq: ['$status', 'todo'] }, 1, 0] } },
        active_tasks: { $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] } },
        completed_tasks: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } }
      }}
    ]);

    const printJobs = await PrintJob.aggregate([
      { $group: {
        _id: null,
        total_print_jobs: { $sum: 1 },
        pending_jobs: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
        active_jobs: { $sum: { $cond: [{ $eq: ['$status', 'printing'] }, 1, 0] } },
        completed_jobs: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } }
      }}
    ]);

    const invoices = await Invoice.aggregate([
      { $group: {
        _id: null,
        total_invoices: { $sum: 1 },
        paid_invoices: { $sum: { $cond: [{ $eq: ['$status', 'paid'] }, 1, 0] } },
        pending_invoices: { $sum: { $cond: [{ $in: ['$status', ['pending', 'sent']] }, 1, 0] } },
        total_revenue: { $sum: '$total_amount' },
        paid_revenue: { $sum: { $cond: [{ $eq: ['$status', 'paid'] }, '$total_amount', 0] } },
        outstanding_revenue: { $sum: { $cond: [{ $in: ['$status', ['pending', 'sent']] }, '$total_amount', 0] } }
      }}
    ]);

    const users = await User.aggregate([
      { $group: {
        _id: null,
        total_users: { $sum: 1 },
        total_clients: { $sum: { $cond: [{ $eq: ['$role', 'client'] }, 1, 0] } }
      }}
    ]);

    res.json({
      success: true,
      data: {
        projects: projects[0] || {},
        tasks: tasks[0] || {},
        printJobs: printJobs[0] || {},
        invoices: invoices[0] || {},
        users: users[0] || {}
      }
    });
  } catch (err) {
    console.error('Get dashboard stats error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/dashboard/recent-activities
// @desc    Get recent activities across the system
// @access  Private
router.get('/recent-activities', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const recentProjects = await Project.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name createdAt status');

    const recentTasks = await Task.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title createdAt status');

    const recentInvoices = await Invoice.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select('invoice_number createdAt status');

    const allActivities = [
      ...recentProjects.map(p => ({ type: 'project', title: p.name, created_at: p.createdAt, status: p.status, icon: '📁' })),
      ...recentTasks.map(t => ({ type: 'task', title: t.title, created_at: t.createdAt, status: t.status, icon: '✅' })),
      ...recentInvoices.map(i => ({ type: 'invoice', title: i.invoice_number, created_at: i.createdAt, status: i.status, icon: '📄' }))
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
     .slice(0, limit);

    res.json({ success: true, data: allActivities });
  } catch (err) {
    console.error('Get recent activities error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/dashboard/upcoming-deadlines
// @desc    Get upcoming project deadlines
// @access  Private
router.get('/upcoming-deadlines', async (req, res) => {
  try {
    const today = new Date();
    const next30Days = new Date();
    next30Days.setDate(today.getDate() + 30);

    const deadlines = await Project.find({
      deadline: { $gte: today, $lte: next30Days },
      status: { $ne: 'completed' }
    }).populate('client_id', 'name')
      .sort({ deadline: 1 })
      .limit(10);

    res.json({ success: true, data: deadlines });
  } catch (err) {
    console.error('Get upcoming deadlines error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/dashboard/overdue-items
// @desc    Get overdue projects and invoices
// @access  Private
router.get('/overdue-items', async (req, res) => {
  try {
    const today = new Date();

    const overdueProjects = await Project.find({ deadline: { $lt: today }, status: { $ne: 'completed' } })
      .select('name deadline client_id')
      .lean();

    const overdueInvoices = await Invoice.find({ due_date: { $lt: today }, status: { $in: ['pending', 'sent'] } })
      .select('invoice_number due_date client_id')
      .lean();

    const allOverdue = [
      ...overdueProjects.map(p => ({ type: 'project', title: p.name, due_date: p.deadline, client_id: p.client_id })),
      ...overdueInvoices.map(i => ({ type: 'invoice', title: i.invoice_number, due_date: i.due_date, client_id: i.client_id }))
    ].sort((a, b) => new Date(a.due_date) - new Date(b.due_date));

    res.json({ success: true, data: allOverdue });
  } catch (err) {
    console.error('Get overdue items error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/dashboard/top-clients
// @desc    Get top clients by revenue
// @access  Private
router.get('/top-clients', async (req, res) => {
  try {
    const clients = await User.aggregate([
      { $match: { role: 'client' } },
      {
        $lookup: {
          from: 'projects',
          localField: '_id',
          foreignField: 'client_id',
          as: 'projects'
        }
      },
      {
        $lookup: {
          from: 'invoices',
          localField: '_id',
          foreignField: 'client_id',
          as: 'invoices'
        }
      },
      {
        $addFields: {
          project_count: { $size: '$projects' },
          invoice_count: { $size: '$invoices' },
          total_revenue: { $sum: '$invoices.total_amount' }
        }
      },
      { $match: { $or: [{ project_count: { $gt: 0 } }, { invoice_count: { $gt: 0 } }] } },
      { $sort: { total_revenue: -1 } },
      { $limit: 10 },
      { $project: { name: 1, company_name: 1, project_count: 1, invoice_count: 1, total_revenue: 1 } }
    ]);

    res.json({ success: true, data: clients });
  } catch (err) {
    console.error('Get top clients error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
