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

  // Idea navigation (accesses ideas store for data)
  handleLeft: (callback) => {
    const ideas = useIdeasStore.getState().getIdeas();
    const currentIndex = get().selectedIndex;
    const newIndex = (currentIndex - 1 + ideas.length) % ideas.length;

    set({ selectedIndex: newIndex });
    if (typeof callback === 'function') callback(newIndex);
  },

  handleRight: (callback) => {
    const ideas = useIdeasStore.getState().getIdeas();
    const currentIndex = get().selectedIndex;
    const newIndex = (currentIndex + 1) % ideas.length;

    set({ selectedIndex: newIndex });
    if (typeof callback === 'function') callback(newIndex);
  },

  // Getters
  getIsAddOpen: () => get().isAddOpen,
  getIsConnectOpen: () => get().isConnectOpen,
  getConnectTarget: () => get().connectTarget,
  getCurrentPage: () => get().currentPage,
  getSelectedIndex: () => get().selectedIndex,
}));

export default useUIStore;
