const mongoose = require('mongoose');

const PrintSpecSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 200
  },
  category: {
    type: String,
    enum: ['business-card', 'brochure', 'poster', 'banner', 'book', 'packaging', 'sticker', 'other'],
    required: true
  },
  size: {
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      enum: ['mm', 'cm', 'inch'],
      default: 'mm'
    }
  },
  paperType: {
    type: String,
    enum: ['art-paper', 'offset-paper', 'cardboard', 'vinyl', 'fabric', 'canvas', 'other'],
    required: true
  },
  paperWeight: {
    type: Number, // in GSM
    min: 80,
    max: 400
  },
  colorMode: {
    type: String,
    enum: ['CMYK', 'RGB', 'Grayscale', 'Pantone'],
    default: 'CMYK'
  },
  printSides: {
    type: String,
    enum: ['single', 'double'],
    default: 'single'
  },
  finishing: [{
    type: String,
    enum: ['lamination', 'varnish', 'embossing', 'foiling', 'die-cutting', 'binding', 'folding']
  }],
  bleedSize: {
    type: Number,
    default: 3 // in mm
  },
  resolution: {
    type: Number,
    default: 300 // DPI
  },
  pricing: {
    baseCost: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      enum: ['SDG', 'AED', 'SAR', 'EGP', 'USD'],
      default: 'AED'
    },
    quantityBreaks: [{
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      unitPrice: {
        type: Number,
        required: true,
        min: 0
      }
    }]
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
PrintSpecSchema.index({ category: 1, isActive: 1 });
PrintSpecSchema.index({ name: 1 });

module.exports = mongoose.model('PrintSpec', PrintSpecSchema);
