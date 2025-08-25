// component for idea/ post
import { Sparkles, shaderMaterial } from "@react-three/drei";
// Rim lighting shader material
const RimGlowMaterial = shaderMaterial(
  {
    color: new THREE.Color('#ffa0e5'),
    rimColor: new THREE.Color('#fff'),
    rimStrength: 1.5,
    time: 0,
  },
  // vertex shader with wobble
  `
  uniform float time;
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    // Wobble: displace along normal with time-based sine
    float wobble = 0.07 * sin(time * 2.0 + position.x * 3.0 + position.y * 3.0 + position.z * 3.0);
    vec3 newPosition = position + normal * wobble;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
  `,
  // fragment shader (unchanged)
  `
  uniform vec3 color;
  uniform vec3 rimColor;
  uniform float rimStrength;
  varying vec3 vNormal;
  void main() {
    float rim = pow(1.0 - abs(vNormal.z), rimStrength);
    vec3 col = mix(color, rimColor, rim * 0.6);
    gl_FragColor = vec4(col, 1.0);
  }
  `
);
extend({ RimGlowMaterial });
import { useThree, useFrame, extend } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

// Removed complementary color utility
import { useMemo } from "react";

const IdeaOrb = ({
  position = [0, 2, 0],
  orbColor = "#ffa0e5",
  auraColor = "#ffd700",
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

  // Ref for material to update time uniform
  const materialRef = useRef();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.getElapsedTime();
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Glowing orb (no outer aura) */}
      <mesh
        geometry={geometry}
        onClick={() => onClick && onClick(position)}
        onPointerOver={() => { document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { document.body.style.cursor = "default"; }}
      >
        <rimGlowMaterial
          ref={materialRef}
          color={orbColor}
          rimColor="#fff"
          rimStrength={1.5}
          time={0}
        />
      </mesh>
      {/* Aura shell */}
      {/* <mesh scale={1.25}>
        <sphereGeometry args={[1.2, 64, 64]} />
        <meshBasicMaterial color={auraColor} transparent opacity={0.15} blending={THREE.AdditiveBlending} />
      </mesh> */}
      {/* Subtle per-orb sparkles */}
      <Sparkles count={10} scale={2.2} size={20} speed={0.4} color="#fff" />
    </group>
  );
};

import React from "react";
export default React.memo(IdeaOrb);