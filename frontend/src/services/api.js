import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15s timeout
});

console.log('LiveKeralam API BaseURL:', api.defaults.baseURL);

// Request interceptor with JWT token
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

// Exponential backoff retry interceptor
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1s base

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalConfig = error.config;

    // Don't retry if no config
    if (!originalConfig) return Promise.reject(error);

    // Initialize retry count
    if (originalConfig._retry === undefined) {
      originalConfig._retry = 0;
    }

    // Never retry: auth errors, message endpoints (non-critical), or if already maxed
    const isAuthError = error.response?.status === 401;
    const isMessageRoute = originalConfig.url?.includes('/messages');
    const maxed = originalConfig._retry >= MAX_RETRIES;

    const shouldRetry = (
      !isAuthError &&
      !isMessageRoute &&
      !maxed &&
      (error.response?.status >= 500 || !error.response) // Server errors only
    );

    if (shouldRetry) {
      const delay = RETRY_DELAY * Math.pow(2, originalConfig._retry);
      originalConfig._retry += 1;
      await new Promise(resolve => setTimeout(resolve, delay));
      return api(originalConfig);
    }

    return Promise.reject(error);
  }
);

// Get the base backend URL (without /api/v1)
export const IMAGE_BASE_URL = api.defaults.baseURL.replace('/api/v1', '');

/**
 * Helper to get full image URL, handling both local paths and external URLs
 * Applies Cloudinary auto-optimization: f_auto (format), q_auto (quality), w_auto (width)
 */
export const getImageUrl = (path, options = {}) => {
  if (!path) return '/placeholder.jpg';
  
  // If it's already an absolute URL
  if (path.includes('http')) {
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    if (cleanPath.includes('cloudinary.com')) {
      // Basic optimization insertion if not already present
      if (!cleanPath.includes('/f_auto,q_auto')) {
        return cleanPath.replace('/upload/', '/upload/f_auto,q_auto/');
      }
    }
    return cleanPath;
  }
  
  // For relative paths, ensure single slash
  const relativePath = path.startsWith('/') ? path : `/${path}`;
  return `${IMAGE_BASE_URL}${relativePath}`;
};

export default api;
