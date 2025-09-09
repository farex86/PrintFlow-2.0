const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    maxlength: 1000
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['draft', 'active', 'on-hold', 'completed', 'cancelled'],
    default: 'draft'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['brochure', 'business-card', 'banner', 'poster', 'book', 'packaging', 'other'],
    required: true
  },
  deadline: Date,
  startDate: {
    type: Date,
    default: Date.now
  },
  completedDate: Date,
  budget: {
    amount: {
      type: Number,
      min: 0
    },
    currency: {
      type: String,
      enum: ['SDG', 'AED', 'SAR', 'EGP', 'USD'],
      default: 'AED'
    }
  },
  actualCost: {
    amount: {
      type: Number,
      min: 0,
      default: 0
    },
    currency: {
      type: String,
      enum: ['SDG', 'AED', 'SAR', 'EGP', 'USD'],
      default: 'AED'
    }
  },
  specifications: {
    size: String,
    colorMode: {
      type: String,
      enum: ['CMYK', 'RGB', 'Pantone'],
      default: 'CMYK'
    },
    paperType: String,
    finishing: [String],
    quantity: {
      type: Number,
      min: 1,
      default: 1
    }
  },
  files: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File'
  }],
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  printJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PrintJob'
  }],
  invoices: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice'
  }],
  notes: [{
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
    isPrivate: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
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
ProjectSchema.index({ client: 1, status: 1 });
ProjectSchema.index({ deadline: 1 });
ProjectSchema.index({ createdAt: -1 });
ProjectSchema.index({ status: 1, priority: 1 });

// Virtual for days remaining
ProjectSchema.virtual('daysRemaining').get(function() {
  if (!this.deadline) return null;
  const today = new Date();
  const diffTime = this.deadline - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for is overdue
ProjectSchema.virtual('isOverdue').get(function() {
  if (!this.deadline || this.status === 'completed') return false;
  return new Date() > this.deadline;
});

// Update progress when tasks are updated
ProjectSchema.methods.updateProgress = async function() {
  await this.populate('tasks');
  if (this.tasks.length === 0) {
    this.progress = 0;
    return;
  }

  const completedTasks = this.tasks.filter(task => task.status === 'completed').length;
  this.progress = Math.round((completedTasks / this.tasks.length) * 100);
  await this.save();
};

module.exports = mongoose.model('Project', ProjectSchema);
