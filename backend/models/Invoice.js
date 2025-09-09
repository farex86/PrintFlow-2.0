const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    unique: true,
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'viewed', 'paid', 'overdue', 'cancelled'],
    default: 'draft'
  },
  type: {
    type: String,
    enum: ['proforma', 'final', 'deposit', 'partial'],
    default: 'final'
  },
  items: [{
    description: {
      type: String,
      required: true,
      maxlength: 500
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    tax: {
      type: Number,
      default: 0,
      min: 0
    },
    total: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  discountAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  taxAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    enum: ['SDG', 'AED', 'SAR', 'EGP', 'USD'],
    default: 'AED'
  },
  dates: {
    issued: {
      type: Date,
      default: Date.now
    },
    due: {
      type: Date,
      required: true
    },
    sent: Date,
    viewed: Date,
    paid: Date
  },
  paymentTerms: {
    type: String,
    default: 'Net 30'
  },
  paymentMethod: {
    type: String,
    enum: ['bank-transfer', 'cash', 'card', 'cheque', 'online'],
    default: 'bank-transfer'
  },
  notes: String,
  attachments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File'
  }],
  payments: [{
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    date: {
      type: Date,
      required: true
    },
    method: {
      type: String,
      enum: ['bank-transfer', 'cash', 'card', 'cheque', 'online'],
      required: true
    },
    reference: String,
    notes: String,
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  }],
  stripePaymentIntentId: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Auto-generate invoice number
InvoiceSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments();
    const year = new Date().getFullYear();
    this.invoiceNumber = `INV${year}${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Virtual for paid amount
InvoiceSchema.virtual('paidAmount').get(function() {
  return this.payments.reduce((sum, payment) => sum + payment.amount, 0);
});

// Virtual for remaining balance
InvoiceSchema.virtual('balance').get(function() {
  return this.total - this.paidAmount;
});

// Virtual for is overdue
InvoiceSchema.virtual('isOverdue').get(function() {
  return this.status !== 'paid' && new Date() > this.dates.due;
});

// Indexes
InvoiceSchema.index({ client: 1, status: 1 });
InvoiceSchema.index({ project: 1 });
InvoiceSchema.index({ 'dates.due': 1 });
InvoiceSchema.index({ status: 1, 'dates.issued': -1 });

module.exports = mongoose.model('Invoice', InvoiceSchema);
