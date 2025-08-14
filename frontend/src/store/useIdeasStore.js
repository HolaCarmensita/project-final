import { create } from 'zustand';

export const useIdeasStore = create((set) => ({
  ideas: [],
  isAddOpen: false,
  addIdea: (idea) => set((state) => ({ ideas: [...state.ideas, idea] })),
  setIsAddOpen: (isOpen) => set({ isAddOpen: isOpen }),
}));
