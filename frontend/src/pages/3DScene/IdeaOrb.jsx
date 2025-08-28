// Import helpers from drei and fiber
import { Sparkles, shaderMaterial } from "@react-three/drei";
import { useThree, useFrame, extend } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import React from "react";

// 🔹 Create a custom shader material with rim glow effect
const RimGlowMaterial = shaderMaterial(
  // Uniforms = dynamic variables we pass into the shader
  {
    color: new THREE.Color('#ffa0e5'), // Base orb color
    rimColor: new THREE.Color('#fff'), // Edge/rim glow color
    rimStrength: 1.5, // How strong the glow is
    time: 0, // Time variable for animation
    phase: 0, // Phase offset for wobble
    freq: 1,  // Frequency of wobble
    dirX: 1,  // Direction modifiers for wobble (per axis)
    dirY: 1,
    dirZ: 1,
  },
  // 🔹 Vertex Shader (controls positions of vertices, adds wobble)
  `
  uniform float time;
  uniform float phase;
  uniform float freq;
  uniform float dirX;
  uniform float dirY;
  uniform float dirZ;
  varying vec3 vNormal; // Pass surface normal to fragment shader

  void main() {
    // Normalize vertex normal
    vNormal = normalize(normalMatrix * normal);

    // Calculate wobble displacement using sine wave
    float wobble = 0.07 * sin(
      time * freq + phase + 
      position.x * dirX + 
      position.y * dirY + 
      position.z * dirZ
    );

    // Offset vertex along its normal to create wobbling effect
    vec3 newPosition = position + normal * wobble;

    // Final position in clip space
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
  `,
  // 🔹 Fragment Shader (controls pixel colors, adds rim glow)
  `
  uniform vec3 color;     // Base color
  uniform vec3 rimColor;  // Rim glow color
  uniform float rimStrength; // Glow strength
  varying vec3 vNormal;   // Surface normal from vertex shader

  void main() {
    // Calculate rim effect = brighter edges when surface is angled
    float rim = pow(1.0 - abs(vNormal.z), rimStrength);

    // Mix base color and rim glow
    vec3 col = mix(color, rimColor, rim * 0.6);

    // Final pixel color
    gl_FragColor = vec4(col, 1.0);
  }
  `
);

// Make RimGlowMaterial usable in JSX (<rimGlowMaterial />)
extend({ RimGlowMaterial });


// 🔹 IdeaOrb Component
const IdeaOrb = ({
  position = [0, 2, 0],   // Default position
  orbColor = "#ffa0e5",   // Default orb color
  onClick,                // Callback for click
  phase,
  freq,
  dirX,
  dirY,
  dirZ,
}) => {
  const groupRef = useRef();      // Reference for the orb group
  const materialRef = useRef();   // Reference for the custom shader
  const { camera } = useThree();  // Get active camera from scene

  // 🔹 Animate orb rotation + pulsing scale
  useFrame((state) => {
    if (groupRef.current) {
      // Rotate orb to always face camera
      const [x, , z] = position;
      const dx = camera.position.x - x;
      const dz = camera.position.z - z;
      const angle = Math.atan2(dx, dz);
      groupRef.current.rotation.set(0, angle, 0);

      // Pulsing animation (scale changes over time)
      const t = state.clock.getElapsedTime();
      const scale = 1 + Math.sin(t * 2) * 0.07;
      groupRef.current.children[0].scale.set(scale, scale, scale);
    }
  });

  // 🔹 Utility: generate "wobbly" sphere geometry
  const getWooblyGeometry = (radius = 1.2, detail = 32, wobble = 1) => {
    const geometry = new THREE.SphereGeometry(radius, detail, detail);
    const position = geometry.attributes.position;

    // Loop over all vertices and offset them randomly
    for (let i = 0; i < position.count; i++) {
      const vertex = new THREE.Vector3().fromBufferAttribute(position, i);
      const randomFactor = 1 + (Math.random() - 0.5) * wobble;
      vertex.multiplyScalar(randomFactor); // Slightly scale vertex
      position.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    position.needsUpdate = true;
    return geometry;
  };

  // UseMemo ensures we only generate once (not every render)
  const geometry = useMemo(() => getWooblyGeometry(1.2, 32, 0.03), []);

  // 🔹 Generate random uniforms (if not provided as props)
  const phaseValue = useMemo(() => phase ?? Math.random() * Math.PI * 2, [phase]);
  const freqValue = useMemo(() => freq ?? (0.7 + Math.random() * 1.6), [freq]);
  const dirXValue = useMemo(() => dirX ?? (0.7 + Math.random() * 2.6), [dirX]);
  const dirYValue = useMemo(() => dirY ?? (0.7 + Math.random() * 2.6), [dirY]);
  const dirZValue = useMemo(() => dirZ ?? (0.7 + Math.random() * 2.6), [dirZ]);

  // 🔹 Update shader uniforms on each frame
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
      {/* 🔹 Glowing Orb Mesh */}
      <mesh
        geometry={geometry}
        onClick={() => onClick && onClick(position)}
        onPointerOver={() => { document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { document.body.style.cursor = "default"; }}
      >
        {/* Custom Rim Glow Shader */}
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

      {/* 🔹 Sparkles effect around orb */}
      <Sparkles
        count={10}   // number of sparkles
        scale={2.2}  // area size
        size={20}    // sparkle size
        speed={0.4}  // animation speed
        color="#fff" // sparkle color
      />
    </group>
  );
};

// Export as memoized component for performance
export default React.memo(IdeaOrb);
