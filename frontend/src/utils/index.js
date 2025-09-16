// Utility functions will be added here
// Example: formatters, validators, helpers, etc.

export const formatCurrency = (amount, currency = 'AED') => {
  const symbols = {
    AED: 'د.إ',
    USD: '$',
    EUR: '€',
    SAR: 'ر.س',
    SDG: 'ج.س',
    EGP: 'ج.م'
  };

  return `${symbols[currency] || currency} ${amount.toLocaleString()}`;
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

export const getStatusColor = (status) => {
  const colors = {
    'pending': '#f59e0b',
    'completed': '#10b981',
    'in-progress': '#3b82f6',
    'cancelled': '#ef4444',
    'draft': '#6b7280'
  };

  return colors[status] || '#6b7280';
};
