import React, { useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import gsap from "gsap";
import randomColor from "randomcolor";
import IdeaOrb from "./IdeaOrb";
import CameraController from "./CameraController";
import NavBar from "../../components/ui/NavBar";

// Helper to generate a unique vivid color pair not in usedColors
const getUniqueColorPair = (usedColors) => {
  let orbColor, auraColor, combo;
  do {
    orbColor = randomColor({ luminosity: "bright" });
    // Get complementary color by shifting hue 180deg
    // randomColor doesn't provide direct hue shift, so we use HSL manipulation
    const hsl = randomColor({ luminosity: "light", format: "hsl" });
    // Extract hue from orbColor
    const orbH = Number(orbColor.match(/\d+/)?.[0]) || Math.floor(Math.random() * 360);
    const compH = (orbH + 180) % 360;
    auraColor = randomColor({ hue: compH, luminosity: "light" });
    combo = orbColor + "-" + auraColor;
  } while (usedColors.has(combo));
  usedColors.add(combo);
  return { orbColor, auraColor };
};

const Scene = () => {
  const controlsRef = useRef();
  // Track used color pairs
  const [usedColors] = useState(new Set());
  const [ideas, setIdeas] = useState(() => {
    // Initialize with unique color pairs
    return Array.from({ length: 6 }).map((_, i) => {
      const { orbColor, auraColor } = getUniqueColorPair(usedColors);
      return { text: `Post ${i + 1}`, orbColor, auraColor };
    });
  });
  const [input, setInput] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Joystick vector ref
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

  // Show joystick only on touch phones/tablets (iOS/Android), not desktops
  const [showJoystick, setShowJoystick] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      setShowJoystick(false);
      return;
    }
    const compute = () => {
      const ua = navigator.userAgent || navigator.vendor || window.opera || "";
      const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
      const isiPad = /iPad/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
      const isIPhone = /iPhone|iPod/.test(ua);
      const isAndroid = /Android/.test(ua);
      const isMobile = isiPad || isIPhone || isAndroid;
      const sw = window.screen?.width || 0;
      const sh = window.screen?.height || 0;
      const vw = window.innerWidth || 0;
      const vh = window.innerHeight || 0;
      const approxEq = (a, b) => Math.abs(a - b) <= 2; // tolerate minor UI bars
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

      // Always allow if detected iPad (Air/Pro)
      if (isiPad) {
        setShowJoystick(true);
        return;
      }

      // Fallback: allow touch devices that match iPad Pro dimensions
      if (hasTouch && (isIpadProByScreen || isIpadProByViewport || isIpadAirByScreen || isIpadAirByViewport)) {
        setShowJoystick(true);
        return;
      }

      setShowJoystick(Boolean(hasTouch && isMobile));
    };

    compute();
    const handler = () => compute();
    window.addEventListener("resize", handler);
    window.addEventListener("orientationchange", handler);
    return () => {
      window.removeEventListener("resize", handler);
      window.removeEventListener("orientationchange", handler);
    };
  }, []);

  // Add a new idea with a unique color pair
  const addIdea = () => {
    const { orbColor, auraColor } = getUniqueColorPair(usedColors);
    setIdeas([...ideas, { text: `New Idea ${ideas.length + 1}`, orbColor, auraColor }]);
    setSelectedIndex(ideas.length); // Optionally select the new orb
  };

  // Smooth camera zoom handler
  const handleOrbClick = (position) => {
    if (controlsRef.current) {
      const controls = controlsRef.current;
      const target = { x: position[0], y: position[1], z: position[2] };
      // Camera offset (e.g., 8 units away from orb along z axis)
      const camOffset = { x: position[0], y: position[1], z: position[2] + 8 };

      // Animate camera position
      gsap.to(controls.object.position, {
        x: camOffset.x,
        y: camOffset.y,
        z: camOffset.z,
        duration: 1.2,
        onUpdate: () => controls.update(),
      });

      // Animate controls target
      gsap.to(controls.target, {
        x: target.x,
        y: target.y,
        z: target.z,
        duration: 1.2,
        onUpdate: () => controls.update(),
      });
    }
  };

  const zoomToNeighbor = (direction) => {
    let newIndex = selectedIndex;
    if (direction === "left") newIndex = (selectedIndex - 1 + ideas.length) % ideas.length;
    if (direction === "right") newIndex = (selectedIndex + 1) % ideas.length;
    setSelectedIndex(newIndex);

    // Calculate the position for the new selected orb
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

  // Distribute orbs using Fibonacci sphere
  const orbs = ideas.map((idea, i) => {
    const offset = 2 / orbCount;
    const increment = Math.PI * (3 - Math.sqrt(5));
    const y = i * offset - 1 + offset / 2;
    const r = Math.sqrt(1 - y * y);
    const phi = i * increment;
    const x = Math.cos(phi) * r;
    const z = Math.sin(phi) * r;

    return (
      <IdeaOrb
        key={i}
        position={[x * sphereRadius, y * sphereRadius, z * sphereRadius]}
        text={idea.text}
        orbColor={idea.orbColor}
        auraColor={idea.auraColor}
        onClick={handleOrbClick}
      />
    );
  });

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <NavBar
        onAdd={addIdea}
        onLeft={() => zoomToNeighbor("left")}
        onRight={() => zoomToNeighbor("right")}
      />

      <Canvas camera={{ position: [0, 0, 50], fov: 75 }}>
        <color attach="background" args={["#FFFFFF"]} />
        <ambientLight intensity={0.6} />
        <directionalLight intensity={0.4} position={[5, 5, 5]} />
        <CameraController joystickVecRef={joystickVecRef} />
        {orbs}
        <OrbitControls ref={controlsRef} enableZoom={false} enablePan={false} target={[0, 0, 0]} makeDefault />
      </Canvas>

      {showJoystick && <Joystick onMove={handleJoystickMove} />}
    </div>
  );
};

export default Scene;