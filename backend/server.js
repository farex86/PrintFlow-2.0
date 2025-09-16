const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Connect to MongoDB
async function connectDB() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in .env');
    }

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('💚 MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1); // Exit if DB connection fails
  }
}
connectDB();

// Import routes
const routes = require('./routes');

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'PrintFlow 2.0 API Server',
    version: '2.0.0',
    status: 'Running',
    database: 'MongoDB',
    timestamp: new Date().toISOString(),
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 PrintFlow API Server running on port ${PORT}`);
  console.log(`💚 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🗄️ Database: MongoDB with Mongoose`);
});

module.exports = app;
