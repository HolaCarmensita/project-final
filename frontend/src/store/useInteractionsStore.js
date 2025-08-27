import { create } from 'zustand';
import ideasService from '../services/ideasService.js';
import { useUserStore } from './useUserStore.js';
import { useIdeasStore } from './useIdeasStore.js';

// Create the interactions store (user interactions only)
export const useInteractionsStore = create((set, get) => ({
  // State
  isLoading: false,
  error: null,

  // Like an idea
  likeIdea: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const result = await ideasService.likeIdea(id);

      if (result.success) {
        // Update the idea counter in ideas store
        const ideas = useIdeasStore.getState().ideas;
        const updatedIdeas = ideas.map((idea) =>
          idea._id === id
            ? { ...idea, likeCount: (idea.likeCount || 0) + 1 }
            : idea
        );
        useIdeasStore.getState().setIdeas(updatedIdeas);

        // Update the user's likedIdeas array in user store
        const currentUser = useUserStore.getState().getUser();
        if (currentUser) {
          useUserStore
            .getState()
            .updateLikedIdeas([...currentUser.likedIdeas, id]);
        }

        set({ isLoading: false, error: null });
        return { success: true };
      } else {
        set({ isLoading: false, error: result.message });
        return { success: false, message: result.message };
      }
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return { success: false, message: error.message };
    }
  },

  // Unlike an idea
  unlikeIdea: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const result = await ideasService.unlikeIdea(id);

      if (result.success) {
        // Update the idea counter in ideas store
        const ideas = useIdeasStore.getState().ideas;
        const updatedIdeas = ideas.map((idea) =>
          idea._id === id
            ? { ...idea, likeCount: Math.max(0, (idea.likeCount || 0) - 1) }
            : idea
        );
        useIdeasStore.getState().setIdeas(updatedIdeas);

        // Update the user's likedIdeas array in user store
        const currentUser = useUserStore.getState().getUser();
        if (currentUser) {
          useUserStore
            .getState()
            .updateLikedIdeas(
              currentUser.likedIdeas.filter((ideaId) => ideaId !== id)
            );
        }

        set({ isLoading: false, error: null });
        return { success: true };
      } else {
        set({ isLoading: false, error: result.message });
        return { success: false, message: result.message };
      }
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return { success: false, message: error.message };
    }
  },

  // Connect to an idea
  connectToIdea: async (id, message) => {
    set({ isLoading: true, error: null });

    try {
      const result = await ideasService.connectToIdea(id, message);

      if (result.success) {
        // Update the idea counter in ideas store
        const ideas = useIdeasStore.getState().ideas;
        const updatedIdeas = ideas.map((idea) =>
          idea._id === id
            ? { ...idea, connectionCount: (idea.connectionCount || 0) + 1 }
            : idea
        );
        useIdeasStore.getState().setIdeas(updatedIdeas);

        // Update the user's connectedIdeas array in user store
        const currentUser = useUserStore.getState().getUser();
        if (currentUser) {
          useUserStore
            .getState()
            .updateConnections([
              ...currentUser.connectedIdeas,
              { idea: id, message },
            ]);
        }

        set({ isLoading: false, error: null });
        return { success: true };
      } else {
        set({ isLoading: false, error: result.message });
        return { success: false, message: result.message };
      }
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return { success: false, message: error.message };
    }
  },

  // Disconnect from an idea
  disconnectFromIdea: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const result = await ideasService.disconnectFromIdea(id);

      if (result.success) {
        // Update the idea counter in ideas store
        const ideas = useIdeasStore.getState().ideas;
        const updatedIdeas = ideas.map((idea) =>
          idea._id === id
            ? {
                ...idea,
                connectionCount: Math.max(0, (idea.connectionCount || 0) - 1),
              }
            : idea
        );
        useIdeasStore.getState().setIdeas(updatedIdeas);

        // Update the user's connectedIdeas array in user store
        const currentUser = useUserStore.getState().getUser();
        if (currentUser) {
          useUserStore
            .getState()
            .updateConnections(
              currentUser.connectedIdeas.filter(
                (connection) => connection.idea !== id
              )
            );
        }

        set({ isLoading: false, error: null });
        return { success: true };
      } else {
        set({ isLoading: false, error: result.message });
        return { success: false, message: result.message };
      }
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return { success: false, message: error.message };
    }
  },

  // Getters
  getIsLoading: () => get().isLoading,
  getError: () => get().error,

  // Setters
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));

export default useInteractionsStore;
