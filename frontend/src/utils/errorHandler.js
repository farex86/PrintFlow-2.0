export const handleApiError = (error, fallbackMessage = 'Something went wrong') => {
  if (error.status === 401) {
    // Token expired, redirect to login
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    return 'Session expired. Please log in again.';
  }
  
  if (error.status === 403) {
    return 'You do not have permission to perform this action.';
  }
  
  if (error.status >= 500) {
    return 'Server error. Please try again later.';
  }
  
  return error.message || fallbackMessage;
};

export const showNotification = (message, type = 'info') => {
  // You can integrate with a toast library here
  console.log(`${type.toUpperCase()}: ${message}`);
};
