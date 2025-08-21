import { create } from 'zustand';

// Create the UI store
export const useUIStore = create((set, get) => ({
  // Modal states
  isAddOpen: false,
  isConnectOpen: false,

  // Connection modal state
  connectTarget: null, // { ideaId, userId, userName }

  // Navigation state
  currentPage: 'home',

  // Actions
  // Add idea modal
  setIsAddOpen: (isOpen) => set({ isAddOpen: isOpen }),
  openAddModal: () => set({ isAddOpen: true }),
  closeAddModal: () => set({ isAddOpen: false }),

  // Connect modal
  setIsConnectOpen: (isOpen) => set({ isConnectOpen: isOpen }),
  openConnectModal: ({ ideaId, userId, userName }) =>
    set({
      isConnectOpen: true,
      connectTarget: { ideaId, userId, userName },
    }),
  closeConnectModal: () =>
    set({
      isConnectOpen: false,
      connectTarget: null,
    }),

  // Navigation
  setCurrentPage: (page) => set({ currentPage: page }),

  // Getters
  getIsAddOpen: () => get().isAddOpen,
  getIsConnectOpen: () => get().isConnectOpen,
  getConnectTarget: () => get().connectTarget,
  getCurrentPage: () => get().currentPage,
}));

export default useUIStore;
