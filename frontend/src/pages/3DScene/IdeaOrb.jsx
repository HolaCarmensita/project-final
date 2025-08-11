// component for idea/ post

import { Html, Sparkles } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function IdeaOrb({
  position = [0, 2, 0],
  text = "Placeholder",
}) {
  const groupRef = useRef();
  const { camera } = useThree();

  useFrame((state) => {
    if (groupRef.current) {
      const [x, , z] = position;
      const dx = camera.position.x - x;
      const dz = camera.position.z - z;
      const angle = Math.atan2(dx, dz);
      groupRef.current.rotation.set(0, angle, 0);

      // Pulsing animation for the orb
      const t = state.clock.getElapsedTime();
      const scale = 1 + Math.sin(t * 2) * 0.07;
      groupRef.current.children[0].scale.set(scale, scale, scale);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Glowing orb */}
      <mesh>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial
          color="#b3e0ff"
          transparent
          opacity={0.3}
          emissive="#aee7ff"
          emissiveIntensity={0.7}
        />
      </mesh>
      {/* Softer, lighter aura */}
      <mesh>
        <sphereGeometry args={[1.7, 32, 32]} />
        <meshBasicMaterial
          color="#e0f7fa"
          transparent
          opacity={0.08}
          depthWrite={false}
        />
      </mesh>
      {/* Sparkles */}
      <Sparkles count={20} scale={2.5} size={2} color="#e0f7fa" />
      {/* Floating text */}
      <Html
        center
        transform
        distanceFactor={2}
        style={{ pointerEvents: "none" }}
      >
        <div
          style={{
            color: "#e0f7fa",
            textShadow: "0 0 8px #b3e0ff, 0 0 16px #b3e0ff",
            fontWeight: "bold",
            fontSize: "1.1rem",
            background: "rgba(0,0,0,0.15)",
            borderRadius: "8px",
            padding: "0.3em 0.8em",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {text}
        </div>
      </Html>
    </group>
  );
}
