import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Response interceptor for unified error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.message ||
      'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  }
);

export const taskAPI = {
  // Get all tasks with optional filters
  getAll: (params = {}) => api.get('/tasks', { params }),

  // Get single task
  getById: (id) => api.get(`/tasks/${id}`),

  // Create task
  create: (data) => api.post('/tasks', data),

  // Full update
  update: (id, data) => api.put(`/tasks/${id}`, data),

  // Quick status update
  updateStatus: (id, status) => api.patch(`/tasks/${id}/status`, { status }),

  // Delete single task
  delete: (id) => api.delete(`/tasks/${id}`),

  // Bulk delete by status
  bulkDelete: (status) => api.delete('/tasks', { params: { status } }),

  // Health check
  health: () => api.get('/health'),
};

export default api;
