import axios from 'axios';

/**
 * API Configuration Service
 * Centralizes all API endpoints and handles environment-based configuration
 */

// Get API URL from environment or use default
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 10000;

console.log(`🌐 API Base URL: ${API_BASE_URL}`);

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add interceptor to attach token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============ API ENDPOINTS ============

export const API = {
  // ===== AUTHENTICATION =====
  auth: {
    register: (data) => apiClient.post('/api/auth/register', data),
    login: (data) => apiClient.post('/api/auth/login', data),
    getProfile: () => apiClient.get('/api/auth/me'),
    logout: () => localStorage.removeItem('token')
  },

  // ===== USERS =====
  users: {
    getProfile: () => apiClient.get('/api/users/profile'),
    updateProfile: (data) => apiClient.put('/api/users/profile', data),
    getUser: (id) => apiClient.get(`/api/users/${id}`),
    updateLocation: (data) => apiClient.put('/api/users/location', data)
  },

  // ===== JOBS / MARKETPLACE =====
  jobs: {
    // CRUD
    create: (data) => apiClient.post('/api/jobs', data),
    getAll: (params) => apiClient.get('/api/jobs', { params }),
    getById: (id) => apiClient.get(`/api/jobs/${id}`),
    update: (id, data) => apiClient.put(`/api/jobs/${id}`, data),
    delete: (id) => apiClient.delete(`/api/jobs/${id}`),

    // Actions
    accept: (id) => apiClient.post(`/api/jobs/${id}/accept`),
    complete: (id) => apiClient.post(`/api/jobs/${id}/complete`),
    rate: (id, data) => apiClient.post(`/api/jobs/${id}/rate`, data),

    // Search & Filter
    getNearby: (params) => apiClient.get('/api/jobs/search/nearby', { params }),
    search: (params) => apiClient.get('/api/jobs/search/query', { params }),
    getByCategory: (params) => apiClient.get('/api/jobs/search/category', { params }),
    getBySkills: (params) => apiClient.get('/api/jobs/search/skills', { params }),
    getTrending: (params) => apiClient.get('/api/jobs/search/trending', { params }),

    // User-specific
    getRecommended: (params) => apiClient.get('/api/jobs/recommendations/for-me', { params }),
    getHistory: () => apiClient.get('/api/jobs/history/my-jobs'),
    getActive: () => apiClient.get('/api/jobs/active/my-active'),
    getByProvider: (providerId) => apiClient.get(`/api/jobs/provider/${providerId}`)
  },

  // ===== CHAT / MESSAGING =====
  chat: {
    getMessages: (userId) => apiClient.get(`/api/chat/messages/${userId}`),
    sendMessage: (data) => apiClient.post('/api/chat/send', data),
    getConversations: () => apiClient.get('/api/chat/conversations')
  },

  // ===== VERIFICATION & VOLUNTEER =====
  verification: {
    verifyVolunteer: (data) => apiClient.post('/api/auth/verify-volunteer', data),
    instantVerify: (data) => apiClient.post('/api/auth/instant-verify', data),
    getVerificationStatus: () => apiClient.get('/api/users/verification-status')
  }
};

// ============ SOCKET.IO CONFIGURATION ============

export const SOCKET_CONFIG = {
  url: API_BASE_URL,
  options: {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5
  }
};

// ============ HELPER FUNCTIONS ============

/**
 * Format API error message for user display
 */
export const getErrorMessage = (error) => {
  if (error.response?.data?.msg) {
    return error.response.data.msg;
  }
  if (error.message === 'Network Error') {
    return 'Network error. Please check your connection.';
  }
  if (error.code === 'ECONNABORTED') {
    return 'Request timeout. Please try again.';
  }
  return error.message || 'An error occurred. Please try again.';
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

/**
 * Get current user from localStorage
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Save current user to localStorage
 */
export const setCurrentUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

/**
 * Clear all user data
 */
export const clearUserData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('volunteer_status');
};

export default apiClient;
