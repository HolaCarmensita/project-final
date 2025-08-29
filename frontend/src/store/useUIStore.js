import { create } from 'zustand';
import { useIdeasStore } from './useIdeasStore.js';

// Create the UI store
export const useUIStore = create((set, get) => ({
  // Modal states
  isAddOpen: false,
  isConnectOpen: false,

  // Connection modal state
  connectTarget: null, // { ideaId, userId, userName }

  // Navigation state
  currentPage: 'home',
  selectedIndex: 0,

  // Actions
  // Add idea modal
  setIsAddOpen: (isOpen) => set({ isAddOpen: isOpen }),
  openAddModal: () => set({ isAddOpen: true }),
  closeAddModal: () => set({ isAddOpen: false }),

  // Connect modal
  setIsConnectOpen: (isOpen) => set({ isConnectOpen: isOpen }),
  openConnectModal: ({ ideaId, userId, userName, ideaTitle }) =>
    set({
      isConnectOpen: true,
      connectTarget: { ideaId, userId, userName, ideaTitle },
    }),
  closeConnectModal: () =>
    set({
      isConnectOpen: false,
      connectTarget: null,
    }),

  // Navigation
  setCurrentPage: (page) => set({ currentPage: page }),
  setSelectedIndex: (idx, callback) => {
    set({ selectedIndex: idx });
    if (typeof callback === 'function') callback(idx);
  },

  // Complete navigation with side effects
  navigateLeft: (navigate, ideas) => {
    const currentIndex = get().selectedIndex;
    const newIndex = (currentIndex - 1 + ideas.length) % ideas.length;

    set({ selectedIndex: newIndex });

    // Side effects
    window.dispatchEvent(
      new CustomEvent('moveCameraToIndex', { detail: newIndex })
    );

    if (ideas.length > 0 && ideas[newIndex]) {
      const idea = ideas[newIndex];
      navigate(idea._id ? `/ideas/${idea._id}` : '/ideas');
    }
  },

  navigateRight: (navigate, ideas) => {
    const currentIndex = get().selectedIndex;
    const newIndex = (currentIndex + 1) % ideas.length;

    set({ selectedIndex: newIndex });

    // Side effects
    window.dispatchEvent(
      new CustomEvent('moveCameraToIndex', { detail: newIndex })
    );

    if (ideas.length > 0 && ideas[newIndex]) {
      const idea = ideas[newIndex];
      navigate(idea._id ? `/ideas/${idea._id}` : '/ideas');
    }
  },

  // Simple navigation without side effects (for non-ideas routes)
  navigateLeftSimple: () => {
    const ideas = useIdeasStore.getState().getIdeas();
    const currentIndex = get().selectedIndex;
    const newIndex = (currentIndex - 1 + ideas.length) % ideas.length;
    set({ selectedIndex: newIndex });
  },

  navigateRightSimple: () => {
    const ideas = useIdeasStore.getState().getIdeas();
    const currentIndex = get().selectedIndex;
    const newIndex = (currentIndex + 1) % ideas.length;
    set({ selectedIndex: newIndex });
  },

  // Getters
  getIsAddOpen: () => get().isAddOpen,
  getIsConnectOpen: () => get().isConnectOpen,
  getConnectTarget: () => get().connectTarget,
  getCurrentPage: () => get().currentPage,
  getSelectedIndex: () => get().selectedIndex,
}));

export default useUIStore;
