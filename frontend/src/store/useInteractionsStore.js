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
      console.log('LikeIdea: Calling API for idea:', id);
      const result = await ideasService.likeIdea(id);
      console.log('LikeIdea: API result:', result);

      if (result.success) {
        // Update the idea counter in ideas store
        const ideas = useIdeasStore.getState().ideas;
        const updatedIdeas = ideas.map((idea) =>
          idea._id === id
            ? { ...idea, likeCount: (idea.likeCount || 0) + 1 }
            : idea
        );
        console.log(
          'LikeIdea: Updating ideas store, new likeCount for idea',
          id,
          ':',
          updatedIdeas.find((idea) => idea._id === id)?.likeCount
        );
        useIdeasStore.getState().setIdeas(updatedIdeas);

        // Update the user's likedIdeas array in user store using backend response
        if (result.user) {
          console.log(
            'Updating user store with backend data:',
            result.user.likedIdeas
          );
          useUserStore.getState().setUser(result.user);
        } else {
          console.error('Backend did not return user data for like operation');
          set({ isLoading: false, error: 'Failed to update user data' });
          return { success: false, message: 'Failed to update user data' };
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

        // Update the user's likedIdeas array in user store using backend response
        if (result.user) {
          console.log(
            'Updating user store with backend data (unlike):',
            result.user.likedIdeas
          );
          useUserStore.getState().setUser(result.user);
        } else {
          console.error(
            'Backend did not return user data for unlike operation'
          );
          set({ isLoading: false, error: 'Failed to update user data' });
          return { success: false, message: 'Failed to update user data' };
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
  connectToIdea: async (id, message, socialLink) => {
    set({ isLoading: true, error: null });

    try {
      const result = await ideasService.connectToIdea(id, message, socialLink);

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

        // Update the user's connectedIdeas array in user store using backend response
        if (result.user) {
          console.log(
            'Updating user store with backend data (disconnect):',
            result.user.connectedIdeas
          );
          useUserStore.getState().setUser(result.user);
        } else {
          console.error(
            'Backend did not return user data for disconnect operation'
          );
          set({ isLoading: false, error: 'Failed to update user data' });
          return { success: false, message: 'Failed to update user data' };
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
