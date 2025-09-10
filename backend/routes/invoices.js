const express = require('express');
const { neon } = require('@neondatabase/serverless');
const router = express.Router();

const sql = neon(process.env.DATABASE_URL);

// Generate invoice number
const generateInvoiceNumber = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `INV-${year}-${random}`;
};

// @route   GET /api/invoices
// @desc    Get all invoices
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { status, client_id, project_id } = req.query;

    let query = `
      SELECT i.*, p.name as project_name, u.name as client_name, u.company_name
      FROM invoices i
      LEFT JOIN projects p ON i.project_id = p.id
      LEFT JOIN users u ON i.client_id = u.id
    `;

    const conditions = [];
    const params = [];

    if (status) {
      conditions.push(`i.status = $${params.length + 1}`);
      params.push(status);
    }

    if (client_id) {
      conditions.push(`i.client_id = $${params.length + 1}`);
      params.push(client_id);
    }

    if (project_id) {
      conditions.push(`i.project_id = $${params.length + 1}`);
      params.push(project_id);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ` ORDER BY i.created_at DESC`;

    const invoices = await sql.unsafe(query, params);

    res.json({
      success: true,
      data: invoices
    });
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/invoices/:id
// @desc    Get single invoice with line items
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const invoices = await sql`
      SELECT i.*, p.name as project_name, u.name as client_name, 
             u.company_name, u.email as client_email
      FROM invoices i
      LEFT JOIN projects p ON i.project_id = p.id
      LEFT JOIN users u ON i.client_id = u.id
      WHERE i.id = ${id}
      LIMIT 1
    `;

    if (invoices.length === 0) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Get invoice line items (if you have a separate table)
    const lineItems = await sql`
      SELECT * FROM invoice_items WHERE invoice_id = ${id}
      ORDER BY created_at ASC
    `.catch(() => []); // Ignore if table doesn't exist yet

    res.json({
      success: true,
      data: {
        ...invoices[0],
        lineItems
      }
    });
  } catch (error) {
    console.error('Get invoice error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/invoices
// @desc    Create new invoice
// @access  Private
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
      return res.status(400).json({ 
        message: 'Client ID, total amount, and due date are required' 
      });
    }

    const invoice_number = generateInvoiceNumber();

    const newInvoice = await sql`
      INSERT INTO invoices (
        invoice_number, project_id, client_id, status, total_amount, currency,
        issue_date, due_date, tax_amount, discount_amount, notes
      )
      VALUES (
        ${invoice_number}, ${project_id}, ${client_id}, ${status}, ${total_amount}, ${currency},
        ${issue_date || new Date().toISOString().split('T')[0]}, ${due_date}, 
        ${tax_amount}, ${discount_amount}, ${notes}
      )
      RETURNING *
    `;

    // Add line items if provided
    if (line_items.length > 0) {
      for (const item of line_items) {
        await sql`
          INSERT INTO invoice_items (
            invoice_id, description, quantity, unit_price, total_price
          )
          VALUES (
            ${newInvoice[0].id}, ${item.description}, ${item.quantity}, 
            ${item.unit_price}, ${item.total_price}
          )
        `.catch(() => {}); // Ignore if table doesn't exist
      }
    }

    res.status(201).json({
      success: true,
      data: newInvoice[0]
    });
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/invoices/:id
// @desc    Update invoice
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      status,
      total_amount,
      currency,
      issue_date,
      due_date,
      tax_amount,
      discount_amount,
      notes,
      paid_date
    } = req.body;

    const updatedInvoice = await sql`
      UPDATE invoices SET
        status = COALESCE(${status}, status),
        total_amount = COALESCE(${total_amount}, total_amount),
        currency = COALESCE(${currency}, currency),
        issue_date = COALESCE(${issue_date}, issue_date),
        due_date = COALESCE(${due_date}, due_date),
        tax_amount = COALESCE(${tax_amount}, tax_amount),
        discount_amount = COALESCE(${discount_amount}, discount_amount),
        notes = COALESCE(${notes}, notes),
        paid_date = COALESCE(${paid_date}, paid_date),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;

    if (updatedInvoice.length === 0) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.json({
      success: true,
      data: updatedInvoice[0]
    });
  } catch (error) {
    console.error('Update invoice error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/invoices/:id/status
// @desc    Update invoice status
// @access  Private
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const updateData = { status };

    if (status === 'paid') {
      updateData.paid_date = new Date().toISOString().split('T')[0];
    }

    const updatedInvoice = await sql`
      UPDATE invoices SET
        status = ${status},
        paid_date = CASE WHEN ${status} = 'paid' THEN CURRENT_DATE ELSE paid_date END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;

    if (updatedInvoice.length === 0) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.json({
      success: true,
      data: updatedInvoice[0]
    });
  } catch (error) {
    console.error('Update invoice status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/invoices/:id
// @desc    Delete invoice
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Delete related invoice items first
    await sql`DELETE FROM invoice_items WHERE invoice_id = ${id}`.catch(() => {});

    // Delete invoice
    const deletedInvoice = await sql`
      DELETE FROM invoices WHERE id = ${id}
      RETURNING *
    `;

    if (deletedInvoice.length === 0) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.json({
      success: true,
      message: 'Invoice deleted successfully'
    });
  } catch (error) {
    console.error('Delete invoice error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/invoices/stats/summary
// @desc    Get invoice statistics
// @access  Private
router.get('/stats/summary', async (req, res) => {
  try {
    const stats = await sql`
      SELECT 
        COUNT(*) as total_invoices,
        COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid_invoices,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_invoices,
        COUNT(CASE WHEN status = 'overdue' THEN 1 END) as overdue_invoices,
        SUM(total_amount) as total_amount,
        SUM(CASE WHEN status = 'paid' THEN total_amount ELSE 0 END) as paid_amount,
        SUM(CASE WHEN status IN ('pending', 'sent') THEN total_amount ELSE 0 END) as outstanding_amount
      FROM invoices
    `;

    res.json({
      success: true,
      data: stats[0]
    });
  } catch (error) {
    console.error('Get invoice stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/invoices/:id/send
// @desc    Send invoice to client (email)
// @access  Private
router.post('/:id/send', async (req, res) => {
  try {
    const { id } = req.params;

    // Update invoice status to sent
    const updatedInvoice = await sql`
      UPDATE invoices SET 
        status = 'sent', 
        sent_date = CURRENT_DATE,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;

    if (updatedInvoice.length === 0) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // TODO: Implement email sending logic here
    // For now, just return success

    res.json({
      success: true,
      message: 'Invoice sent successfully',
      data: updatedInvoice[0]
    });
  } catch (error) {
    console.error('Send invoice error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
