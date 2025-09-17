const mongoose = require('mongoose');

const ColorSchema = new mongoose.Schema({
  name: String,
  hex: String,
  rgb: String,
  cmyk: String,
  pantone: String,
}, { _id: false });

const FontSchema = new mongoose.Schema({
  name: String,
  style: String, // e.g., 'Primary Header', 'Body Text'
  url: String, // Optional URL to the font file
}, { _id: false });

const BrandProfileSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  logoUrl: {
    type: String,
    trim: true,
  },
  colors: [ColorSchema],
  fonts: [FontSchema],
  brandGuidelinesUrl: { // Link to a PDF or other document
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

BrandProfileSchema.index({ client: 1 });

module.exports = mongoose.model('BrandProfile', BrandProfileSchema);
