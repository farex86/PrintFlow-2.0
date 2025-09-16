const express = require('express');
const router = express.Router();
const PrintJob = require('../models/PrintJob'); // Make sure path is correct
const Project = require('../models/Project'); // If you need project info
const User = require('../models/User'); // If you need operator info

// @route   GET /api/print-jobs
// @desc    Get all print jobs (with optional filters)
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { status, machine, priority } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (machine) filter.machine = machine;
    if (priority) filter.priority = priority;

    const printJobs = await PrintJob.find(filter)
      .populate('project', 'name')
      .populate('operator', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: printJobs });
  } catch (error) {
    console.error('Get print jobs error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/print-jobs/:id
// @desc    Get single print job
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const printJob = await PrintJob.findById(req.params.id)
      .populate('project', 'name')
      .populate('operator', 'name');

    if (!printJob) return res.status(404).json({ message: 'Print job not found' });

    res.json({ success: true, data: printJob });
  } catch (error) {
    console.error('Get print job error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/print-jobs
// @desc    Create a new print job
// @access  Private
router.post('/', async (req, res) => {
  try {
    const newPrintJob = new PrintJob(req.body);
    const savedJob = await newPrintJob.save();
    res.status(201).json({ success: true, data: savedJob });
  } catch (error) {
    console.error('Create print job error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/print-jobs/:id
// @desc    Update a print job
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const updatedJob = await PrintJob.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedJob) return res.status(404).json({ message: 'Print job not found' });

    res.json({ success: true, data: updatedJob });
  } catch (error) {
    console.error('Update print job error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/print-jobs/:id/status
// @desc    Update print job status
// @access  Private
router.put('/:id/status', async (req, res) => {
  try {
    const { status, quantity } = req.body;

    if (!status) return res.status(400).json({ message: 'Status is required' });

    const updateData = { status };
    if (quantity !== undefined) updateData['quantity.printed'] = quantity;
    if (status === 'completed') updateData['timeline.actualCompletion'] = new Date();

    const updatedJob = await PrintJob.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedJob) return res.status(404).json({ message: 'Print job not found' });

    res.json({ success: true, data: updatedJob });
  } catch (error) {
    console.error('Update print job status error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/print-jobs/:id
// @desc    Delete a print job
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const deletedJob = await PrintJob.findByIdAndDelete(req.params.id);

    if (!deletedJob) return res.status(404).json({ message: 'Print job not found' });

    res.json({ success: true, message: 'Print job deleted successfully' });
  } catch (error) {
    console.error('Delete print job error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/print-jobs/queue/:machine
// @desc    Get print queue for specific machine
// @access  Private
router.get('/queue/:machine', async (req, res) => {
  try {
    const { machine } = req.params;

    const queue = await PrintJob.find({
      machine,
      status: { $in: ['pending', 'printing', 'paused'] }
    })
      .populate('project', 'name')
      .sort({
        priority: 1, // You can map priority to numeric if needed
        createdAt: 1
      });

    res.json({ success: true, data: queue });
  } catch (error) {
    console.error('Get print queue error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
