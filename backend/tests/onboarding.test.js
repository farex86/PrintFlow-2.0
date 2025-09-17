const request = require('supertest');
const mongoose = require('mongoose');
const { app, server } = require('../server'); // Assuming server exports app and server
const User = require('../models/User');
const Onboarding = require('../models/Onboarding');
const jwt = require('jsonwebtoken');

describe('Onboarding API', () => {
  let token;
  let userId;

  beforeAll(async () => {
    // Connect to a test database
    const url = `mongodb://127.0.0.1/printflow-test`;
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

    // Create a test user
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });
    userId = user._id;

    // Generate a token
    token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
  });

  afterAll(async () => {
    // Clean up database
    await User.deleteMany({});
    await Onboarding.deleteMany({});
    await mongoose.connection.close();
    server.close(); // Close the server
  });

  describe('GET /api/onboarding', () => {
    it('should get the onboarding status for the authenticated user', async () => {
      // First, create an onboarding status for the user
      await Onboarding.create({ user: userId });

      const res = await request(app)
        .get('/api/onboarding')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('currentStep', 'account-created');
    });
  });
});
