const express = require('express');
const router = express.Router();
const {
  getBrandProfile,
  updateBrandProfile,
  uploadBrandProfileLogo,
} = require('../controllers/brandProfileController');
const { protect } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');

// All routes in this file are protected
router.use(protect);

router.route('/')
  .get(getBrandProfile)
  .put(updateBrandProfile);

router.route('/logo')
  .put(uploadSingle, uploadBrandProfileLogo);

module.exports = router;
