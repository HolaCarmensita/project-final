import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber'; // React wrapper for Three.js WebGL rendering
import { OrbitControls, Sparkles } from '@react-three/drei'; // Prebuilt helpers (camera controls, sparkles)
import { useNavigate } from 'react-router-dom'; // Navigation between app pages
import { useIdeasStore } from '../../store/useIdeasStore'; // Global state: stores ideas
import { useUIStore } from '../../store/useUIStore'; // Global state: stores selected index
import { gsap } from 'gsap'; // Animation library for smooth camera transitions
import IdeaOrb from './IdeaOrb'; // Custom component: one "orb" representing an idea
import CameraController from './CameraController'; // Custom component: moves camera based on joystick/keyboard
import Joystick from '../../components/Joystick'; // On-screen joystick for mobile controls
import { getSpherePosition } from './sphereLayout'; // Function to calculate positions on a sphere
import { useShowJoystick } from './useShowJoystick'; // Hook to decide if joystick should be shown
import { useSceneNavigation } from './useSceneNavigation'; // Hook for keyboard navigation between orbs

// Helper function: detect if user is currently typing in an input field
// (prevents navigation or camera moves when typing)
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

const Scene = () => {
  // Global state: get all ideas
  const ideas = useIdeasStore((state) => state.ideas);
  // Global state: track which idea orb is currently selected
  const selectedIndex = useUIStore((state) => state.selectedIndex);
  const setSelectedIndex = useUIStore((state) => state.setSelectedIndex);

  const navigate = useNavigate(); // For routing
  const controlsRef = useRef(); // Ref for OrbitControls (so we can animate camera)

  // Handles clicking on an orb -> moves camera smoothly towards it
  const handleOrbClick = (position) => {
    if (controlsRef.current) {
      const controls = controlsRef.current;

      // Where the camera should point (target = orb position)
      const target = { x: position[0], y: position[1], z: position[2] };
      // Camera position slightly offset in Z so it doesn't overlap the orb
      const camOffset = { x: position[0], y: position[1], z: position[2] + 8 };

      // Check if camera is already at this position
      const pos = controls.object.position;
      const tgt = controls.target;
      const needsMove =
        pos.x !== camOffset.x ||
        pos.y !== camOffset.y ||
        pos.z !== camOffset.z ||
        tgt.x !== target.x ||
        tgt.y !== target.y ||
        tgt.z !== target.z;
      if (!needsMove) return;

      // Kill any previous animations to avoid overlapping
      gsap.killTweensOf([controls.object.position, controls.target]);

      // Animate the camera to new position
      gsap.to(controls.object.position, {
        x: camOffset.x,
        y: camOffset.y,
        z: camOffset.z,
        duration: 1.2,
        onUpdate: () => controls.update(), // Refresh OrbitControls
      });

      // Animate OrbitControls target to look at the orb
      gsap.to(controls.target, {
        x: target.x,
        y: target.y,
        z: target.z,
        duration: 1.2,
        onUpdate: () => controls.update(),
      });
    }
  };

  const sphereRadius = 20; // Radius of sphere layout where orbs are placed

  // Hook for navigation (keyboard + camera movement)
  useSceneNavigation({
    ideas,
    selectedIndex,
    setSelectedIndex,
    handleOrbClick,
    sphereRadius,
  });

  // Ref to keep joystick vector values (x, y, force)
  const joystickVecRef = useRef({ x: 0, y: 0, force: 0 });

  // Handle joystick movements
  const handleJoystickMove = (data) => {
    if (!data || !data.vector) {
      joystickVecRef.current = { x: 0, y: 0, force: 0 };
      return;
    }
    const { x, y } = data.vector;
    const force = data.force || 0;
    joystickVecRef.current = { x, y, force };
  };

  // Decide if joystick should be shown (likely on mobile only)
  const showJoystick = useShowJoystick();

  // Function: zoom camera to the next orb left/right
  const zoomToNeighbor = (direction) => {
    let newIndex = selectedIndex;
    if (direction === 'left')
      newIndex = (selectedIndex - 1 + ideas.length) % ideas.length;
    if (direction === 'right') newIndex = (selectedIndex + 1) % ideas.length;
    setSelectedIndex(newIndex);

    // Calculate orb position on sphere (Fibonacci sphere algorithm)
    const offset = 2 / ideas.length;
    const increment = Math.PI * (3 - Math.sqrt(5));
    const y = newIndex * offset - 1 + offset / 2;
    const r = Math.sqrt(1 - y * y);
    const phi = newIndex * increment;
    const x = Math.cos(phi) * r;
    const z = Math.sin(phi) * r;

    // Move camera to the new orb
    handleOrbClick([x * sphereRadius, y * sphereRadius, z * sphereRadius]);
  };

  // How many orbs to render
  const orbCount = ideas.length;

  // Map ideas into IdeaOrb components positioned on sphere
  const orbs = ideas.map((idea, i) => {
    const pos = getSpherePosition(i, orbCount, sphereRadius);
    return (
      <IdeaOrb
        key={idea._id ?? i} // Unique key
        position={pos} // 3D position
        text={idea.title || idea.text} // Label text
        orbColor={idea.orbColor} // Custom color
        onClick={() => {
          handleOrbClick(pos); // Animate camera
          setTimeout(() => {
            // Navigate to idea page after animation
            if (idea._id) {
              navigate(`/ideas/${idea._id}`);
            } else {
              navigate(`/ideas`);
            }
          }, 900); // Wait almost until camera finishes moving
          setSelectedIndex(i);
        }}
      />
    );
  });

  // Handle WebGL context loss (can happen on weak GPUs)
  const handleWebGLError = (error) => {
    console.warn('WebGL Context Lost, attempting to recover...', error);
  };

  // Error boundary for Canvas rendering
  const onError = (error) => {
    console.error('Three.js error:', error);
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Radial gradient background behind WebGL canvas */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(circle at 60% 40%, #ffe6e6 0%, #fff7d6 60%, #e6f7ff 100%)',
        }}
      />
      {/* 3D scene rendered in WebGL */}
      <Canvas
        onError={onError}
        gl={{
          powerPreference: "high-performance", // Try to use GPU for speed
          antialias: true, // Smooth edges
          alpha: true, // Transparent background
          preserveDrawingBuffer: false, // Don’t store old frames
        }}
        camera={{ position: [0, 0, 50], fov: 75 }} // Start camera position
        style={{ position: 'relative', zIndex: 1 }}
      >
        {/* Light fog for depth */}
        <fog attach='fog' args={['#f7f7fa', 20, 70]} />
        <ambientLight intensity={0.6} /> {/* Soft light everywhere */}
        <directionalLight intensity={0.4} position={[5, 5, 5]} /> {/* Sunlight */}
        <CameraController joystickVecRef={joystickVecRef} /> {/* Moves camera with joystick */}
        {orbs} {/* Render all idea orbs */}
        <OrbitControls
          ref={controlsRef}
          enableZoom={false} // Disable zoom
          enablePan={false} // Disable pan
          target={[0, 0, 0]} // Camera looks at scene center
          makeDefault
        />
        {/* Sparkle effects for atmosphere */}
        <Sparkles
          count={250}
          scale={[100, 80, 100]}
          size={60}
          speed={2.2}
          opacity={0.35}
          color='#84c7ff'
          noise={2}
        />
        <Sparkles
          count={120}
          scale={[200, 160, 200]}
          size={150}
          speed={2.5}
          opacity={0.25}
          color='#84c7ff'
          noise={2.5}
        />
        <Sparkles
          count={180}
          scale={[320, 260, 320]}
          size={150}
          speed={2.8}
          opacity={0.18}
          color='#84c7ff'
          noise={3}
        />
        {/* Note: Postprocessing bloom was removed to avoid errors */}
      </Canvas>

      {/* Show joystick only on mobile (if hook says so) */}
      {showJoystick && <Joystick onMove={handleJoystickMove} />}
    </div>
  );
};

export default Scene;
