import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sparkles } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import { useIdeasStore } from '../../store/useIdeasStore';
import { useUIStore } from '../../store/useUIStore';
import { gsap } from 'gsap';
import IdeaOrb from './IdeaOrb';
import CameraController from './CameraController';
import Joystick from '../../components/Joystick';
import { getSpherePosition } from './sphereLayout';
import { useShowJoystick } from './useShowJoystick';
import { useSceneNavigation } from './useSceneNavigation';

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

const Scene = () => {
  const ideas = useIdeasStore((state) => state.ideas);
  const selectedIndex = useUIStore((state) => state.selectedIndex);
  const setSelectedIndex = useUIStore((state) => state.setSelectedIndex);
  const navigate = useNavigate();
  const controlsRef = useRef();
  // ...existing code...
  const handleOrbClick = (position) => {
    if (controlsRef.current) {
      const controls = controlsRef.current;
      const target = { x: position[0], y: position[1], z: position[2] };
      const camOffset = { x: position[0], y: position[1], z: position[2] + 8 };

      // Only animate if position/target actually changed
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

      // Kill previous tweens to avoid overlap
      gsap.killTweensOf([controls.object.position, controls.target]);

      gsap.to(controls.object.position, {
        x: camOffset.x,
        y: camOffset.y,
        z: camOffset.z,
        duration: 1.2,
        onUpdate: () => controls.update(),
      });

      gsap.to(controls.target, {
        x: target.x,
        y: target.y,
        z: target.z,
        duration: 1.2,
        onUpdate: () => controls.update(),
      });
    }
  };
  // ...existing code...
  const sphereRadius = 20;
  // Use custom hook for keyboard and camera navigation
  useSceneNavigation({
    ideas,
    selectedIndex,
    setSelectedIndex,
    handleOrbClick,
    sphereRadius,
  });

  const joystickVecRef = useRef({ x: 0, y: 0, force: 0 });
  const handleJoystickMove = (data) => {
    if (!data || !data.vector) {
      joystickVecRef.current = { x: 0, y: 0, force: 0 };
      return;
    }
    const { x, y } = data.vector;
    const force = data.force || 0;
    joystickVecRef.current = { x, y, force };
  };

  const showJoystick = useShowJoystick();

  // ...existing code...

  const zoomToNeighbor = (direction) => {
    let newIndex = selectedIndex;
    if (direction === 'left')
      newIndex = (selectedIndex - 1 + ideas.length) % ideas.length;
    if (direction === 'right') newIndex = (selectedIndex + 1) % ideas.length;
    setSelectedIndex(newIndex);

    const offset = 2 / ideas.length;
    const increment = Math.PI * (3 - Math.sqrt(5));
    const y = newIndex * offset - 1 + offset / 2;
    const r = Math.sqrt(1 - y * y);
    const phi = newIndex * increment;
    const x = Math.cos(phi) * r;
    const z = Math.sin(phi) * r;

    handleOrbClick([x * sphereRadius, y * sphereRadius, z * sphereRadius]);
  };

  // ...existing code...
  const orbCount = ideas.length;

  const orbs = ideas.map((idea, i) => {
    const pos = getSpherePosition(i, orbCount, sphereRadius);
    return (
      <IdeaOrb
        key={idea.id ?? i}
        position={pos}
        text={idea.title || idea.text}
        orbColor={idea.orbColor}
        onClick={() => {
          handleOrbClick(pos);
          if (idea.id) {
            navigate(`/ideas/${idea.id}`);
          } else {
            navigate(`/ideas`);
          }
          setSelectedIndex(i);
        }}
      />
    );
  });

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Radial gradient background */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(circle at 60% 40%, #ffe6e6 0%, #fff7d6 60%, #e6f7ff 100%)',
        }}
      />
      <Canvas
        camera={{ position: [0, 0, 50], fov: 75 }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <fog attach='fog' args={['#f7f7fa', 20, 70]} />
        <ambientLight intensity={0.6} />
        <directionalLight intensity={0.4} position={[5, 5, 5]} />
        <CameraController joystickVecRef={joystickVecRef} />
        {orbs}
        <OrbitControls
          ref={controlsRef}
          enableZoom={false}
          enablePan={false}
          target={[0, 0, 0]}
          makeDefault
        />
        {/* Global ambient sparkles field (less dense and further out) */}
        <Sparkles
          count={250}
          scale={[100, 80, 100]}
          size={60}
          speed={2.2}
          opacity={0.35}
          color='#84c7ff'
          noise={2}
        />
        {/* Mid-distance layer for wider coverage */}
        <Sparkles
          count={120}
          scale={[200, 160, 200]}
          size={150}
          speed={2.5}
          opacity={0.25}
          color='#84c7ff'
          noise={2.5}
        />
        {/* Far layer to fill deep background */}
        <Sparkles
          count={180}
          scale={[320, 260, 320]}
          size={150}
          speed={2.8}
          opacity={0.18}
          color='#84c7ff'
          noise={3}
        />
        {/* Removed postprocessing Bloom to avoid multiple-three/hook errors */}
      </Canvas>

      {showJoystick && <Joystick onMove={handleJoystickMove} />}
    </div>
  );
};

export default Scene;
