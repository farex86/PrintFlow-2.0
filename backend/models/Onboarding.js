const mongoose = require('mongoose');

const OnboardingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  currentStep: {
    type: String,
    enum: ['account-created', 'company-details', 'brand-profile', 'documents-uploaded', 'completed'],
    default: 'account-created',
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

OnboardingSchema.index({ user: 1 });

module.exports = mongoose.model('Onboarding', OnboardingSchema);
