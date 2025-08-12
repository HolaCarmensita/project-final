import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import IdeaOrb from "./IdeaOrb";

// Example color pairs (orbColor, auraColor)
const colorCombos = [
  ["#ff1900", "#ff7675"], // vivid red
  ["#27ae60", "#55efc4"], // vivid green
  ["#2980b9", "#74b9ff"], // vivid blue
  ["#8e44ad", "#a29bfe"], // vivid purple
  ["#fd79a8", "#fab1a0"], // hot pink/orange
  ["#f1c40f", "#ffeaa7"], // yellow
  ["#00b894", "#00cec9"], // teal
  ["#d35400", "#fdcb6e"], // orange/yellow
  ["#6c5ce7", "#81ecec"], // blue-violet/cyan
];

const Scene = () => {
  const [ideas, setIdeas] = useState([
    { text: "Post 1" },
    { text: "Post 2" },
    // ...initial ideas
  ]);
  const [input, setInput] = useState("");

  // Add a new idea
  const addIdea = () => {
    if (input.trim()) {
      setIdeas([...ideas, { text: input }]);
      setInput("");
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

    // Pick color combo (cycle through palette)
    const [orbColor, auraColor] = colorCombos[i % colorCombos.length];

    return (
      <IdeaOrb
        key={i}
        position={[x * sphereRadius, y * sphereRadius, z * sphereRadius]}
        text={idea.text}
        orbColor={orbColor}
        auraColor={auraColor}
      />
    );
  });

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {/* Add Idea UI */}
      {/* <div style={{
        position: "absolute", top: 20, left: 20, zIndex: 10, background: "#fff8", padding: 10, borderRadius: 8
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Add new idea"
          style={{ marginRight: 8 }}
        />
        <button onClick={addIdea}>Add</button>
      </div> */}
      <Canvas camera={{ position: [0, 0, 50], fov: 75 }}>
        <color attach="background" args={["#FFFFFF"]} />
        <ambientLight intensity={0.6} />
        <directionalLight intensity={0.4} position={[5, 5, 5]} />
        {orbs}
        <OrbitControls enableZoom={false} enablePan={false} target={[0, 0, 0]} />
      </Canvas>
    </div >
  );
};

export default Scene;