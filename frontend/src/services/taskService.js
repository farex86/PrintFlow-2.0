import API_CONFIG from '../config/api';
import authService from './authService';

class TaskService {
  async request(url, options = {}) {
    const token = authService.getToken();
    const headers = {
      ...API_CONFIG.headers,
      Authorization: `Bearer ${token}`,
      ...options.headers,
    };

    const response = await fetch(`${API_CONFIG.baseUrl}${url}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      const refreshed = await authService.refreshToken();
      if (!refreshed) return { success: false, message: 'Unauthorized' };

      // Retry request after refreshing token
      const newToken = authService.getToken();
      const retryHeaders = {
        ...API_CONFIG.headers,
        Authorization: `Bearer ${newToken}`,
        ...options.headers,
      };

      const retryResponse = await fetch(`${API_CONFIG.baseUrl}${url}`, {
        ...options,
        headers: retryHeaders,
      });

      const data = await retryResponse.json();
      return data.success ? { success: true, ...data } : { success: false, message: data.message };
    }

    const data = await response.json();
    return data.success ? { success: true, ...data } : { success: false, message: data.message };
  }

  async getAll(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    return this.request(`/tasks?${query}`);
  }

  async create(taskData) {
    return this.request('/tasks', { method: 'POST', body: JSON.stringify(taskData) });
  }

  async updateStatus(id, status) {
    return this.request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify({ status }) });
  }
}

const taskService = new TaskService();
export default taskService;
