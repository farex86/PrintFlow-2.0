// src/services/projectService.js
import axios from 'axios';
import API_CONFIG from '../config/api';
import authService from './authService';

class ProjectService {
  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.baseUrl,
      timeout: API_CONFIG.timeout,
      headers: { 'Content-Type': 'application/json' }
    });

    // Request interceptor to add token
    this.client.interceptors.request.use((config) => {
      const token = authService.getToken();
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
  }

  async getAll() {
    try {
      const response = await this.client.get('/projects');
      return response.data.success
        ? { success: true, projects: response.data.data }
        : { success: false, message: response.data.message };
    } catch (error) {
      console.error('getAll error:', error.response?.data || error.message);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  }

  async create(projectData) {
    try {
      const response = await this.client.post('/projects', projectData);
      return response.data.success
        ? { success: true, project: response.data.data }
        : { success: false, message: response.data.message };
    } catch (error) {
      console.error('create error:', error.response?.data || error.message);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  }

  async update(id, projectData) {
    try {
      const response = await this.client.put(`/projects/${id}`, projectData);
      return response.data.success
        ? { success: true, project: response.data.data }
        : { success: false, message: response.data.message };
    } catch (error) {
      console.error('update error:', error.response?.data || error.message);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  }

  async delete(id) {
    try {
      const response = await this.client.delete(`/projects/${id}`);
      return response.data.success
        ? { success: true }
        : { success: false, message: response.data.message };
    } catch (error) {
      console.error('delete error:', error.response?.data || error.message);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  }
}

const projectService = new ProjectService();
export default projectService;
