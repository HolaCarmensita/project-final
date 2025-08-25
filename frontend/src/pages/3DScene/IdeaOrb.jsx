// component for idea/ post
import { Sparkles, shaderMaterial } from "@react-three/drei";
// Rim lighting shader material
const RimGlowMaterial = shaderMaterial(
  {
    color: new THREE.Color('#ffa0e5'),
    rimColor: new THREE.Color('#fff'),
    rimStrength: 1.5,
    time: 0,
    phase: 0,
    freq: 1,
    dirX: 1,
    dirY: 1,
    dirZ: 1,
  },
  // vertex shader with wobble, phase, frequency, and direction offset
  `
  uniform float time;
  uniform float phase;
  uniform float freq;
  uniform float dirX;
  uniform float dirY;
  uniform float dirZ;
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    // Wobble: displace along normal with time-based sine, unique phase, frequency, and direction
    float wobble = 0.07 * sin(time * freq + phase + position.x * dirX + position.y * dirY + position.z * dirZ);
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
  onClick,
  phase,
  freq,
  dirX,
  dirY,
  dirZ,
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

  // Ref for material to update time and phase/freq/dir uniforms
  const materialRef = useRef();
  // Generate random values if not provided
  const phaseValue = useMemo(() => phase ?? Math.random() * Math.PI * 2, [phase]);
  const freqValue = useMemo(() => freq ?? (0.7 + Math.random() * 1.6), [freq]);
  const dirXValue = useMemo(() => dirX ?? (0.7 + Math.random() * 2.6), [dirX]);
  const dirYValue = useMemo(() => dirY ?? (0.7 + Math.random() * 2.6), [dirY]);
  const dirZValue = useMemo(() => dirZ ?? (0.7 + Math.random() * 2.6), [dirZ]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.getElapsedTime();
      materialRef.current.uniforms.phase.value = phaseValue;
      materialRef.current.uniforms.freq.value = freqValue;
      materialRef.current.uniforms.dirX.value = dirXValue;
      materialRef.current.uniforms.dirY.value = dirYValue;
      materialRef.current.uniforms.dirZ.value = dirZValue;
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
          phase={phaseValue}
          freq={freqValue}
          dirX={dirXValue}
          dirY={dirYValue}
          dirZ={dirZValue}
        />
      </mesh>
  // ...existing code...
      {/* Subtle per-orb sparkles */}
      <Sparkles count={10} scale={2.2} size={20} speed={0.4} color="#fff" />
    </group>
  );
};

import React from "react";
export default React.memo(IdeaOrb);