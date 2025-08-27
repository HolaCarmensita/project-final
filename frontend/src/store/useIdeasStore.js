import { create } from 'zustand';
import randomColor from 'randomcolor';
import ideasService from '../services/ideasService.js';

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

        set({
          ideas: ideasWithColors,
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
        set((state) => ({
          ideas: state.ideas.filter((idea) => idea._id !== id),
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
        error: 'Failed to delete idea',
        isLoading: false,
      });
      return { success: false, message: 'Failed to delete idea' };
    }
  },

  // Getters
  getIdeas: () => get().ideas,
  getIsLoading: () => get().isLoading,
  getError: () => get().error,
  getHasMore: () => get().hasMore,

  // Setters
  setIdeas: (ideas) => set({ ideas }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));

export default useIdeasStore;
