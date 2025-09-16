const express = require('express');
const router = express.Router();

const Estimate = require('../models/Estimate');
const User = require('../models/User');
const Project = require('../models/Project');

// Pricing constants
const PRICING_CONFIG = {
  business_cards: {
    base_price: 0.15,
    setup_fee: 25,
    quantity_breaks: { 500: 0.15, 1000: 0.12, 2000: 0.10, 5000: 0.08 }
  },
  brochures: {
    base_price: 2.5,
    setup_fee: 50,
    quantity_breaks: { 100: 2.5, 250: 2.0, 500: 1.75, 1000: 1.5 }
  },
  flyers: {
    base_price: 0.35,
    setup_fee: 20,
    quantity_breaks: { 250: 0.35, 500: 0.3, 1000: 0.25, 2500: 0.2 }
  },
  banners: {
    base_price: 15,
    setup_fee: 75,
    quantity_breaks: { 1: 15, 5: 12, 10: 10, 25: 8.5 }
  }
};

// Helper function to calculate single estimate
const calculateSingleEstimate = (item) => {
  const {
    product_type,
    quantity,
    paper_type = 'standard',
    finish = 'none',
    sides = 1,
    rush_job = false,
    dimensions = {}
  } = item;

  if (!product_type || !quantity) throw new Error('Product type and quantity are required');
  const config = PRICING_CONFIG[product_type];
  if (!config) throw new Error('Invalid product type');

  let unitPrice = config.base_price;
  const quantityBreaks = Object.keys(config.quantity_breaks).map(Number).sort((a, b) => b - a);
  for (const breakPoint of quantityBreaks) {
    if (quantity >= breakPoint) {
      unitPrice = config.quantity_breaks[breakPoint];
      break;
    }
  }

  let subtotal = unitPrice * quantity + config.setup_fee;
  const modifiers = [];

  if (paper_type === 'premium') {
    const mult = 1.25;
    subtotal *= mult;
    modifiers.push({ type: 'Premium Paper', multiplier: mult, amount: subtotal * 0.25 });
  } else if (paper_type === 'specialty') {
    const mult = 1.5;
    subtotal *= mult;
    modifiers.push({ type: 'Specialty Paper', multiplier: mult, amount: subtotal * 0.5 });
  }

  if (finish === 'glossy' || finish === 'matte') {
    const finishCost = quantity * 0.1;
    subtotal += finishCost;
    modifiers.push({ type: 'Lamination/Finish', multiplier: 1, amount: finishCost });
  } else if (finish === 'uv') {
    const finishCost = quantity * 0.25;
    subtotal += finishCost;
    modifiers.push({ type: 'UV Coating', multiplier: 1, amount: finishCost });
  }

  if (sides === 2) {
    const doublesidedCost = subtotal * 0.3;
    subtotal += doublesidedCost;
    modifiers.push({ type: 'Double-sided Printing', multiplier: 1.3, amount: doublesidedCost });
  }

  if (rush_job) {
    const rushCost = subtotal * 0.5;
    subtotal += rushCost;
    modifiers.push({ type: 'Rush Job Fee', multiplier: 1.5, amount: rushCost });
  }

  if (product_type === 'banners' && dimensions.width && dimensions.height) {
    const area = (dimensions.width * dimensions.height) / 10000;
    subtotal = config.base_price * area * quantity + config.setup_fee;
    modifiers.forEach(mod => (mod.multiplier > 1 ? (subtotal *= mod.multiplier) : (subtotal += mod.amount)));
  }

  const taxRate = 0.05;
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;

  return {
    ...item,
    unit_price: unitPrice,
    base_amount: unitPrice * quantity,
    setup_fee: config.setup_fee,
    modifiers,
    subtotal: parseFloat(subtotal.toFixed(2)),
    tax_rate: taxRate,
    tax_amount: parseFloat(taxAmount.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
    currency: 'AED',
    valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    created_at: new Date()
  };
};

// POST /calculate
router.post('/calculate', (req, res) => {
  try {
    const estimate = calculateSingleEstimate(req.body);
    res.json({ success: true, data: estimate });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST /save
router.post('/save', async (req, res) => {
  try {
    const { client_id, project_id, estimate_data, notes, status = 'draft' } = req.body;
    if (!client_id || !estimate_data) return res.status(400).json({ message: 'Client ID and estimate data are required' });

    const newEstimate = await Estimate.create({
      client_id,
      project_id,
      estimate_data,
      notes,
      status,
      total_amount: estimate_data.total,
      currency: estimate_data.currency,
      valid_until: estimate_data.valid_until
    });

    res.status(201).json({ success: true, data: newEstimate });
  } catch (err) {
    console.error('Save estimate error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /estimates
router.get('/estimates', async (req, res) => {
  try {
    const { client_id, project_id, status } = req.query;
    const filter = {};
    if (client_id) filter.client_id = client_id;
    if (project_id) filter.project_id = project_id;
    if (status) filter.status = status;

    const estimates = await Estimate.find(filter)
      .populate('client_id', 'name')
      .populate('project_id', 'name')
      .sort({ created_at: -1 });

    res.json({ success: true, data: estimates });
  } catch (err) {
    console.error('Get estimates error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /estimates/:id
router.get('/estimates/:id', async (req, res) => {
  try {
    const estimate = await Estimate.findById(req.params.id)
      .populate('client_id', 'name email')
      .populate('project_id', 'name');
    if (!estimate) return res.status(404).json({ message: 'Estimate not found' });
    res.json({ success: true, data: estimate });
  } catch (err) {
    console.error('Get estimate error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /estimates/:id/status
router.put('/estimates/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'Status is required' });

    const estimate = await Estimate.findByIdAndUpdate(
      req.params.id,
      { status, approved_at: status === 'approved' ? new Date() : undefined, updated_at: new Date() },
      { new: true }
    );

    if (!estimate) return res.status(404).json({ message: 'Estimate not found' });
    res.json({ success: true, data: estimate });
  } catch (err) {
    console.error('Update estimate status error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /pricing-config
router.get('/pricing-config', (req, res) => {
  res.json({ success: true, data: PRICING_CONFIG });
});

// POST /bulk-calculate
router.post('/bulk-calculate', (req, res) => {
  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items)) return res.status(400).json({ message: 'Items array is required' });

    const estimates = items.map(item => {
      try { return calculateSingleEstimate(item); } 
      catch (err) { return { error: err.message, item }; }
    });

    const totalAmount = estimates.filter(e => !e.error).reduce((sum, e) => sum + e.total, 0);

    res.json({ success: true, data: { estimates, total_amount: parseFloat(totalAmount.toFixed(2)), currency: 'AED' } });
  } catch (err) {
    console.error('Bulk calculate error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
