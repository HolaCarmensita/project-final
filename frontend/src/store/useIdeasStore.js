import { create } from 'zustand';
import randomColor from 'randomcolor';
import ideasService from '../services/ideasService.js';
import { useAuthStore } from './useAuthStore.js';

// Keep the color generation function - it's essential for your app's design
const getUniqueColorPair = (() => {
  const usedColors = new Set();
  return () => {
    let orbColor, auraColor, combo;
    do {
      orbColor = randomColor({ luminosity: 'bright' });
      const orbH =
        Number(orbColor.match(/\d+/)?.[0]) || Math.floor(Math.random() * 360);
      const compH = (orbH + 180) % 360;
      auraColor = randomColor({ hue: compH, luminosity: 'light' });
      combo = orbColor + '-' + auraColor;
    } while (usedColors.has(combo));
    usedColors.add(combo);
    return { orbColor, auraColor };
  };
})();

export const useIdeasStore = create((set, get) => ({
  // State
  ideas: [],
  likedIds: [],
  connectedIds: [],
  isLoading: false,
  error: null,
  hasMore: true,

  // Actions
  // Get all ideas from API
  fetchIdeas: async () => {
    // Prevent multiple simultaneous fetches
    if (get().isLoading) {
      console.log('IdeasStore: Already loading ideas, skipping...');
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const result = await ideasService.getAllIdeas();

      if (result.success) {
        // Add colors to ideas (your app's design requirement)
        const ideasWithColors = result.ideas.map((idea) => {
          const { orbColor, auraColor } = getUniqueColorPair();
          return { ...idea, orbColor, auraColor };
        });

        // Get current user from auth store to determine liked/connected status
        const currentUser = useAuthStore.getState().user;

        // Initialize likedIds and connectedIds based on current user's interactions
        const likedIds = [];
        const connectedIds = [];

        if (currentUser) {
          ideasWithColors.forEach((idea) => {
            // Check if current user has liked this idea
            const isLiked = idea.likedBy?.some(
              (user) => user._id === currentUser._id
            );
            if (isLiked) {
              likedIds.push(idea._id);
            }

            // Check if current user has connected to this idea
            const isConnected = idea.connectedBy?.some(
              (connection) => connection.user._id === currentUser._id
            );
            if (isConnected) {
              connectedIds.push(idea._id);
            }
          });
        }

        set({
          ideas: ideasWithColors,
          likedIds,
          connectedIds,
          isLoading: false,
          hasMore: ideasWithColors.length > 0,
        });
      } else {
        // API failed - set error state
        set({
          error: result.message || 'Failed to fetch ideas',
          isLoading: false,
          hasMore: false,
        });
      }
    } catch (error) {
      // API error - set error state
      set({
        error: 'Failed to fetch ideas',
        isLoading: false,
        hasMore: false,
      });
    }
  },

  // Create new idea
  createIdea: async (ideaData) => {
    set({ isLoading: true, error: null });

    try {
      const result = await ideasService.createIdea(ideaData);

      if (result.success) {
        const { orbColor, auraColor } = getUniqueColorPair();
        const newIdea = { ...result.idea, orbColor, auraColor };

        set((state) => ({
          ideas: [newIdea, ...state.ideas],
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
        error: 'Failed to create idea',
        isLoading: false,
      });
      return { success: false, message: 'Failed to create idea' };
    }
  },

  // Update idea
  updateIdea: async (id, ideaData) => {
    set({ isLoading: true, error: null });

    try {
      const result = await ideasService.updateIdea(id, ideaData);

      if (result.success) {
        set((state) => ({
          ideas: state.ideas.map((idea) =>
            idea._id === id ? { ...idea, ...result.idea } : idea
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
        error: 'Failed to update idea',
        isLoading: false,
      });
      return { success: false, message: 'Failed to update idea' };
    }
  },

  // Delete idea
  deleteIdea: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const result = await ideasService.deleteIdea(id);

      if (result.success) {
        set((state) => {
          const nextIdeas = state.ideas.filter((idea) => idea._id !== id);
          const nextLiked = state.likedIds.filter((likedId) => likedId !== id);
          const nextConnected = state.connectedIds.filter(
            (connectedId) => connectedId !== id
          );

          return {
            ideas: nextIdeas,
            likedIds: nextLiked,
            connectedIds: nextConnected,
            isLoading: false,
          };
        });

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
        error: 'Failed to delete idea',
        isLoading: false,
      });
      return { success: false, message: 'Failed to delete idea' };
    }
  },

  // Like idea
  likeIdea: async (id) => {
    try {
      const result = await ideasService.likeIdea(id);
      console.log('likeIdea - API result:', result);

      if (result.success) {
        set((state) => {
          console.log('likeIdea - updating store with:', result.idea);
          return {
            ideas: state.ideas.map((idea) =>
              idea._id === id ? { ...idea, ...result.idea } : idea
            ),
            likedIds: [...state.likedIds, id],
          };
        });

        return { success: true };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      return { success: false, message: 'Failed to like idea' };
    }
  },

  // Unlike idea
  unlikeIdea: async (id) => {
    try {
      const result = await ideasService.unlikeIdea(id);

      if (result.success) {
        set((state) => ({
          ideas: state.ideas.map((idea) =>
            idea._id === id ? { ...idea, ...result.idea } : idea
          ),
          likedIds: state.likedIds.filter((likedId) => likedId !== id),
        }));

        return { success: true };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      return { success: false, message: 'Failed to unlike idea' };
    }
  },

  // Connect to idea
  connectToIdea: async (id, message) => {
    try {
      const result = await ideasService.connectToIdea(id, message);

      if (result.success) {
        set((state) => ({
          ideas: state.ideas.map((idea) =>
            idea._id === id ? { ...idea, ...result.idea } : idea
          ),
          connectedIds: [...state.connectedIds, id],
        }));

        return { success: true };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      return { success: false, message: 'Failed to connect to idea' };
    }
  },

  // Disconnect from idea
  disconnectFromIdea: async (id) => {
    try {
      const result = await ideasService.disconnectFromIdea(id);

      if (result.success) {
        set((state) => ({
          ideas: state.ideas.map((idea) =>
            idea._id === id ? { ...idea, ...result.idea } : idea
          ),
          connectedIds: state.connectedIds.filter(
            (connectedId) => connectedId !== id
          ),
        }));

        return { success: true };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      return { success: false, message: 'Failed to disconnect from idea' };
    }
  },

  // Getters
  getIdeas: () => get().ideas,
  getLikedIds: () => get().likedIds,
  getConnectedIds: () => get().connectedIds,
  getIsLoading: () => get().isLoading,
  getError: () => get().error,
  getHasMore: () => get().hasMore,

  // Setters
  setIdeas: (ideas) => set({ ideas }),
  setLikedIds: (likedIds) => set({ likedIds }),
  setConnectedIds: (connectedIds) => set({ connectedIds }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));

export default useIdeasStore;
