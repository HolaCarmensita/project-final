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
    colorA: new THREE.Color('#ffa0e5'),
    colorB: new THREE.Color('#7ed7ff'),
    rimColor: new THREE.Color('#ffffff'),
    rimPower: 2.0,
    emissiveIntensity: 0.8,
  },
  // vertex shader
  `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vViewDir = cameraPosition - worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
  `,
  // fragment shader
  `
  uniform vec3 colorA;
  uniform vec3 colorB;
  uniform vec3 rimColor;
  uniform float rimPower;
  uniform float emissiveIntensity;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vec3 n = normalize(vNormal);
    vec3 v = normalize(vViewDir);
    float ndotv = clamp(dot(n, v), 0.0, 1.0);
    // center bright, edge darker gradient
    vec3 base = mix(colorB, colorA, pow(ndotv, 1.5));
    // soft fresnel rim
    float fres = pow(1.0 - ndotv, rimPower);
    vec3 col = base + rimColor * fres * emissiveIntensity;
    gl_FragColor = vec4(col, 1.0);
  }
  `
);
extend({ GradientOrbMaterial });

const IdeaOrb = ({
  position = [0, 2, 0],
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
          rimColor={"#ffffff"}
          rimPower={2.0}
          emissiveIntensity={0.9}
        />
      </mesh>
      {/* Aura shell */}
      <mesh scale={1.25}>
        <sphereGeometry args={[1.2, 64, 64]} />
        <meshBasicMaterial color={auraColor} transparent opacity={0.15} blending={THREE.AdditiveBlending} />
      </mesh>
      {/* Subtle per-orb sparkles */}
      <Sparkles count={10} scale={2.2} size={10} speed={0.4} color="#fff" />
    </group>
  );
};

import React from "react";
export default React.memo(IdeaOrb);