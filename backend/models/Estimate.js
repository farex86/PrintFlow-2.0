const mongoose = require('mongoose');

const estimateSchema = new mongoose.Schema({
  client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  estimate_data: { type: Object, required: true },
  status: { type: String, enum: ['draft', 'sent', 'approved', 'rejected', 'expired'], default: 'draft' },
  total_amount: { type: Number, required: true },
  currency: { type: String, default: 'AED' },
  valid_until: { type: Date },
  approved_at: { type: Date },
  notes: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Estimate', estimateSchema);
