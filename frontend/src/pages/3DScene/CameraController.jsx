// Import hooks and helpers from React and React Three Fiber
import { useThree, useFrame } from '@react-three/fiber'; // useThree gives access to camera, scene, controls; useFrame runs each render frame
import { useRef, useEffect } from 'react'; // React hooks for references and lifecycle
import { useLocation } from 'react-router-dom'; // Used to detect current URL path (to change behavior per route)

// ------------------------------------------------------
// Helper: detect if user is typing in an input/textarea
// ------------------------------------------------------
const isTypingIntoField = () => {
  if (typeof document === 'undefined') return false; // If we're server-side, skip
  const el = document.activeElement; // Find the currently focused element
  if (!el) return false;
  const tag = el.tagName;
  return (
    tag === 'INPUT' || // Standard input field
    tag === 'TEXTAREA' || // Multi-line input
    el.isContentEditable === true || // Contenteditable divs
    (typeof el.getAttribute === 'function' &&
      el.getAttribute('role') === 'textbox') // ARIA role textbox (for accessibility)
  );
};

// ------------------------------------------------------
// Constants
// ------------------------------------------------------
const MOVE_SPEED = 0.5; // Base movement speed per frame
const JOYSTICK_SCALE = 0.6; // How much joystick movement affects speed

// Key-to-action mapping
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

// ------------------------------------------------------
// Main Component
// ------------------------------------------------------
export default function CameraController({ joystickVecRef }) {
  const { camera, controls } = useThree(); // Access Three.js camera + orbit controls
  const pressed = useRef({}); // Keeps track of which movement keys are currently pressed
  const location = useLocation(); // Current route (path)

  // Check if we are on the "/ideas" route
  const isIdeasRoute = location.pathname.startsWith('/ideas');

  // ------------------------------------------------------
  // Keyboard Input Handling
  // ------------------------------------------------------
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isTypingIntoField()) return; // Ignore if typing into a form field

      // On /ideas route, block left/right arrows (to avoid interfering with UI navigation)
      if (isIdeasRoute && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        return;
      }

      // If the pressed key is mapped, mark it as active
      if (keyMap[e.key]) pressed.current[keyMap[e.key]] = true;
    };

    const handleKeyUp = (e) => {
      if (isTypingIntoField()) return; // Ignore key release if typing

      // Block left/right arrows specifically on ideas route
      if (isIdeasRoute && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        return;
      }

      // Mark key as released
      if (keyMap[e.key]) pressed.current[keyMap[e.key]] = false;
    };

    const handleFocusIn = () => {
      // If the user clicks into a text field, reset movement keys to avoid "stuck" input
      if (isTypingIntoField()) pressed.current = {};
    };

    // Attach event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('focusin', handleFocusIn);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('focusin', handleFocusIn);
    };
  }, [isIdeasRoute]);

  // ------------------------------------------------------
  // Frame Update (called every render frame by R3F)
  // ------------------------------------------------------
  useFrame(() => {
    let moveX = 0, // left/right
      moveZ = 0; // forward/backward

    // Apply keyboard-based movement
    if (pressed.current.forward) moveZ += MOVE_SPEED;
    if (pressed.current.backward) moveZ -= MOVE_SPEED;
    if (pressed.current.left) moveX -= MOVE_SPEED;
    if (pressed.current.right) moveX += MOVE_SPEED;

    // Apply joystick-based movement (if provided)
    if (joystickVecRef && joystickVecRef.current) {
      const { x = 0, y = 0, force = 0 } = joystickVecRef.current || {};
      moveX += x * JOYSTICK_SCALE * MOVE_SPEED * (force || 1); // Scale joystick input
      moveZ += y * JOYSTICK_SCALE * MOVE_SPEED * (force || 1);
    }

    // If there's any movement, update camera + controls target
    if ((moveX !== 0 || moveZ !== 0) && controls) {
      // Direction the camera is looking (forward vector)
      const dir = controls.target.clone().sub(camera.position).normalize();
      // Right vector (perpendicular to direction and up vector)
      const right = dir.clone().cross(camera.up).normalize();

      // Move the camera
      camera.position.add(dir.clone().multiplyScalar(moveZ)); // Forward/back
      camera.position.add(right.clone().multiplyScalar(moveX)); // Left/right

      // Also move the orbit controls target (so camera rotates around the right spot)
      controls.target.add(dir.clone().multiplyScalar(moveZ));
      controls.target.add(right.clone().multiplyScalar(moveX));

      // Tell controls to update its internal state
      controls.update();
    }
  });

  // Nothing to render, this component only manipulates the camera
  return null;
}
