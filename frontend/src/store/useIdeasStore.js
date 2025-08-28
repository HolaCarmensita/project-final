import { create } from 'zustand';
import randomColor from 'randomcolor';
import ideasService from '../services/ideasService.js';

// Deterministic color generator based on a stable idea identifier
// This guarantees the same colors across reloads, deployments, and devices
const getColorPairForId = (stableId = '') => {
  // 32-bit FNV-1a hash
  let hash = 0x811c9dc5;
  for (let i = 0; i < stableId.length; i += 1) {
    hash ^= stableId.charCodeAt(i);
    hash = (hash >>> 0) * 0x01000193;
  }

  const base = hash >>> 0;
  // Golden-angle distribution to maximize separation between hues
  // 137.508° is the golden angle in degrees
  const hueIndex = base % 100000; // large cycle
  const orbHue = (hueIndex * 137.508) % 360;

  // Derive saturation/lightness from hash to avoid overly similar tones
  const satSeed = ((base >> 8) & 0xff) / 255; // 0..1
  const lightSeed = ((base >> 16) & 0xff) / 255; // 0..1
  const saturation = Math.round(60 + satSeed * 25); // 60%..85%
  const lightness = Math.round(45 + lightSeed * 15); // 45%..60%

  const auraHue = (orbHue + 180) % 360; // complementary for contrast
  const auraSaturation = Math.min(90, saturation + 10);
  const auraLightness = Math.min(85, lightness + 25);

  const orbColor = `hsl(${orbHue}, ${saturation}%, ${lightness}%)`;
  const auraColor = `hsl(${auraHue}, ${auraSaturation}%, ${auraLightness}%)`;
  return { orbColor, auraColor };
};

export const useIdeasStore = create((set, get) => ({
  // State - ensure ideas is always an array
  ideas: [],
  isLoading: false,
  error: null,
  hasMore: true,

  // Actions
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
        // Ensure ideas is always an array
        const ideasArray = result.ideas || [];

        // Add deterministic colors per idea using a stable id
        const ideasWithColors = ideasArray.map((idea) => {
          const stableId = idea._id || idea.id || String(idea.createdAt || '');
          const { orbColor, auraColor } = getColorPairForId(stableId);
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
          ideas: [], // Ensure ideas is always an array
          error: result.message || 'Failed to fetch ideas',
          isLoading: false,
          hasMore: false,
        });
      }
    } catch (error) {
      // API error - set error state
      set({
        ideas: [], // Ensure ideas is always an array
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
        const stableId = result.idea?._id || result.idea?.id || '';
        const { orbColor, auraColor } = getColorPairForId(stableId);
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
