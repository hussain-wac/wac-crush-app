import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const storage = localStorage.getItem('company-crush-storage');
  if (storage) {
    const { state } = JSON.parse(storage);
    if (state?.token) {
      config.headers.Authorization = `Bearer ${state.token}`;
    }
  }
  return config;
});

// Auth API
export const authAPI = {
  register: async (credential, name, imageFile, gender, preference) => {
    const formData = new FormData();
    formData.append('credential', credential);
    formData.append('name', name);
    formData.append('image', imageFile);
    formData.append('gender', gender);
    formData.append('preference', preference);

    const response = await api.post('/auth/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  login: async (credential) => {
    const response = await api.post('/auth/login', { credential });
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

// Users API
export const usersAPI = {
  getSwipeableUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  }
};

// Crush API
export const crushAPI = {
  swipe: async (targetUserId, direction) => {
    const response = await api.post('/crush/swipe', { targetUserId, direction });
    return response.data;
  }
};

// Matches API
export const matchesAPI = {
  getMatches: async () => {
    const response = await api.get('/matches');
    return response.data;
  }
};

export default api;
