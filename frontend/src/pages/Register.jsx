import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import onboardingService from '../services/onboardingService';
import { Box, Card, CardContent, Typography, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { motion } from 'framer-motion';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        companyName: formData.companyName
      });

      if (res.success) {
        await onboardingService.start();
        navigate('/onboarding');
      } else {
        setError(res.message || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', p: 2 }}>
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <Card sx={{ maxWidth: 450, width: '100%', borderRadius: 3, boxShadow: 6 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" textAlign="center" gutterBottom color="primary">Register for PrintFlow</Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>Create your account</Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <form onSubmit={handleSubmit}>
              <TextField label="Full Name" name="name" value={formData.name} onChange={handleChange} fullWidth required margin="normal" />
              <TextField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} fullWidth required margin="normal" />
              <TextField label="Company Name (Optional)" name="companyName" value={formData.companyName} onChange={handleChange} fullWidth margin="normal" />
              <TextField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} fullWidth required margin="normal" />
              <TextField label="Confirm Password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} fullWidth required margin="normal" />

              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, py: 1.5 }} disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
              </Button>
            </form>

            <Box mt={2} textAlign="center">
              <Typography variant="caption" color="text.secondary">
                Already have an account? <Button variant="text" size="small" onClick={() => navigate('/login')}>Sign in</Button>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default Register;
