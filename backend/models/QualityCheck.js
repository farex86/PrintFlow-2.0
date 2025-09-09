const mongoose.Schema = require('mongoose');

const QualityCheckSchema = new mongoose.Schema({
  printJob: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PrintJob',
    required: true
  },
  inspector: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  checkType: {
    type: String,
    enum: ['pre-production', 'mid-production', 'final', 'random'],
    required: true
  },
  sampleSize: {
    type: Number,
    required: true,
    min: 1
  },
  criteria: [{
    parameter: {
      type: String,
      required: true,
      enum: ['color-accuracy', 'alignment', 'cutting', 'finishing', 'text-clarity', 'image-quality', 'overall']
    },
    status: {
      type: String,
      enum: ['pass', 'fail', 'warning'],
      required: true
    },
    notes: String,
    images: [String] // Cloudinary URLs
  }],
  overallStatus: {
    type: String,
    enum: ['approved', 'rejected', 'conditional'],
    required: true
  },
  defectCount: {
    type: Number,
    default: 0,
    min: 0
  },
  passRate: {
    type: Number,
    min: 0,
    max: 100
  },
  notes: String,
  recommendations: String,
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpDate: Date
}, {
  timestamps: true
});

// Indexes
QualityCheckSchema.index({ printJob: 1 });
QualityCheckSchema.index({ inspector: 1, createdAt: -1 });
QualityCheckSchema.index({ overallStatus: 1 });

module.exports = mongoose.model('QualityCheck', QualityCheckSchema);
