// component for idea/ post
import { Sparkles, shaderMaterial } from "@react-three/drei";
import { useThree, useFrame, extend } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

// Removed complementary color utility
import { useMemo } from "react";
// Custom gradient glow material
const GradientOrbMaterial = shaderMaterial(
  {
    colorA: new THREE.Color('#ffa0e5'), // e.g. pink
    colorB: new THREE.Color('#ffd700'), // e.g. yellow
    colorC: new THREE.Color('#ff69b4'), // e.g. magenta
  },
  // vertex shader
  `
  varying vec3 vPosition;
  void main() {
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  // fragment shader
  `
  uniform vec3 colorA;
  uniform vec3 colorB;
  uniform vec3 colorC;
  varying vec3 vPosition;
  void main() {
    float r = length(vPosition);
    float gradA = smoothstep(0.0, 1.2, r); // center to edge
    float gradB = smoothstep(0.0, 1.2, abs(vPosition.x)); // left-right
    float gradC = smoothstep(0.0, 1.2, abs(vPosition.y)); // top-bottom
    vec3 col = mix(colorA, colorB, gradA);
    col = mix(col, colorC, 0.5 * gradB + 0.5 * gradC);
    gl_FragColor = vec4(col, 1.0);
  }
  `
);
extend({ GradientOrbMaterial });

const IdeaOrb = ({
  position = [0, 2, 0],
  orbColor = "#ffa0e5",
  auraColor = "#ffd700",
  orbColorC = "#ff69b4",
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

  return (
    <group ref={groupRef} position={position}>
      {/* Glowing orb (no outer aura) */}
      <mesh
        geometry={geometry}
        onClick={() => onClick && onClick(position)}
        onPointerOver={() => { document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { document.body.style.cursor = "default"; }}
      >
        <gradientOrbMaterial
          colorA={orbColor}
          colorB={auraColor}
          colorC={orbColorC}
        />
      </mesh>
      {/* Aura shell */}
      {/* <mesh scale={1.25}>
        <sphereGeometry args={[1.2, 64, 64]} />
        <meshBasicMaterial color={auraColor} transparent opacity={0.15} blending={THREE.AdditiveBlending} />
      </mesh> */}
      {/* Subtle per-orb sparkles */}
      <Sparkles count={10} scale={2.2} size={10} speed={0.4} color="#fff" />
    </group>
  );
};

import React from "react";
export default React.memo(IdeaOrb);