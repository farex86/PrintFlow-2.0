const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  originalName: {
    type: String,
    required: true,
    maxlength: 255
  },
  filename: {
    type: String,
    required: true
  },
  cloudinaryUrl: {
    type: String,
    required: true
  },
  cloudinaryPublicId: {
    type: String,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['design', 'proof', 'final', 'reference', 'invoice', 'contract', 'other'],
    default: 'other'
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  version: {
    type: Number,
    default: 1
  },
  parentFile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File'
  },
  isLatestVersion: {
    type: Boolean,
    default: true
  },
  approvalStatus: {
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'needs-revision'],
      default: 'pending'
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvedAt: Date,
    comments: String
  },
  metadata: {
    dimensions: {
      width: Number,
      height: Number
    },
    resolution: Number,
    colorMode: String,
    pages: Number
  },
  tags: [String],
  accessLevel: {
    type: String,
    enum: ['public', 'client', 'internal', 'private'],
    default: 'client'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
FileSchema.index({ project: 1, category: 1 });
FileSchema.index({ uploadedBy: 1 });
FileSchema.index({ createdAt: -1 });
FileSchema.index({ 'approvalStatus.status': 1 });

// Virtual for file extension
FileSchema.virtual('extension').get(function() {
  return this.originalName.split('.').pop().toLowerCase();
});

// Virtual for is image
FileSchema.virtual('isImage').get(function() {
  const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
  return imageTypes.includes(this.extension);
});

// Virtual for formatted size
FileSchema.virtual('formattedSize').get(function() {
  const bytes = this.size;
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
});

module.exports = mongoose.model('File', FileSchema);
