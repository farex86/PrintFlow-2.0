const mongoose = require('mongoose');

const PrintJobSchema = new mongoose.Schema({
  jobNumber: {
    type: String,
    unique: true,
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Print job title is required'],
    trim: true,
    maxlength: 200
  },
  description: String,
  specifications: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PrintSpec',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in-queue', 'printing', 'quality-check', 'completed', 'failed'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  machine: {
    type: String,
    enum: ['offset-press', 'digital-press', 'large-format', 'cutting-machine', 'binding-machine'],
    required: true
  },
  operator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  files: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
    required: true
  }],
  quantity: {
    ordered: {
      type: Number,
      required: true,
      min: 1
    },
    printed: {
      type: Number,
      default: 0,
      min: 0
    },
    approved: {
      type: Number,
      default: 0,
      min: 0
    },
    rejected: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  cost: {
    materials: {
      type: Number,
      default: 0,
      min: 0
    },
    labor: {
      type: Number,
      default: 0,
      min: 0
    },
    overhead: {
      type: Number,
      default: 0,
      min: 0
    },
    total: {
      type: Number,
      default: 0,
      min: 0
    },
    currency: {
      type: String,
      enum: ['SDG', 'AED', 'SAR', 'EGP', 'USD'],
      default: 'AED'
    }
  },
  timeline: {
    scheduledStart: Date,
    actualStart: Date,
    estimatedCompletion: Date,
    actualCompletion: Date
  },
  qualityChecks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QualityCheck'
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
    type: {
      type: String,
      enum: ['general', 'quality', 'issue', 'warning'],
      default: 'general'
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

// Auto-generate job number
PrintJobSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments();
    const year = new Date().getFullYear();
    this.jobNumber = `PJ${year}${String(count + 1).padStart(4, '0')}`;
  }

  // Calculate total cost
  this.cost.total = this.cost.materials + this.cost.labor + this.cost.overhead;

  next();
});

// Indexes
PrintJobSchema.index({ project: 1 });
PrintJobSchema.index({ status: 1, priority: 1 });
PrintJobSchema.index({ operator: 1 });
PrintJobSchema.index({ 'timeline.scheduledStart': 1 });

module.exports = mongoose.model('PrintJob', PrintJobSchema);
