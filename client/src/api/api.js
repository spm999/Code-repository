// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const userAPI = {
  // Auth routes
  register: async (userData) => {
    const response = await api.post('/users/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/users/login', credentials);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  updateProfile: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  // Admin user management
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

export const adminAPI = {
  // Admin auth
  register: async (adminData) => {
    const response = await api.post('/admin/register', adminData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/admin/login', credentials);
    return response.data;
  },

  // Admin management
  getAllAdmins: async () => {
    const response = await api.get('/admin');
    return response.data;
  },

  updateAdmin: async (id, adminData) => {
    const response = await api.put(`/admin/${id}`, adminData);
    return response.data;
  },

  deleteAdmin: async (id) => {
    const response = await api.delete(`/admin/${id}`);
    return response.data;
  },
};

export const codeAPI = {
  // Code files
  createCodeFile: async (codeData) => {
    const response = await api.post('/code/files', codeData);
    return response.data;
  },

  getCodeFiles: async (params = {}) => {
    const response = await api.get('/code/files', { params });
    return response.data;
  },

  getCodeFile: async (id) => {
    const response = await api.get(`/code/files/${id}`);
    return response.data;
  },

  updateCodeFile: async (id, codeData) => {
    const response = await api.put(`/code/files/${id}`, codeData);
    return response.data;
  },

  deleteCodeFile: async (id) => {
    const response = await api.delete(`/code/files/${id}`);
    return response.data;
  },

  // File upload
  uploadCodeVersion: async (id, file) => {
    const formData = new FormData();
    formData.append('codeFile', file);
    
    const response = await api.post(`/code/files/${id}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Collaboration
  addCollaborator: async (id, collaboratorData) => {
    const response = await api.post(`/code/files/${id}/collaborators`, collaboratorData);
    return response.data;
  },

  shareCodeFile: async (id, shareData) => {
    const response = await api.post(`/code/files/${id}/share`, shareData);
    return response.data;
  },

  generateShareLink: async (id, linkData) => {
    const response = await api.post(`/code/files/${id}/share/link`, linkData);
    return response.data;
  },

  // Review system
  requestReview: async (id, reviewData) => {
    const response = await api.post(`/code/files/${id}/request-review`, reviewData);
    return response.data;
  },

  submitForReview: async (id, reviewData) => {
    const response = await api.post(`/code/versions/${id}/submit-review`, reviewData);
    return response.data;
  },

  reviewerApprove: async (id, approvalData) => {
    const response = await api.post(`/code/files/${id}/reviewer-approve`, approvalData);
    return response.data;
  },

  adminApprove: async (id, approvalData) => {
    const response = await api.post(`/code/files/${id}/admin-approve`, approvalData);
    return response.data;
  },

  reviewCodeVersion: async (id, reviewData) => {
    const response = await api.post(`/code/versions/${id}/review`, reviewData);
    return response.data;
  },
};

export default api;
