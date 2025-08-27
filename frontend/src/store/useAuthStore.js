import { create } from 'zustand';
import authService from '../services/authService.js';
import api from '../services/api.js';

// Create the authentication store (authentication only)
export const useAuthStore = create((set, get) => ({
  // State
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isInitializing: false,

  // Validate token with backend
  validateToken: async () => {
    try {
      const response = await api.get('/auth/validate');
      return { valid: true, user: response.data.user };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  },

  // Check if user is already logged in when app starts
  initializeAuth: async () => {
    if (get().isInitializing) {
      console.log('AuthStore: Already initializing, skipping...');
      return;
    }

    set({ isInitializing: true });

    const token = authService.getToken();
    const user = authService.getUser();

    if (token && user) {
      set({
        token,
        isAuthenticated: true,
        isLoading: true,
        error: null,
      });

      // Validate token with backend
      const validation = await get().validateToken();

      if (validation.valid) {
        set({
          isLoading: false,
          error: null,
          isInitializing: false,
        });
        console.log('AuthStore: Token validated successfully');
      } else {
        // Token is invalid - clear auth state
        authService.logout();
        set({
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
          isInitializing: false,
        });
        console.log('AuthStore: Token validation failed, logged out');
      }
    } else {
      set({ isInitializing: false });
      console.log('AuthStore: No valid auth data in localStorage');
    }
  },

  // Login action
  login: async (email, password) => {
    set({ isLoading: true, error: null });

    try {
      const result = await authService.login(email, password);

      if (result.success) {
        set({
          token: result.token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return { success: true };
      } else {
        set({
          isLoading: false,
          error: result.message,
        });
        return { success: false, message: result.message };
      }
    } catch (error) {
      set({
        isLoading: false,
        error: 'An unexpected error occurred',
      });
      return { success: false, message: 'An unexpected error occurred' };
    }
  },

  // Register action
  register: async (userData) => {
    set({ isLoading: true, error: null });

    try {
      const result = await authService.register(userData);

      if (result.success) {
        set({
          token: result.token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return { success: true };
      } else {
        set({
          isLoading: false,
          error: result.message,
        });
        return { success: false, message: result.message };
      }
    } catch (error) {
      set({
        isLoading: false,
        error: 'An unexpected error occurred',
      });
      return { success: false, message: 'An unexpected error occurred' };
    }
  },

  // Logout action
  logout: () => {
    authService.logout();
    set({
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    return { success: true, message: 'Logged out successfully' };
  },

  // Getters
  getToken: () => get().token,
  getIsAuthenticated: () => get().isAuthenticated,
  getIsLoading: () => get().isLoading,
  getError: () => get().error,

  // Setters
  setToken: (token) => set({ token }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));

export default useAuthStore;
