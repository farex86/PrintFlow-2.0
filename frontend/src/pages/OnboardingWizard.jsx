import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import onboardingService from '../services/onboardingService';
import Step2_Company from '../components/onboarding/Step2_Company';
import Step3_Branding from '../components/onboarding/Step3_Branding';
import Step4_Documents from '../components/onboarding/Step4_Documents';

const OnboardingWizard = () => {
  const [loading, setLoading] = useState(true);
  const [onboardingData, setOnboardingData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await onboardingService.getStatus();
        setOnboardingData(res.data);
      } catch (err) {
        setError('Could not load onboarding status.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  const handleNextStep = async (step, data) => {
      try {
          const res = await onboardingService.updateStep(step, data);
          setOnboardingData(res.data);
      } catch(err) {
          setError('Could not update onboarding status.');
          console.error(err);
      }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  const renderStep = () => {
    switch (onboardingData?.currentStep) {
      case 'account-created':
        return <Step2_Company onNext={handleNextStep} />;
      case 'company-details':
        return <Step3_Branding onNext={handleNextStep} />;
      case 'brand-profile':
        return <Step4_Documents onNext={handleNextStep} />;
      case 'completed':
        // Redirect to dashboard or show a completion message
        window.location.href = '/dashboard';
        return null;
      default:
        return <Typography>Unknown onboarding step.</Typography>;
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Client Onboarding</Typography>
      {renderStep()}
    </Box>
  );
};

export default OnboardingWizard;
