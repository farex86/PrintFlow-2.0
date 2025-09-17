const Onboarding = require('../models/Onboarding');
const User = require('../models/User');

// @desc    Start the onboarding process for a new user
// @route   POST /api/onboarding/start
// @access  Private (for the user who just registered)
exports.startOnboarding = async (req, res) => {
  // This will be called right after registration
  try {
    const onboarding = await Onboarding.create({ user: req.user.id });
    res.status(201).json({ success: true, data: onboarding });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update the onboarding step
// @route   PUT /api/onboarding
// @access  Private
exports.updateOnboardingStep = async (req, res) => {
  try {
    const { step, companyDetails } = req.body;

    let onboarding = await Onboarding.findOne({ user: req.user.id });
    if (!onboarding) {
      return res.status(404).json({ success: false, message: 'Onboarding process not found' });
    }

    onboarding.currentStep = step;

    // If company details are provided, update the user model
    if (companyDetails) {
      await User.findByIdAndUpdate(req.user.id, {
        companyName: companyDetails.companyName,
        phoneNumber: companyDetails.phoneNumber,
        address: companyDetails.address,
      });
    }

    if (step === 'completed') {
        onboarding.completed = true;
        onboarding.completedAt = Date.now();
    }

    await onboarding.save();

    res.status(200).json({ success: true, data: onboarding });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get the current onboarding status
// @route   GET /api/onboarding
// @access  Private
exports.getOnboardingStatus = async (req, res) => {
    try {
        const onboarding = await Onboarding.findOne({ user: req.user.id });
        if (!onboarding) {
            return res.status(404).json({ success: false, message: 'Onboarding process not found' });
        }
        res.status(200).json({ success: true, data: onboarding });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
