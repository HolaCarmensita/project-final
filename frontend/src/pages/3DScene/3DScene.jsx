import React, { useState, useRef, useEffect } from 'react';
// Removed Bloom imports
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sparkles } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import { useIdeasStore } from '../../store/useIdeasStore';
import { gsap } from 'gsap';
import IdeaOrb from './IdeaOrb';
import CameraController from './CameraController';
import Joystick from '../../components/Joystick';

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
    (typeof el.getAttribute === 'function' && el.getAttribute('role') === 'textbox')
  );
};

const Scene = () => {
  const ideas = useIdeasStore((state) => state.ideas);
  const selectedIndex = useIdeasStore((state) => state.selectedIndex);
  const setSelectedIndex = useIdeasStore((state) => state.setSelectedIndex);
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
  }, [ideas.length, handleOrbClick]);
  // Keyboard navigation for left/right arrows (attach only once)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isTypingIntoField()) return; // ignore navigation when typing
      let newIndex = selectedIndex;
      if (e.key === 'ArrowLeft') {
        newIndex = (newIndex - 1 + ideas.length) % ideas.length;
        setSelectedIndex(newIndex);
      } else if (e.key === 'ArrowRight') {
        newIndex = (newIndex + 1) % ideas.length;
        setSelectedIndex(newIndex);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedIndex, ideas.length, setSelectedIndex]);

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

  const sphereRadius = 20;
  const orbCount = ideas.length;

  const orbs = ideas.map((idea, i) => {
    const offset = 2 / orbCount;
    const increment = Math.PI * (3 - Math.sqrt(5));
    const y = i * offset - 1 + offset / 2;
    const r = Math.sqrt(1 - y * y);
    const phi = i * increment;
    const x = Math.cos(phi) * r;
    const z = Math.sin(phi) * r;
    const pos = [x * sphereRadius, y * sphereRadius, z * sphereRadius];

    return (
      <IdeaOrb
        key={idea.id ?? i}
        position={pos}
        text={idea.title || idea.text}
        orbColor={idea.orbColor}
        auraColor={idea.auraColor}
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
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 50], fov: 75 }}>
        <color attach='background' args={['#FFFFFF']} />
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
          speed={0.8}
          opacity={0.35}
          color="#84c7ff"
        />
        {/* Mid-distance layer for wider coverage */}
        <Sparkles
          count={120}
          scale={[200, 160, 200]}
          size={150}
          speed={0.4}
          opacity={0.25}
          color="#84c7ff"
        />
        {/* Far layer to fill deep background */}
        <Sparkles
          count={180}
          scale={[320, 260, 320]}
          size={150}
          speed={0.2}
          opacity={0.18}
          color="#84c7ff"
        />
        {/* Removed postprocessing Bloom to avoid multiple-three/hook errors */}
      </Canvas>

      {showJoystick && <Joystick onMove={handleJoystickMove} />}
    </div>
  );
};

export default Scene;
