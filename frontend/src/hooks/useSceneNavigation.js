import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUIStore } from '../store/useUIStore';
import { useIdeasStore } from '../store/useIdeasStore';

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
  const navigateLeft = useUIStore((state) => state.navigateLeft);
  const navigateRight = useUIStore((state) => state.navigateRight);
  const navigateLeftSimple = useUIStore((state) => state.navigateLeftSimple);
  const navigateRightSimple = useUIStore((state) => state.navigateRightSimple);

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
          // On ideas route, use complete navigation (camera + page change)
          navigateLeft(navigate, ideas);
        } else {
          // On other routes, use simple navigation (just selection change)
          navigateLeftSimple();
        }
      } else if (e.key === 'ArrowRight') {
        if (isIdeasRoute) {
          // On ideas route, use complete navigation (camera + page change)
          navigateRight(navigate, ideas);
        } else {
          // On other routes, use simple navigation (just selection change)
          navigateRightSimple();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    isIdeasRoute,
    navigateLeft,
    navigateRight,
    navigateLeftSimple,
    navigateRightSimple,
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
