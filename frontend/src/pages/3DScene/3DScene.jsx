import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import gsap from "gsap";
import randomColor from "randomcolor";
import IdeaOrb from "./IdeaOrb";
import CameraController from "./CameraController";

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

  // Add a new idea with a unique color pair
  const addIdea = () => {
    if (input.trim()) {
      const { orbColor, auraColor } = getUniqueColorPair(usedColors);
      setIdeas([...ideas, { text: input, orbColor, auraColor }]);
      setInput("");
    }
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
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas camera={{ position: [0, 0, 50], fov: 75 }}>
        <color attach="background" args={["#FFFFFF"]} />
        <ambientLight intensity={0.6} />
        <directionalLight intensity={0.4} position={[5, 5, 5]} />
        <CameraController />
        {orbs}
        <OrbitControls ref={controlsRef} enableZoom={false} enablePan={false} target={[0, 0, 0]} makeDefault />
      </Canvas>
    </div>
  );
};

export default Scene;