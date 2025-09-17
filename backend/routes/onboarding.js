const express = require('express');
const router = express.Router();
const {
  startOnboarding,
  updateOnboardingStep,
  getOnboardingStatus,
} = require('../controllers/onboardingController');
const { protect } = require('../middleware/auth');

// All routes in this file are protected
router.use(protect);

router.route('/')
  .get(getOnboardingStatus)
  .put(updateOnboardingStep);

router.route('/start').post(startOnboarding);

module.exports = router;
