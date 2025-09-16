const mongoose = require('mongoose');

const refundSchema = new mongoose.Schema({
  payment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', required: true },
  stripe_refund_id: { type: String, unique: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'AED' },
  reason: { type: String },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Refund', refundSchema);
