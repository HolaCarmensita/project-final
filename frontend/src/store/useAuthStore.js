import { create } from 'zustand';
import authService from '../services/authService.js';
import api from '../services/api.js';

// Create the authentication store
export const useAuthStore = create((set, get) => ({
  // State
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isInitializing: false, // Add flag to prevent multiple initializations

  // Validate token with backend
  validateToken: async () => {
    try {
      const response = await api.get('/auth/validate');
      return { valid: true, user: response.data.user };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  },

  // Get current user profile with populated data
  getCurrentUserProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return { valid: true, user: response.data.user };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  },

  // Check if user is already logged in when app starts
  initializeAuth: async () => {
    // Prevent multiple simultaneous initializations
    if (get().isInitializing) {
      console.log('AuthStore: Already initializing, skipping...');
      return;
    }

    set({ isInitializing: true });

    const token = authService.getToken();
    const user = authService.getUser();

    if (token && user) {
      // Set initial state from localStorage
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: true,
        error: null,
      });

      // Validate token with backend
      const validation = await get().validateToken();

      if (validation.valid) {
        // Token is valid - get fresh user data with populated likes and connections
        const profileResult = await get().getCurrentUserProfile();

        if (profileResult.valid) {
          set({
            user: profileResult.user,
            isLoading: false,
            error: null,
            isInitializing: false,
          });
          console.log(
            'AuthStore: Token validated and profile loaded successfully'
          );
        } else {
          // Fallback to validation user data if profile fetch fails
          set({
            user: validation.user,
            isLoading: false,
            error: null,
            isInitializing: false,
          });
          console.log(
            'AuthStore: Token validated successfully (profile fetch failed)'
          );
        }
      } else {
        // Token is invalid - clear auth state
        authService.logout();
        set({
          user: null,
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

  // Getter - gets the current user
  getUser: () => get().user,

  // Setter - updates the user
  setUser: (user) => set({ user }),

  // Getter - gets the current token
  getToken: () => get().token,

  // Setter - updates the token
  setToken: (token) => set({ token }),

  // Getter - gets the current authentication status
  getIsAuthenticated: () => get().isAuthenticated,

  // Setter - updates the authentication status
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

  // Getter - gets the current loading status
  getIsLoading: () => get().isLoading,

  // Setter - updates the loading status
  setIsLoading: (isLoading) => set({ isLoading }),

  // Getter - gets the current error
  getError: () => get().error,

  // Setter - updates the error
  setError: (error) => set({ error }),

  // Helper - clears the error
  clearError: () => set({ error: null }),

  // Login action
  login: async (email, password) => {
    // Start loading
    set({ isLoading: true, error: null });

    try {
      // Call the auth service
      const result = await authService.login(email, password);

      if (result.success) {
        // Login successful - update all auth state
        set({
          user: result.user,
          token: result.token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return { success: true };
      } else {
        // Login failed - set error
        set({
          isLoading: false,
          error: result.message,
        });
        return { success: false, message: result.message };
      }
    } catch (error) {
      // Unexpected error
      set({
        isLoading: false,
        error: 'An unexpected error occurred',
      });
      return { success: false, message: 'An unexpected error occurred' };
    }
  },

  // Register action
  register: async (userData) => {
    // Start loading
    set({ isLoading: true, error: null });

    try {
      // Call the auth service
      const result = await authService.register(userData);

      if (result.success) {
        // Registration successful - update all auth state
        set({
          user: result.user,
          token: result.token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return { success: true };
      } else {
        // Registration failed - set error
        set({
          isLoading: false,
          error: result.message,
        });
        return { success: false, message: result.message };
      }
    } catch (error) {
      // Unexpected error
      set({
        isLoading: false,
        error: 'An unexpected error occurred',
      });
      return { success: false, message: 'An unexpected error occurred' };
    }
  },

  // Logout action
  logout: () => {
    // Call auth service to clear tokens
    authService.logout();

    // Clear all auth state
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });

    return { success: true, message: 'Logged out successfully' };
  },
}));

export default useAuthStore;
