import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Card, CardContent } from '@mui/material';

const Step2_Company = ({ onNext }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    phoneNumber: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext('company-details', { companyDetails: formData });
  };

  return (
    <Card sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>Company Information</Typography>
        <Typography color="text.secondary" mb={3}>Please provide your company's details.</Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Company Name" name="companyName" value={formData.companyName} onChange={handleChange} fullWidth required margin="normal" />
          <TextField label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} fullWidth required margin="normal" />
          <TextField label="Street" name="address.street" value={formData.address.street} onChange={handleChange} fullWidth required margin="normal" />
          <TextField label="City" name="address.city" value={formData.address.city} onChange={handleChange} fullWidth required margin="normal" />
          <TextField label="State / Province" name="address.state" value={formData.address.state} onChange={handleChange} fullWidth required margin="normal" />
          <TextField label="Country" name="address.country" value={formData.address.country} onChange={handleChange} fullWidth required margin="normal" />
          <TextField label="Postal Code" name="address.postalCode" value={formData.address.postalCode} onChange={handleChange} fullWidth required margin="normal" />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Continue</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default Step2_Company;
