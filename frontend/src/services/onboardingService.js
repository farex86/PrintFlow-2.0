import api from '../config/api';

const onboardingService = {
  start: () => api.post('/onboarding/start'),
  getStatus: () => api.get('/onboarding'),
  updateStep: (step, data) => api.put('/onboarding', { step, ...data }),
};

export default onboardingService;
