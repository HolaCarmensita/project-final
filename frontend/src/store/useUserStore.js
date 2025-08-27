import { create } from 'zustand';
import api from '../services/api.js';

// Create the user store (user data only)
export const useUserStore = create((set, get) => ({
  // State
  user: null,
  isLoading: false,
  error: null,

  // Fetch user profile with fresh data from aggregation
  fetchUserProfile: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.get('/users/profile');
      set({
        user: response.data.user,
        isLoading: false,
        error: null,
      });
      return { success: true, user: response.data.user };
    } catch (error) {
      set({
        isLoading: false,
        error: error.message,
      });
      return { success: false, message: error.message };
    }
  },

  // Update user profile (settings only)
  updateUserProfile: async (userData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.put('/users/profile', userData);
      set({
        user: response.data.user,
        isLoading: false,
        error: null,
      });
      return { success: true, user: response.data.user };
    } catch (error) {
      set({
        isLoading: false,
        error: error.message,
      });
      return { success: false, message: error.message };
    }
  },

  // Update user's liked ideas (called by ideas store)
  updateLikedIdeas: (likedIdeas) => {
    set((state) => ({
      user: state.user ? { ...state.user, likedIdeas } : null,
    }));
  },

  // Update user's connections (called by ideas store)
  updateConnections: (connectedIdeas, receivedConnections) => {
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            connectedIdeas: connectedIdeas || state.user.connectedIdeas,
            receivedConnections:
              receivedConnections || state.user.receivedConnections,
          }
        : null,
    }));
  },

  // Clear user data (called on logout)
  clearUser: () => {
    set({
      user: null,
      isLoading: false,
      error: null,
    });
  },

  // Getters
  getUser: () => get().user,
  getIsLoading: () => get().isLoading,
  getError: () => get().error,

  // Setters
  setUser: (user) => set({ user }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));

export default useUserStore;
