const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const router = express.Router();
const Payment = require('../models/Payment');
const Refund = require('../models/Refund');
const Invoice = require('../models/Invoice');
const User = require('../models/User');

// @route   POST /api/payments/create-payment-intent
// @desc    Create Stripe payment intent
// @access  Private
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'aed', invoice_id, description } = req.body;

    if (!amount || !invoice_id) {
      return res.status(400).json({ message: 'Amount and invoice ID are required' });
    }

    const invoice = await Invoice.findById(invoice_id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: currency.toLowerCase(),
      description: description || `Payment for Invoice ${invoice.invoice_number}`,
      metadata: {
        invoice_id: invoice_id.toString(),
        invoice_number: invoice.invoice_number
      }
    });

    const newPayment = await Payment.create({
      invoice_id,
      stripe_payment_intent_id: paymentIntent.id,
      amount,
      currency,
      status: 'pending',
      payment_method: 'stripe'
    });

    res.json({
      success: true,
      data: {
        client_secret: paymentIntent.client_secret,
        payment_intent_id: paymentIntent.id,
        payment_record: newPayment
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
    if (!payment_intent_id) return res.status(400).json({ message: 'Payment intent ID is required' });

    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);

    if (paymentIntent.status === 'succeeded') {
      const payment = await Payment.findOneAndUpdate(
        { stripe_payment_intent_id: payment_intent_id },
        { 
          status: 'completed', 
          stripe_charge_id: paymentIntent.latest_charge,
          completed_at: new Date(),
          updated_at: new Date()
        },
        { new: true }
      );

      if (!payment) return res.status(404).json({ message: 'Payment record not found' });

      await Invoice.findByIdAndUpdate(payment.invoice_id, {
        status: 'paid',
        paid_date: new Date(),
        updated_at: new Date()
      });

      return res.json({ success: true, message: 'Payment confirmed successfully', data: payment });
    } else {
      return res.status(400).json({ message: 'Payment not completed', status: paymentIntent.status });
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

    const filter = {};
    if (invoice_id) filter.invoice_id = invoice_id;
    if (status) filter.status = status;

    const payments = await Payment.find(filter)
      .populate({
        path: 'invoice_id',
        select: 'invoice_number total_amount client_id',
        populate: { path: 'client_id', select: 'name' }
      })
      .sort({ created_at: -1 });

    res.json({ success: true, data: payments });
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

    const payment = await Payment.findById(id)
      .populate({
        path: 'invoice_id',
        select: 'invoice_number total_amount client_id',
        populate: { path: 'client_id', select: 'name email' }
      });

    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    res.json({ success: true, data: payment });
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
    if (!payment_id) return res.status(400).json({ message: 'Payment ID is required' });

    const payment = await Payment.findById(payment_id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    if (payment.status !== 'completed') return res.status(400).json({ message: 'Can only refund completed payments' });

    const refund = await stripe.refunds.create({
      charge: payment.stripe_charge_id,
      amount: amount ? Math.round(amount * 100) : undefined,
      reason: reason || 'requested_by_customer'
    });

    const newRefund = await Refund.create({
      payment_id,
      stripe_refund_id: refund.id,
      amount: refund.amount / 100,
      currency: refund.currency,
      reason,
      status: 'completed'
    });

    if (!amount || amount >= payment.amount) {
      payment.status = 'refunded';
      await payment.save();
    }

    res.json({ success: true, message: 'Refund processed successfully', data: newRefund });
  } catch (error) {
    console.error('Process refund error:', error);
    res.status(500).json({ message: 'Refund processing failed' });
  }
});

module.exports = router;
