const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, { // <-- updated here
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Set up connection event listeners
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Currency configuration for multi-currency support
const CURRENCIES = {
  SDG: { symbol: 'ج.س', name: 'Sudanese Pound', code: 'SDG' },
  AED: { symbol: 'د.إ', name: 'UAE Dirham', code: 'AED' },
  SAR: { symbol: 'ر.س', name: 'Saudi Riyal', code: 'SAR' },
  EGP: { symbol: 'ج.م', name: 'Egyptian Pound', code: 'EGP' },
  USD: { symbol: '$', name: 'US Dollar', code: 'USD' }
};

const DEFAULT_CURRENCY = 'AED';

module.exports = {
  connectDB,
  CURRENCIES,
  DEFAULT_CURRENCY
};
