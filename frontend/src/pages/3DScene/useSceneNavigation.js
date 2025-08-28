import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUIStore } from '../../store/useUIStore';
import { useIdeasStore } from '../../store/useIdeasStore';

// Custom hook for keyboard and camera navigation
export function useSceneNavigation({
  ideas,
  selectedIndex,
  setSelectedIndex,
  handleOrbClick,
  sphereRadius,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  // Get navigation handlers from UI store
  const handleLeftStore = useUIStore((state) => state.handleLeft);
  const handleRightStore = useUIStore((state) => state.handleRight);

  // Check if we're on the ideas route
  const isIdeasRoute = location.pathname.startsWith('/ideas');

  // Keyboard navigation for left/right arrows
  useEffect(() => {
    const isTypingIntoField = () => {
      if (typeof document === 'undefined') return false;
      const el = document.activeElement;
      if (!el) return false;
      const tag = el.tagName;
      return (
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        el.isContentEditable === true ||
        (typeof el.getAttribute === 'function' &&
          el.getAttribute('role') === 'textbox')
      );
    };

    const handleKeyDown = (e) => {
      if (isTypingIntoField()) return;

      if (e.key === 'ArrowLeft') {
        if (isIdeasRoute) {
          // On ideas route, use the same navigation as NavBar
          handleLeftStore((idx) => {
            window.dispatchEvent(
              new CustomEvent('moveCameraToIndex', { detail: idx })
            );
            if (ideas.length > 0 && ideas[idx]) {
              const idea = ideas[idx];
              navigate(idea._id ? `/ideas/${idea._id}` : '/ideas');
            }
          });
        } else {
          // On other routes, use the original behavior
          let newIndex = (selectedIndex - 1 + ideas.length) % ideas.length;
          setSelectedIndex(newIndex);
        }
      } else if (e.key === 'ArrowRight') {
        if (isIdeasRoute) {
          // On ideas route, use the same navigation as NavBar
          handleRightStore((idx) => {
            window.dispatchEvent(
              new CustomEvent('moveCameraToIndex', { detail: idx })
            );
            if (ideas.length > 0 && ideas[idx]) {
              const idea = ideas[idx];
              navigate(idea._id ? `/ideas/${idea._id}` : '/ideas');
            }
          });
        } else {
          // On other routes, use the original behavior
          let newIndex = (selectedIndex + 1) % ideas.length;
          setSelectedIndex(newIndex);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    selectedIndex,
    ideas.length,
    setSelectedIndex,
    isIdeasRoute,
    handleLeftStore,
    handleRightStore,
    navigate,
    ideas,
  ]);

  // Listen for camera move events from NavBar
  useEffect(() => {
    const handler = (e) => {
      const idx = e.detail;
      if (ideas.length > 0 && typeof idx === 'number') {
        const offset = 2 / ideas.length;
        const increment = Math.PI * (3 - Math.sqrt(5));
        const y = idx * offset - 1 + offset / 2;
        const r = Math.sqrt(1 - y * y);
        const phi = idx * increment;
        const x = Math.cos(phi) * r;
        const z = Math.sin(phi) * r;
        handleOrbClick([x * sphereRadius, y * sphereRadius, z * sphereRadius]);
      }
    };
    window.addEventListener('moveCameraToIndex', handler);
    return () => window.removeEventListener('moveCameraToIndex', handler);
  }, [ideas.length, handleOrbClick, sphereRadius]);
}
