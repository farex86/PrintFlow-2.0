const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { CURRENCIES } = require('./database');

// Create payment intent for multi-currency support
const createPaymentIntent = async (amount, currency = 'AED', metadata = {}) => {
  try {
    // Validate currency
    if (!CURRENCIES[currency]) {
      throw new Error(`Unsupported currency: ${currency}`);
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to smallest currency unit
      currency: currency.toLowerCase(),
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    };
  } catch (error) {
    console.error('Stripe payment intent error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Confirm payment
const confirmPayment = async (paymentIntentId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    return {
      success: true,
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency.toUpperCase()
    };
  } catch (error) {
    console.error('Stripe confirm payment error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Create customer
const createCustomer = async (email, name, metadata = {}) => {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata
    });

    return {
      success: true,
      customerId: customer.id
    };
  } catch (error) {
    console.error('Stripe create customer error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Create invoice
const createInvoice = async (customerId, items, currency = 'AED') => {
  try {
    // Create invoice items
    for (const item of items) {
      await stripe.invoiceItems.create({
        customer: customerId,
        amount: Math.round(item.amount * 100),
        currency: currency.toLowerCase(),
        description: item.description
      });
    }

    // Create and finalize invoice
    const invoice = await stripe.invoices.create({
      customer: customerId,
      currency: currency.toLowerCase(),
      auto_advance: false
    });

    const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);

    return {
      success: true,
      invoiceId: finalizedInvoice.id,
      invoiceUrl: finalizedInvoice.hosted_invoice_url,
      invoicePdf: finalizedInvoice.invoice_pdf
    };
  } catch (error) {
    console.error('Stripe create invoice error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Webhook signature validation
const validateWebhookSignature = (payload, signature) => {
  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    return { success: true, event };
  } catch (error) {
    console.error('Stripe webhook validation error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  stripe,
  createPaymentIntent,
  confirmPayment,
  createCustomer,
  createInvoice,
  validateWebhookSignature
};
