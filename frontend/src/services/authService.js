import API_CONFIG from '../config/api';

class AuthService {
  async login(credentials) {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/auth/login`, {
        method: 'POST',
        headers: API_CONFIG.headers,
        body: JSON.stringify(credentials)
      });
      const data = await response.json();
      if (data.success) {
        // Use same keys as AuthContext
        localStorage.setItem('printflow_token', data.token);
        localStorage.setItem('printflow_user', JSON.stringify(data.user));
        return { success: true, user: data.user, token: data.token };
      }
      return { success: false, message: data.message };
    } catch (error) {
      return { success: false, message: 'Network error' };
    }
  }

  logout() {
    localStorage.removeItem('printflow_token');
    localStorage.removeItem('printflow_user');
    window.location.href = '/login';
  }

  getToken() {
    return localStorage.getItem('printflow_token');
  }

  getUser() {
    const user = localStorage.getItem('printflow_user');
    return user ? JSON.parse(user) : null;
  }
}

const authService = new AuthService();
export default authService;
