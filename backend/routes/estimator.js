const express = require('express');
const { neon } = require('@neondatabase/serverless');
const router = express.Router();

const sql = neon(process.env.DATABASE_URL);

// Pricing constants (can be moved to database later)
const PRICING_CONFIG = {
  business_cards: {
    base_price: 0.15, // per card
    setup_fee: 25,
    quantity_breaks: {
      500: 0.15,
      1000: 0.12,
      2000: 0.10,
      5000: 0.08
    }
  },
  brochures: {
    base_price: 2.50, // per brochure
    setup_fee: 50,
    quantity_breaks: {
      100: 2.50,
      250: 2.00,
      500: 1.75,
      1000: 1.50
    }
  },
  flyers: {
    base_price: 0.35,
    setup_fee: 20,
    quantity_breaks: {
      250: 0.35,
      500: 0.30,
      1000: 0.25,
      2500: 0.20
    }
  },
  banners: {
    base_price: 15.00, // per sq meter
    setup_fee: 75,
    quantity_breaks: {
      1: 15.00,
      5: 12.00,
      10: 10.00,
      25: 8.50
    }
  }
};

// @route   POST /api/estimator/calculate
// @desc    Calculate estimate for print job
// @access  Private
router.post('/calculate', async (req, res) => {
  try {
    const {
      product_type,
      quantity,
      paper_type = 'standard',
      finish = 'none',
      colors = 4,
      sides = 1,
      rush_job = false,
      dimensions = {}
    } = req.body;

    if (!product_type || !quantity) {
      return res.status(400).json({ 
        message: 'Product type and quantity are required' 
      });
    }

    const config = PRICING_CONFIG[product_type];
    if (!config) {
      return res.status(400).json({ 
        message: 'Invalid product type' 
      });
    }

    // Calculate base cost
    let unitPrice = config.base_price;

    // Apply quantity breaks
    const quantityBreaks = Object.keys(config.quantity_breaks)
      .map(Number)
      .sort((a, b) => b - a);

    for (const breakPoint of quantityBreaks) {
      if (quantity >= breakPoint) {
        unitPrice = config.quantity_breaks[breakPoint];
        break;
      }
    }

    let subtotal = unitPrice * quantity;

    // Add setup fee
    subtotal += config.setup_fee;

    // Apply modifiers
    const modifiers = [];

    // Paper type modifier
    if (paper_type === 'premium') {
      const paperMultiplier = 1.25;
      subtotal *= paperMultiplier;
      modifiers.push({ type: 'Premium Paper', multiplier: paperMultiplier, amount: subtotal * 0.25 });
    } else if (paper_type === 'specialty') {
      const paperMultiplier = 1.50;
      subtotal *= paperMultiplier;
      modifiers.push({ type: 'Specialty Paper', multiplier: paperMultiplier, amount: subtotal * 0.50 });
    }

    // Finish modifier
    if (finish === 'glossy' || finish === 'matte') {
      const finishCost = quantity * 0.10;
      subtotal += finishCost;
      modifiers.push({ type: 'Lamination/Finish', multiplier: 1, amount: finishCost });
    } else if (finish === 'uv') {
      const finishCost = quantity * 0.25;
      subtotal += finishCost;
      modifiers.push({ type: 'UV Coating', multiplier: 1, amount: finishCost });
    }

    // Double-sided printing
    if (sides === 2) {
      const doublesidedCost = subtotal * 0.30;
      subtotal += doublesidedCost;
      modifiers.push({ type: 'Double-sided Printing', multiplier: 1.3, amount: doublesidedCost });
    }

    // Rush job fee
    if (rush_job) {
      const rushCost = subtotal * 0.50;
      subtotal += rushCost;
      modifiers.push({ type: 'Rush Job Fee', multiplier: 1.5, amount: rushCost });
    }

    // Dimensions (for banners, posters)
    if (product_type === 'banners' && dimensions.width && dimensions.height) {
      const area = (dimensions.width * dimensions.height) / 10000; // convert cm² to m²
      subtotal = config.base_price * area * quantity + config.setup_fee;

      // Apply modifiers on the new subtotal
      modifiers.forEach(modifier => {
        if (modifier.multiplier > 1) {
          subtotal *= modifier.multiplier;
        } else {
          subtotal += modifier.amount;
        }
      });
    }

    // Calculate tax (5% VAT for UAE)
    const taxRate = 0.05;
    const taxAmount = subtotal * taxRate;
    const total = subtotal + taxAmount;

    const estimate = {
      product_type,
      quantity,
      unit_price: unitPrice,
      base_amount: unitPrice * quantity,
      setup_fee: config.setup_fee,
      modifiers,
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax_rate: taxRate,
      tax_amount: parseFloat(taxAmount.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      currency: 'AED',
      valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      created_at: new Date().toISOString()
    };

    res.json({
      success: true,
      data: estimate
    });
  } catch (error) {
    console.error('Calculate estimate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/estimator/save
// @desc    Save estimate to database
// @access  Private
router.post('/save', async (req, res) => {
  try {
    const {
      client_id,
      project_id,
      estimate_data,
      notes,
      status = 'draft'
    } = req.body;

    if (!client_id || !estimate_data) {
      return res.status(400).json({ 
        message: 'Client ID and estimate data are required' 
      });
    }

    const newEstimate = await sql`
      INSERT INTO estimates (
        client_id, project_id, estimate_data, notes, status, 
        total_amount, currency, valid_until
      )
      VALUES (
        ${client_id}, ${project_id}, ${JSON.stringify(estimate_data)}, ${notes}, ${status},
        ${estimate_data.total}, ${estimate_data.currency}, ${estimate_data.valid_until}
      )
      RETURNING *
    `;

    res.status(201).json({
      success: true,
      data: newEstimate[0]
    });
  } catch (error) {
    console.error('Save estimate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/estimator/estimates
// @desc    Get all saved estimates
// @access  Private
router.get('/estimates', async (req, res) => {
  try {
    const { client_id, project_id, status } = req.query;

    let query = `
      SELECT e.*, u.name as client_name, p.name as project_name
      FROM estimates e
      LEFT JOIN users u ON e.client_id = u.id
      LEFT JOIN projects p ON e.project_id = p.id
    `;

    const conditions = [];
    const params = [];

    if (client_id) {
      conditions.push(`e.client_id = $${params.length + 1}`);
      params.push(client_id);
    }

    if (project_id) {
      conditions.push(`e.project_id = $${params.length + 1}`);
      params.push(project_id);
    }

    if (status) {
      conditions.push(`e.status = $${params.length + 1}`);
      params.push(status);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ` ORDER BY e.created_at DESC`;

    const estimates = await sql.unsafe(query, params);

    res.json({
      success: true,
      data: estimates
    });
  } catch (error) {
    console.error('Get estimates error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/estimator/estimates/:id
// @desc    Get single estimate
// @access  Private
router.get('/estimates/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const estimates = await sql`
      SELECT e.*, u.name as client_name, u.email as client_email, 
             p.name as project_name
      FROM estimates e
      LEFT JOIN users u ON e.client_id = u.id
      LEFT JOIN projects p ON e.project_id = p.id
      WHERE e.id = ${id}
      LIMIT 1
    `;

    if (estimates.length === 0) {
      return res.status(404).json({ message: 'Estimate not found' });
    }

    res.json({
      success: true,
      data: estimates[0]
    });
  } catch (error) {
    console.error('Get estimate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/estimator/estimates/:id/status
// @desc    Update estimate status
// @access  Private
router.put('/estimates/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const updatedEstimate = await sql`
      UPDATE estimates SET
        status = ${status},
        approved_at = CASE WHEN ${status} = 'approved' THEN CURRENT_TIMESTAMP ELSE approved_at END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;

    if (updatedEstimate.length === 0) {
      return res.status(404).json({ message: 'Estimate not found' });
    }

    res.json({
      success: true,
      data: updatedEstimate[0]
    });
  } catch (error) {
    console.error('Update estimate status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/estimator/pricing-config
// @desc    Get current pricing configuration
// @access  Private
router.get('/pricing-config', async (req, res) => {
  try {
    res.json({
      success: true,
      data: PRICING_CONFIG
    });
  } catch (error) {
    console.error('Get pricing config error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/estimator/bulk-calculate
// @desc    Calculate estimates for multiple items
// @access  Private
router.post('/bulk-calculate', async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ message: 'Items array is required' });
    }

    const estimates = [];

    for (const item of items) {
      // Use the same calculation logic as single estimate
      try {
        const estimate = await calculateSingleEstimate(item);
        estimates.push(estimate);
      } catch (itemError) {
        console.error(`Error calculating estimate for item:`, itemError);
        estimates.push({ error: itemError.message, item });
      }
    }

    const totalAmount = estimates
      .filter(est => !est.error)
      .reduce((sum, est) => sum + est.total, 0);

    res.json({
      success: true,
      data: {
        estimates,
        total_amount: parseFloat(totalAmount.toFixed(2)),
        currency: 'AED'
      }
    });
  } catch (error) {
    console.error('Bulk calculate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function for single estimate calculation
const calculateSingleEstimate = (item) => {
  // This would contain the same logic as the /calculate endpoint
  // Extracted here for reuse in bulk calculations
  // Implementation details same as above...
  return item; // Placeholder
};

module.exports = router;
