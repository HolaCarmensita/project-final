// component for idea/ post
import { Sparkles } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useMemo } from "react";

const IdeaOrb = ({
  position = [0, 2, 0],
  text = "Placeholder",
  orbColor = "#b3e0ff",
  auraColor = "#e0f7fa",
  onClick,
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

  const getWooblyGeometry = (radius = 1.2, detail = 32, wobble = 1) => {
    const geometry = new THREE.SphereGeometry(radius, detail, detail);
    const position = geometry.attributes.position;
    for (let i = 0; i < position.count; i++) {
      const vertex = new THREE.Vector3().fromBufferAttribute(position, i);
      const randomFactor = 1 + (Math.random() - 0.5) * wobble;
      vertex.multiplyScalar(randomFactor);
      position.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    position.needsUpdate = true;
    return geometry;
  };

  // [FIX] make geometries woobly,  
  const geometry = useMemo(() => getWooblyGeometry(1.2, 32, 0.03), []);
  const auraGeometry = useMemo(() => getWooblyGeometry(1.7, 32, 0.03), []);

  return (
    <group ref={groupRef} position={position}>
      {/* Glowing orb */}
      <mesh
        geometry={geometry}
        onClick={() => onClick && onClick(position)}
        onPointerOver={() => { document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { document.body.style.cursor = "default"; }}
      >
        <meshStandardMaterial
          color={orbColor}
          transparent
          opacity={1}
          emissive={orbColor}
          emissiveIntensity={0.7}
        />
      </mesh>
      {/* Softer, lighter aura - does not block pointer events */}
      <mesh geometry={auraGeometry} onPointerDown={e => e.stopPropagation()}>
        <meshBasicMaterial
          color={auraColor}
          transparent
          opacity={0.5}
          depthWrite={false}
        />
      </mesh>
      {/* Sparkles */}
      <Sparkles count={20} scale={2.5} size={2} color="#e0f7fa" />
    </group>
  );
};

import React from "react";
export default React.memo(IdeaOrb);
