const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { neon } = require('@neondatabase/serverless');
const router = express.Router();

const sql = neon(process.env.DATABASE_URL);

// @route   POST /api/payments/create-payment-intent
// @desc    Create Stripe payment intent
// @access  Private
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'aed', invoice_id, description } = req.body;

    if (!amount || !invoice_id) {
      return res.status(400).json({ 
        message: 'Amount and invoice ID are required' 
      });
    }

    // Get invoice details
    const invoices = await sql`
      SELECT * FROM invoices WHERE id = ${invoice_id} LIMIT 1
    `;

    if (invoices.length === 0) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    const invoice = invoices[0];

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      description: description || `Payment for Invoice ${invoice.invoice_number}`,
      metadata: {
        invoice_id: invoice_id.toString(),
        invoice_number: invoice.invoice_number
      }
    });

    // Save payment record
    const newPayment = await sql`
      INSERT INTO payments (
        invoice_id, stripe_payment_intent_id, amount, currency, 
        status, payment_method
      )
      VALUES (
        ${invoice_id}, ${paymentIntent.id}, ${amount}, ${currency},
        'pending', 'stripe'
      )
      RETURNING *
    `;

    res.json({
      success: true,
      data: {
        client_secret: paymentIntent.client_secret,
        payment_intent_id: paymentIntent.id,
        payment_record: newPayment[0]
      }
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ message: 'Payment setup failed' });
  }
});

// @route   POST /api/payments/confirm-payment
// @desc    Confirm payment and update records
// @access  Private
router.post('/confirm-payment', async (req, res) => {
  try {
    const { payment_intent_id } = req.body;

    if (!payment_intent_id) {
      return res.status(400).json({ message: 'Payment intent ID is required' });
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);

    if (paymentIntent.status === 'succeeded') {
      // Update payment record
      const updatedPayment = await sql`
        UPDATE payments SET
          status = 'completed',
          stripe_charge_id = ${paymentIntent.latest_charge},
          completed_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
        WHERE stripe_payment_intent_id = ${payment_intent_id}
        RETURNING *
      `;

      if (updatedPayment.length > 0) {
        const payment = updatedPayment[0];

        // Update invoice status to paid
        await sql`
          UPDATE invoices SET
            status = 'paid',
            paid_date = CURRENT_DATE,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ${payment.invoice_id}
        `;

        res.json({
          success: true,
          message: 'Payment confirmed successfully',
          data: payment
        });
      } else {
        res.status(404).json({ message: 'Payment record not found' });
      }
    } else {
      res.status(400).json({ 
        message: 'Payment not completed', 
        status: paymentIntent.status 
      });
    }
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ message: 'Payment confirmation failed' });
  }
});

// @route   GET /api/payments
// @desc    Get all payments
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { invoice_id, status } = req.query;

    let query = `
      SELECT p.*, i.invoice_number, u.name as client_name
      FROM payments p
      LEFT JOIN invoices i ON p.invoice_id = i.id
      LEFT JOIN users u ON i.client_id = u.id
    `;

    const conditions = [];
    const params = [];

    if (invoice_id) {
      conditions.push(`p.invoice_id = $${params.length + 1}`);
      params.push(invoice_id);
    }

    if (status) {
      conditions.push(`p.status = $${params.length + 1}`);
      params.push(status);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ` ORDER BY p.created_at DESC`;

    const payments = await sql.unsafe(query, params);

    res.json({
      success: true,
      data: payments
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/payments/:id
// @desc    Get single payment
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const payments = await sql`
      SELECT p.*, i.invoice_number, i.total_amount as invoice_amount,
             u.name as client_name, u.email as client_email
      FROM payments p
      LEFT JOIN invoices i ON p.invoice_id = i.id
      LEFT JOIN users u ON i.client_id = u.id
      WHERE p.id = ${id}
      LIMIT 1
    `;

    if (payments.length === 0) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json({
      success: true,
      data: payments[0]
    });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/payments/refund
// @desc    Process refund
// @access  Private
router.post('/refund', async (req, res) => {
  try {
    const { payment_id, amount, reason } = req.body;

    if (!payment_id) {
      return res.status(400).json({ message: 'Payment ID is required' });
    }

    // Get payment details
    const payments = await sql`
      SELECT * FROM payments WHERE id = ${payment_id} LIMIT 1
    `;

    if (payments.length === 0) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    const payment = payments[0];

    if (payment.status !== 'completed') {
      return res.status(400).json({ message: 'Can only refund completed payments' });
    }

    // Create refund in Stripe
    const refund = await stripe.refunds.create({
      charge: payment.stripe_charge_id,
      amount: amount ? Math.round(amount * 100) : undefined, // Partial or full refund
      reason: reason || 'requested_by_customer'
    });

    // Save refund record
    const newRefund = await sql`
      INSERT INTO refunds (
        payment_id, stripe_refund_id, amount, currency, reason, status
      )
      VALUES (
        ${payment_id}, ${refund.id}, ${refund.amount / 100}, ${refund.currency},
        ${reason}, 'completed'
      )
      RETURNING *
    `;

    // Update payment status if fully refunded
    if (!amount || amount >= payment.amount) {
      await sql`
        UPDATE payments SET
          status = 'refunded',
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${payment_id}
      `;
    }

    res.json({
      success: true,
      message: 'Refund processed successfully',
      data: newRefund[0]
    });
  } catch (error) {
    console.error('Process refund error:', error);
    res.status(500).json({ message: 'Refund processing failed' });
  }
});

// @route   POST /api/payments/webhook
// @desc    Handle Stripe webhooks
// @access  Public
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;

      // Update payment status
      await sql`
        UPDATE payments SET
          status = 'completed',
          stripe_charge_id = ${paymentIntent.latest_charge},
          completed_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
        WHERE stripe_payment_intent_id = ${paymentIntent.id}
      `;

      // Update invoice status
      const invoiceId = paymentIntent.metadata.invoice_id;
      if (invoiceId) {
        await sql`
          UPDATE invoices SET
            status = 'paid',
            paid_date = CURRENT_DATE,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ${invoiceId}
        `;
      }

      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;

      await sql`
        UPDATE payments SET
          status = 'failed',
          updated_at = CURRENT_TIMESTAMP
        WHERE stripe_payment_intent_id = ${failedPayment.id}
      `;

      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({received: true});
});

// @route   GET /api/payments/stats/summary
// @desc    Get payment statistics
// @access  Private
router.get('/stats/summary', async (req, res) => {
  try {
    const stats = await sql`
      SELECT 
        COUNT(*) as total_payments,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as successful_payments,
        COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_payments,
        COUNT(CASE WHEN status = 'refunded' THEN 1 END) as refunded_payments,
        SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) as total_revenue,
        AVG(CASE WHEN status = 'completed' THEN amount ELSE NULL END) as avg_payment_amount
      FROM payments
      WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
    `;

    res.json({
      success: true,
      data: stats[0]
    });
  } catch (error) {
    console.error('Get payment stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
