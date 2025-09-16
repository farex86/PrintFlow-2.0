const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    maxlength: 1000
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'review', 'completed', 'cancelled'],
    default: 'todo'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['design', 'review', 'printing', 'quality-check', 'delivery', 'other'],
    default: 'design'
  },
  dueDate: Date,
  startDate: Date,
  completedDate: Date,
  estimatedHours: {
    type: Number,
    min: 0
  },
  actualHours: {
    type: Number,
    min: 0,
    default: 0
  },
  subtasks: [{
    title: {
      type: String,
      required: true,
      maxlength: 200
    },
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: Date,
    completedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  attachments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File'
  }],
  comments: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: 1000
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  dependencies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  tags: [String],
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
TaskSchema.index({ project: 1, status: 1 });
TaskSchema.index({ assignedTo: 1, status: 1 });
TaskSchema.index({ dueDate: 1 });
TaskSchema.index({ createdAt: -1 });

// Virtual for is overdue
TaskSchema.virtual('isOverdue').get(function() {
  if (!this.dueDate || this.status === 'completed') return false;
  return new Date() > this.dueDate;
});

// Virtual for completion percentage based on subtasks
TaskSchema.virtual('subtaskProgress').get(function() {
  if (this.subtasks.length === 0) return 0;
  const completedSubtasks = this.subtasks.filter(st => st.completed).length;
  return Math.round((completedSubtasks / this.subtasks.length) * 100);
});

// Update progress when subtasks change
TaskSchema.methods.updateProgress = function() {
  if (this.subtasks.length === 0) {
    this.progress = this.status === 'completed' ? 100 : 0;
  } else {
    const completedSubtasks = this.subtasks.filter(st => st.completed).length;
    this.progress = Math.round((completedSubtasks / this.subtasks.length) * 100);
  }

  if (this.progress === 100 && this.status !== 'completed') {
    this.status = 'completed';
    this.completedDate = new Date();
  }
};

// Pre-save middleware to update progress
TaskSchema.pre('save', function(next) {
  this.updateProgress();
  next();
});

module.exports = mongoose.model('Task', TaskSchema);
