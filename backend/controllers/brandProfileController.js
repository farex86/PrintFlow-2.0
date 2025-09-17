const BrandProfile = require('../models/BrandProfile');
const User = require('../models/User');

// @desc    Get the brand profile for the current user
// @route   GET /api/brand-profile
// @access  Private
exports.getBrandProfile = async (req, res) => {
  try {
    const profile = await BrandProfile.findOne({ client: req.user.id });
    if (!profile) {
      // If no profile, create one
      const newProfile = await BrandProfile.create({ client: req.user.id });
      return res.status(200).json({ success: true, data: newProfile });
    }
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Upload a logo for the brand profile
// @route   PUT /api/brand-profile/logo
// @access  Private
exports.uploadBrandProfileLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const profile = await BrandProfile.findOneAndUpdate(
      { client: req.user.id },
      { $set: { logoUrl: req.file.path } }, // req.file.path contains the Cloudinary URL
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Create or update a brand profile
// @route   PUT /api/brand-profile
// @access  Private
exports.updateBrandProfile = async (req, res) => {
  try {
    const { logoUrl, colors, fonts, brandGuidelinesUrl } = req.body;

    let profile = await BrandProfile.findOne({ client: req.user.id });

    if (!profile) {
      profile = await BrandProfile.create({ client: req.user.id, ...req.body });
    } else {
      profile = await BrandProfile.findOneAndUpdate(
        { client: req.user.id },
        { $set: req.body },
        { new: true, runValidators: true }
      );
    }

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
