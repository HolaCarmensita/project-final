import { create } from 'zustand';
import randomColor from 'randomcolor';
import { mockIdeas, users } from '../data/mockData';

const getUniqueColorPair = (() => {
  const usedColors = new Set();
  return () => {
    let orbColor, auraColor, combo;
    do {
      orbColor = randomColor({ luminosity: "bright" });
      const orbH = Number(orbColor.match(/\d+/)?.[0]) || Math.floor(Math.random() * 360);
      const compH = (orbH + 180) % 360;
      auraColor = randomColor({ hue: compH, luminosity: "light" });
      combo = orbColor + "-" + auraColor;
    } while (usedColors.has(combo));
    usedColors.add(combo);
    return { orbColor, auraColor };
  };
})();

export const useIdeasStore = create((set) => ({
  ideas: mockIdeas.map(idea => {
    const orbColor = randomColor({ luminosity: "bright" });
    const orbH = Number(orbColor.match(/\d+/)?.[0]) || Math.floor(Math.random() * 360);
    const compH = (orbH + 180) % 360;
    const auraColor = randomColor({ hue: compH, luminosity: "light" });
    // Attach authorId by matching mock users by name when missing
    const matchedUser = users?.find?.((u) => u.name === idea.author);
    const authorId = idea.authorId || matchedUser?.id;
    return { ...idea, authorId, orbColor, auraColor };
  }),
  // Track liked ideas by id
  likedIds: mockIdeas.slice(1, 4).map((i) => i.id),
  selectedIndex: 0,
  isAddOpen: false,
  addIdea: (idea) => {
    const { orbColor, auraColor } = getUniqueColorPair();
    set((state) => ({
      ideas: [...state.ideas, { ...idea, orbColor, auraColor }]
    }));
  },
  setIsAddOpen: (isOpen) => set({ isAddOpen: isOpen }),
  setSelectedIndex: (idx, callback) => {
    set({ selectedIndex: idx });
    if (typeof callback === 'function') callback(idx);
  },
  submitIdea: (ideaData) => {
    const { orbColor, auraColor } = getUniqueColorPair();
    set((state) => ({
      ideas: [
        ...state.ideas,
        {
          ...ideaData,
          id: Date.now(),
          author: "You",
          role: "Creator",
          likes: 0,
          connections: 0,
          orbColor,
          auraColor,
        },
      ],
    }));
  },
  openAddModal: () => set({ isAddOpen: true }),
  likeIdea: (id) => set((state) => {
    if (state.likedIds.includes(id)) return {};
    const updatedIdeas = state.ideas.map((i) =>
      i.id === id ? { ...i, likes: Math.max(0, (i.likes || 0) + 1) } : i
    );
    return { likedIds: [...state.likedIds, id], ideas: updatedIdeas };
  }),
  unlikeIdea: (id) => set((state) => {
    if (!state.likedIds.includes(id)) return {};
    const updatedIdeas = state.ideas.map((i) =>
      i.id === id ? { ...i, likes: Math.max(0, (i.likes || 0) - 1) } : i
    );
    return { likedIds: state.likedIds.filter((x) => x !== id), ideas: updatedIdeas };
  }),
  deleteIdea: (id) => set((state) => {
    const nextIdeas = state.ideas.filter((i) => i.id !== id);
    let nextIndex = state.selectedIndex;
    if (nextIndex >= nextIdeas.length) nextIndex = Math.max(0, nextIdeas.length - 1);
    const nextLiked = state.likedIds.filter((x) => x !== id);
    return { ideas: nextIdeas, likedIds: nextLiked, selectedIndex: nextIndex };
  }),
  handleLeft: (callback) => set((state) => {
    const newIndex = (state.selectedIndex - 1 + state.ideas.length) % state.ideas.length;
    if (typeof callback === 'function') callback(newIndex);
    return { selectedIndex: newIndex };
  }),
  handleRight: (callback) => set((state) => {
    const newIndex = (state.selectedIndex + 1) % state.ideas.length;
    if (typeof callback === 'function') callback(newIndex);
    return { selectedIndex: newIndex };
  }),
}));
