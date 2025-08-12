// component for idea/ post
import { Html, Sparkles } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import { useRef } from "react";

const IdeaOrb = ({
  position = [0, 2, 0],
  text = "Placeholder",
  orbColor = "#b3e0ff",
  auraColor = "#e0f7fa",
}) => {
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
          color={orbColor}
          transparent
          opacity={0.3}
          emissive={orbColor}
          emissiveIntensity={0.7}
        />
      </mesh>
      {/* Softer, lighter aura */}
      <mesh>
        <sphereGeometry args={[1.7, 32, 32]} />
        <meshBasicMaterial
          color={auraColor}
          transparent
          opacity={0.08}
          depthWrite={false}
        />
      </mesh>
      {/* Sparkles */}
      <Sparkles count={20} scale={2.5} size={2} color="#e0f7fa" />

    </group>
  );
};

export default IdeaOrb;
