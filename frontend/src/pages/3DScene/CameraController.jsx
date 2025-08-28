import { useThree, useFrame } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Helper to detect when user is typing in an input/textarea/contentEditable field
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

const MOVE_SPEED = 0.5;
const JOYSTICK_SCALE = 0.6;

const keyMap = {
  ArrowUp: 'forward',
  ArrowDown: 'backward',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'forward',
  s: 'backward',
  a: 'left',
  d: 'right',
};

export default function CameraController({ joystickVecRef }) {
  const { camera, controls } = useThree();
  const pressed = useRef({});
  const location = useLocation();

  // Check if we're on the ideas route
  const isIdeasRoute = location.pathname.startsWith('/ideas');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isTypingIntoField()) return; // ignore movement keys while typing

      // On ideas route, disable left/right arrow keys for camera movement
      if (isIdeasRoute && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        return; // Don't handle left/right arrows on ideas route
      }

      if (keyMap[e.key]) pressed.current[keyMap[e.key]] = true;
    };
    const handleKeyUp = (e) => {
      if (isTypingIntoField()) return; // ignore key state updates while typing

      // On ideas route, disable left/right arrow keys for camera movement
      if (isIdeasRoute && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        return; // Don't handle left/right arrows on ideas route
      }

      if (keyMap[e.key]) pressed.current[keyMap[e.key]] = false;
    };
    const handleFocusIn = () => {
      // Clear any stuck keys when focusing into an input field
      if (isTypingIntoField()) pressed.current = {};
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('focusin', handleFocusIn);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('focusin', handleFocusIn);
    };
  }, [isIdeasRoute]);

  useFrame(() => {
    let moveX = 0,
      moveZ = 0;

    if (pressed.current.forward) moveZ += MOVE_SPEED;
    if (pressed.current.backward) moveZ -= MOVE_SPEED;
    if (pressed.current.left) moveX -= MOVE_SPEED;
    if (pressed.current.right) moveX += MOVE_SPEED;

    if (joystickVecRef && joystickVecRef.current) {
      const { x = 0, y = 0, force = 0 } = joystickVecRef.current || {};
      moveX += x * JOYSTICK_SCALE * MOVE_SPEED * (force || 1);
      moveZ += y * JOYSTICK_SCALE * MOVE_SPEED * (force || 1);
    }

    if ((moveX !== 0 || moveZ !== 0) && controls) {
      const dir = controls.target.clone().sub(camera.position).normalize();
      const right = dir.clone().cross(camera.up).normalize();

      camera.position.add(dir.clone().multiplyScalar(moveZ));
      camera.position.add(right.clone().multiplyScalar(moveX));
      controls.target.add(dir.clone().multiplyScalar(moveZ));
      controls.target.add(right.clone().multiplyScalar(moveX));
      controls.update();
    }
  });

  return null;
}
