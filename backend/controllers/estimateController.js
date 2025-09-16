const Estimate = require('../models/Estimate');

// Calculate estimate (example logic)
const calculateEstimate = async (req, res) => {
  try {
    const { product_type, quantity } = req.body;
    const unitPrice = 10; // example price
    const total = unitPrice * quantity;

    res.json({ success: true, data: { product_type, quantity, total } });
  } catch (error) {
    console.error('Calculate estimate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Save estimate
const saveEstimate = async (req, res) => {
  try {
    const estimate = new Estimate(req.body);
    await estimate.save();
    res.status(201).json({ success: true, data: estimate });
  } catch (error) {
    console.error('Save estimate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all estimates
const getEstimates = async (req, res) => {
  try {
    const estimates = await Estimate.find().sort({ created_at: -1 });
    res.json({ success: true, data: estimates });
  } catch (error) {
    console.error('Get estimates error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  calculateEstimate,
  saveEstimate,
  getEstimates
};
