import { create } from 'zustand';
import api from '../services/api.js';
import usersService from '../services/usersService.js';
import authService from '../services/authService.js';

// Create the user store (consolidated user data and actions)
export const useUserStore = create((set, get) => ({
  // State
  user: null,
  userConnections: [],
  allUsers: [],
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

  // Get all users (for discovery)
  fetchAllUsers: async () => {
    set({ isLoading: true, error: null });

    try {
      const result = await usersService.getAllUsers();

      if (result.success) {
        set({
          allUsers: result.users,
          isLoading: false,
        });
        return { success: true, users: result.users };
      } else {
        set({
          error: result.message,
          isLoading: false,
        });
        return { success: false, message: result.message };
      }
    } catch (error) {
      set({
        error: 'Failed to fetch users',
        isLoading: false,
      });
      return { success: false, message: 'Failed to fetch users' };
    }
  },

  // Get user by ID
  fetchUserById: async (userId) => {
    set({ isLoading: true, error: null });

    try {
      const result = await usersService.getUserById(userId);

      if (result.success) {
        set({ isLoading: false });
        return { success: true, user: result.user };
      } else {
        set({
          error: result.message,
          isLoading: false,
        });
        return { success: false, message: result.message };
      }
    } catch (error) {
      set({
        error: 'Failed to fetch user',
        isLoading: false,
      });
      return { success: false, message: 'Failed to fetch user' };
    }
  },

  // Get user connections
  fetchUserConnections: async () => {
    set({ isLoading: true, error: null });

    try {
      const result = await usersService.getUserConnections();

      if (result.success) {
        set({
          userConnections: result.connections,
          isLoading: false,
        });
        return { success: true, connections: result.connections };
      } else {
        set({
          error: result.message,
          isLoading: false,
        });
        return { success: false, message: result.message };
      }
    } catch (error) {
      set({
        error: 'Failed to fetch connections',
        isLoading: false,
      });
      return { success: false, message: 'Failed to fetch connections' };
    }
  },

  // Create connection with another user
  createConnection: async (userId, message) => {
    set({ isLoading: true, error: null });

    try {
      const result = await usersService.createConnection(userId, message);

      if (result.success) {
        set((state) => ({
          userConnections: [...state.userConnections, result.connection],
          isLoading: false,
        }));
        return { success: true, connection: result.connection };
      } else {
        set({
          error: result.message,
          isLoading: false,
        });
        return { success: false, message: result.message };
      }
    } catch (error) {
      set({
        error: 'Failed to create connection',
        isLoading: false,
      });
      return { success: false, message: 'Failed to create connection' };
    }
  },

  // Remove connection
  removeConnection: async (connectionId) => {
    set({ isLoading: true, error: null });

    try {
      const result = await usersService.removeConnection(connectionId);

      if (result.success) {
        set((state) => ({
          userConnections: state.userConnections.filter(
            (conn) => conn._id !== connectionId
          ),
          isLoading: false,
        }));
        return { success: true };
      } else {
        set({
          error: result.message,
          isLoading: false,
        });
        return { success: false, message: result.message };
      }
    } catch (error) {
      set({
        error: 'Failed to remove connection',
        isLoading: false,
      });
      return { success: false, message: 'Failed to remove connection' };
    }
  },

  // Search users
  searchUsers: async (query) => {
    set({ isLoading: true, error: null });

    try {
      const result = await usersService.searchUsers(query);

      if (result.success) {
        set({
          allUsers: result.users,
          isLoading: false,
        });
        return { success: true, users: result.users };
      } else {
        set({
          error: result.message,
          isLoading: false,
        });
        return { success: false, message: result.message };
      }
    } catch (error) {
      set({
        error: 'Failed to search users',
        isLoading: false,
      });
      return { success: false, message: 'Failed to search users' };
    }
  },

  // Delete user account
  deleteAccount: async () => {
    set({ isLoading: true, error: null });

    try {
      const result = await usersService.deleteAccount();

      if (result.success) {
        // Account deleted successfully - clear all user and auth state
        authService.logout();
        set({
          user: null,
          userConnections: [],
          allUsers: [],
          isLoading: false,
          error: null,
        });
        return { success: true, message: 'Account deleted successfully' };
      } else {
        set({
          error: result.message,
          isLoading: false,
        });
        return { success: false, message: result.message };
      }
    } catch (error) {
      set({
        error: 'Failed to delete account',
        isLoading: false,
      });
      return { success: false, message: 'Failed to delete account' };
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
      userConnections: [],
      allUsers: [],
      isLoading: false,
      error: null,
    });
  },

  // Getters
  getUser: () => get().user,
  getUserConnections: () => get().userConnections,
  getAllUsers: () => get().allUsers,
  getIsLoading: () => get().isLoading,
  getError: () => get().error,

  // Setters
  setUser: (user) => set({ user }),
  setUserConnections: (connections) => set({ userConnections: connections }),
  setAllUsers: (users) => set({ allUsers: users }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));

export default useUserStore;
