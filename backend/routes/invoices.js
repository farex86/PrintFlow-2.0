const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice'); // create Invoice model
const InvoiceItem = require('../models/InvoiceItem'); // optional, for line items
const Project = require('../models/Project');
const User = require('../models/User');

// Generate invoice number
const generateInvoiceNumber = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `INV-${year}-${random}`;
};

// @route   GET /api/invoices
router.get('/', async (req, res) => {
  try {
    const { status, client_id, project_id } = req.query;

    const query = {};
    if (status) query.status = status;
    if (client_id) query.client_id = client_id;
    if (project_id) query.project_id = project_id;

    const invoices = await Invoice.find(query)
      .populate('project_id', 'name')
      .populate('client_id', 'name company_name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: invoices });
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/invoices/:id
router.get('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('project_id', 'name')
      .populate('client_id', 'name company_name email');

    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });

    // Populate line items if stored in separate collection
    const lineItems = await InvoiceItem.find({ invoice_id: invoice._id }).sort({ createdAt: 1 });

    res.json({ success: true, data: { ...invoice.toObject(), lineItems } });
  } catch (error) {
    console.error('Get invoice error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/invoices
router.post('/', async (req, res) => {
  try {
    const {
      project_id,
      client_id,
      status = 'draft',
      total_amount,
      currency = 'AED',
      issue_date,
      due_date,
      tax_amount = 0,
      discount_amount = 0,
      notes,
      line_items = []
    } = req.body;

    if (!client_id || !total_amount || !due_date) {
      return res.status(400).json({ success: false, message: 'Client ID, total amount, and due date are required' });
    }

    const invoice = new Invoice({
      invoice_number: generateInvoiceNumber(),
      project_id,
      client_id,
      status,
      total_amount,
      currency,
      issue_date: issue_date || new Date(),
      due_date,
      tax_amount,
      discount_amount,
      notes
    });

    const savedInvoice = await invoice.save();

    // Save line items if provided
    if (line_items.length > 0) {
      for (const item of line_items) {
        const lineItem = new InvoiceItem({ ...item, invoice_id: savedInvoice._id });
        await lineItem.save();
      }
    }

    res.status(201).json({ success: true, data: savedInvoice });
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/invoices/:id
router.put('/:id', async (req, res) => {
  try {
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedInvoice) return res.status(404).json({ success: false, message: 'Invoice not found' });

    res.json({ success: true, data: updatedInvoice });
  } catch (error) {
    console.error('Update invoice error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/invoices/:id/status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ success: false, message: 'Status is required' });

    const updateData = { status };
    if (status === 'paid') updateData.paid_date = new Date();

    const updatedInvoice = await Invoice.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true });

    if (!updatedInvoice) return res.status(404).json({ success: false, message: 'Invoice not found' });

    res.json({ success: true, data: updatedInvoice });
  } catch (error) {
    console.error('Update invoice status error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/invoices/:id
router.delete('/:id', async (req, res) => {
  try {
    await InvoiceItem.deleteMany({ invoice_id: req.params.id }); // delete line items
    const deletedInvoice = await Invoice.findByIdAndDelete(req.params.id);

    if (!deletedInvoice) return res.status(404).json({ success: false, message: 'Invoice not found' });

    res.json({ success: true, message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error('Delete invoice error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/invoices/stats/summary
router.get('/stats/summary', async (req, res) => {
  try {
    const totalInvoices = await Invoice.countDocuments();
    const paidInvoices = await Invoice.countDocuments({ status: 'paid' });
    const pendingInvoices = await Invoice.countDocuments({ status: 'pending' });
    const overdueInvoices = await Invoice.countDocuments({ status: 'overdue' });
    const totalAmount = await Invoice.aggregate([{ $group: { _id: null, sum: { $sum: '$total_amount' } } }]);
    const paidAmount = await Invoice.aggregate([{ $match: { status: 'paid' } }, { $group: { _id: null, sum: { $sum: '$total_amount' } } }]);

    res.json({
      success: true,
      data: {
        totalInvoices,
        paidInvoices,
        pendingInvoices,
        overdueInvoices,
        totalAmount: totalAmount[0]?.sum || 0,
        paidAmount: paidAmount[0]?.sum || 0,
        outstandingAmount: (totalAmount[0]?.sum || 0) - (paidAmount[0]?.sum || 0)
      }
    });
  } catch (error) {
    console.error('Get invoice stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
