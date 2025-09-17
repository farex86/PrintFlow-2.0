// Main routes index file - imports and exports all route modules

const express = require('express');
const router = express.Router();

// Import all route modules
const authRoutes = require('./auth');
const projectRoutes = require('./projects');
const taskRoutes = require('./tasks');
const printJobRoutes = require('./printJobs');
const invoiceRoutes = require('./invoices');
const fileRoutes = require('./files');
const notificationRoutes = require('./notifications');
const dashboardRoutes = require('./dashboard');
const estimatorRoutes = require('./estimator');
const paymentRoutes = require('./payments');
const onboardingRoutes = require('./onboarding');
const brandProfileRoutes = require('./brandProfile');

// Define routes
router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/tasks', taskRoutes);
router.use('/print-jobs', printJobRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/files', fileRoutes);
router.use('/notifications', notificationRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/estimator', estimatorRoutes);
router.use('/payments', paymentRoutes);
router.use('/onboarding', onboardingRoutes);
router.use('/brand-profile', brandProfileRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'PrintFlow API is running',
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

module.exports = router;
