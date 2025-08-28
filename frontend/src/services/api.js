import axios from 'axios';

// Get the base URL from environment variables
// Backend routes are mounted at root (e.g., '/ideas'), so no '/api' prefix
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - adds auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handles errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - token might be invalid
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          return Promise.reject({
            message: 'Authentication failed - please log in again',
            status,
            data,
            originalError: error,
          });

        case 403:
          // Forbidden - user doesn't have permission
          return Promise.reject({
            message: "You don't have permission to perform this action",
            status,
            data,
            originalError: error,
          });

        case 404:
          // Not found
          return Promise.reject({
            message: 'The requested resource was not found',
            status,
            data,
            originalError: error,
          });

        case 500:
          // Server error
          return Promise.reject({
            message: 'Server error - please try again later',
            status,
            data,
            originalError: error,
          });

        default:
          // Other HTTP errors
          return Promise.reject({
            message: data?.message || `HTTP ${status} error occurred`,
            status,
            data,
            originalError: error,
          });
      }
    } else if (error.request) {
      // Network error - no response received
      return Promise.reject({
        message: 'Network error - please check your connection',
        status: 0,
        originalError: error,
      });
    } else {
      // Something else happened
      return Promise.reject({
        message: 'An unexpected error occurred',
        status: 0,
        originalError: error,
      });
    }
  }
);

// Export the configured axios instance
export default api;

// Export the base URL for use in other files
export { API_BASE_URL };
