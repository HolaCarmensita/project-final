import { useState, useEffect } from 'react';

// Custom hook to detect if joystick should be shown (touch/mobile/iPad)
export function useShowJoystick() {
  const [showJoystick, setShowJoystick] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      setShowJoystick(false);
      return;
    }
    const compute = () => {
      const ua = navigator.userAgent || navigator.vendor || window.opera || '';
      const hasTouch =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0;
      const isiPad =
        /iPad/.test(ua) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      const isIPhone = /iPhone|iPod/.test(ua);
      const isAndroid = /Android/.test(ua);
      const isMobile = isiPad || isIPhone || isAndroid;
      const sw = window.screen?.width || 0;
      const sh = window.screen?.height || 0;
      const vw = window.innerWidth || 0;
      const vh = window.innerHeight || 0;
      const approxEq = (a, b) => Math.abs(a - b) <= 2;
      const isIpadProByScreen =
        (approxEq(sw, 1024) && approxEq(sh, 1366)) ||
        (approxEq(sw, 1366) && approxEq(sh, 1024));
      const isIpadProByViewport =
        (approxEq(vw, 1024) && approxEq(vh, 1366)) ||
        (approxEq(vw, 1366) && approxEq(vh, 1024));
      const isIpadAirByScreen =
        (approxEq(sw, 820) && approxEq(sh, 1180)) ||
        (approxEq(sw, 1180) && approxEq(sh, 820));
      const isIpadAirByViewport =
        (approxEq(vw, 820) && approxEq(vh, 1180)) ||
        (approxEq(vw, 1180) && approxEq(vh, 820));

      if (isiPad) {
        setShowJoystick(true);
        return;
      }
      if (
        hasTouch &&
        (isIpadProByScreen ||
          isIpadProByViewport ||
          isIpadAirByScreen ||
          isIpadAirByViewport)
      ) {
        setShowJoystick(true);
        return;
      }
      setShowJoystick(Boolean(hasTouch && isMobile));
    };

    compute();
    const handler = () => compute();
    window.addEventListener('resize', handler);
    window.addEventListener('orientationchange', handler);
    return () => {
      window.removeEventListener('resize', handler);
      window.removeEventListener('orientationchange', handler);
    };
  }, []);

  return showJoystick;
}
