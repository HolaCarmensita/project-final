// main 3Dscene component

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import IdeaOrb from "./IdeaOrb";

export default function Scene({ velocity }) {
  // Example: 8 orbs evenly spaced in a circle
  const orbCount = 40;
  const sphereRadius = 20;

  const orbs = Array.from({ length: orbCount }).map((_, i) => {
    // Fibonacci sphere algorithm for even distribution
    const offset = 2 / orbCount;
    const increment = Math.PI * (3 - Math.sqrt(5)); // golden angle in radians

    const y = i * offset - 1 + offset / 2;
    const r = Math.sqrt(1 - y * y);
    const phi = i * increment;

    const x = Math.cos(phi) * r;
    const z = Math.sin(phi) * r;

    return (
      <IdeaOrb
        key={i}
        position={[x * sphereRadius, y * sphereRadius, z * sphereRadius]}
        text={`Post ${i + 1}`}
      />
    );
  });

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas camera={{ position: [0, 0, 50], fov: 75 }}>
        <color attach="background" args={["#101820"]} />
        <ambientLight intensity={0.6} />
        <directionalLight intensity={0.4} position={[5, 5, 5]} />
        {orbs}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
}
