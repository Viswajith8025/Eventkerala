import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('LiveKeralam API BaseURL:', api.defaults.baseURL);

// Add a request interceptor to include the JWT token
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

// Get the base backend URL (without /api/v1)
export const IMAGE_BASE_URL = api.defaults.baseURL.replace('/api/v1', '');

/**
 * Helper to get full image URL, handling both local paths and external URLs
 */
export const getImageUrl = (path) => {
  if (!path) return '/placeholder.jpg';
  if (path.startsWith('http')) return path;
  // Prepend backend URL for relative paths (like /uploads/local/...)
  return `${IMAGE_BASE_URL}${path}`;
};

export default api;
