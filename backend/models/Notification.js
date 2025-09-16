const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: [
      'project_created',
      'project_updated', 
      'task_assigned',
      'task_completed',
      'task_overdue',
      'file_uploaded',
      'file_approved',
      'file_rejected',
      'invoice_sent',
      'invoice_paid',
      'invoice_overdue',
      'print_job_completed',
      'print_job_failed',
      'system_alert'
    ],
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  message: {
    type: String,
    required: true,
    maxlength: 1000
  },
  data: {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project'
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task'
    },
    fileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'File'
    },
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invoice'
    },
    printJobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PrintJob'
    }
  },
  channels: {
    inApp: {
      type: Boolean,
      default: true
    },
    email: {
      type: Boolean,
      default: false
    },
    sms: {
      type: Boolean,
      default: false
    },
    whatsapp: {
      type: Boolean,
      default: false
    }
  },
  status: {
    type: String,
    enum: ['unread', 'read', 'archived'],
    default: 'unread'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  readAt: Date,
  expiresAt: Date
}, {
  timestamps: true
});

// Indexes
NotificationSchema.index({ recipient: 1, status: 1 });
NotificationSchema.index({ createdAt: -1 });
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Notification', NotificationSchema);
