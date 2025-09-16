const mongoose = require('mongoose');

const InvoiceItemSchema = new mongoose.Schema({
  invoice_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice',
    required: true
  },
  description: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unit_price: { type: Number, required: true, min: 0 },
  total_price: { type: Number, required: true, min: 0 }
}, { timestamps: true });

module.exports = mongoose.model('InvoiceItem', InvoiceItemSchema);
