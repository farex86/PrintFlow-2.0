const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  invoice_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', required: true },
  stripe_payment_intent_id: { type: String },
  stripe_charge_id: { type: String },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'AED' },
  status: { type: String, enum: ['pending', 'processing', 'completed', 'failed', 'refunded'], default: 'pending' },
  payment_method: { type: String, default: 'stripe' },
  completed_at: { type: Date },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);
