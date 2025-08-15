import { create } from 'zustand';
import randomColor from 'randomcolor';

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
  ideas: [],
  isAddOpen: false,
  addIdea: (idea) => {
    const { orbColor, auraColor } = getUniqueColorPair();
    set((state) => ({
      ideas: [...state.ideas, { ...idea, orbColor, auraColor }]
    }));
  },
  setIsAddOpen: (isOpen) => set({ isAddOpen: isOpen }),
}));
