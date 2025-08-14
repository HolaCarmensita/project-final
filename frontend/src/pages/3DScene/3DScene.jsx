import React, { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import randomColor from "randomcolor";
import IdeaOrb from "./IdeaOrb";
import CameraController from "./CameraController";
import NavBar from "../../components/NavBar";
import Joystick from "../../components/Joystick";
import AddIdeaSheet from "../../components/AddIdeaSheet";
import mockApi from "../../data/mockData";

const getUniqueColorPair = (usedColors) => {
  let orbColor, auraColor, combo;
  do {
    orbColor = randomColor({ luminosity: "bright" });
    const hsl = randomColor({ luminosity: "light", format: "hsl" });
    const orbH = Number(orbColor.match(/\d+/)?.[0]) || Math.floor(Math.random() * 360);
    const compH = (orbH + 180) % 360;
    auraColor = randomColor({ hue: compH, luminosity: "light" });
    combo = orbColor + "-" + auraColor;
  } while (usedColors.has(combo));
  usedColors.add(combo);
  return { orbColor, auraColor };
};

const Scene = () => {
  const navigate = useNavigate();
  const controlsRef = useRef();
  const [usedColors] = useState(new Set());

  // Load ideas from mock API and decorate with colors for orbs
  const [ideas, setIdeas] = useState([]);
  useEffect(() => {
    const load = async () => {
      const fetched = await mockApi.getIdeas();
      const withColors = fetched.map((idea) => {
        const { orbColor, auraColor } = getUniqueColorPair(usedColors);
        return { ...idea, orbColor, auraColor };
      });
      setIdeas(withColors);
    };
    load();
  }, [usedColors]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const joystickVecRef = useRef({ x: 0, y: 0, force: 0 });
  const handleJoystickMove = (data) => {
    if (!data || !data.vector) {
      joystickVecRef.current = { x: 0, y: 0, force: 0 };
      return;
    }
    const { x, y } = data.vector;
    const force = data.force || 0;
    joystickVecRef.current = { x, y, force };
  };

  const [showJoystick, setShowJoystick] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      setShowJoystick(false);
      return;
    }
    const compute = () => {
      const ua = navigator.userAgent || navigator.vendor || window.opera || "";
      const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
      const isiPad = /iPad/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
      const isIPhone = /iPhone|iPod/.test(ua);
      const isAndroid = /Android/.test(ua);
      const isMobile = isiPad || isIPhone || isAndroid;
      const sw = window.screen?.width || 0;
      const sh = window.screen?.height || 0;
      const vw = window.innerWidth || 0;
      const vh = window.innerHeight || 0;
      const approxEq = (a, b) => Math.abs(a - b) <= 2;
      const isIpadProByScreen =
        (approxEq(sw, 1024) && approxEq(sh, 1366)) ||
        (approxEq(sw, 1366) && approxEq(sh, 1024));
      const isIpadProByViewport =
        (approxEq(vw, 1024) && approxEq(vh, 1366)) ||
        (approxEq(vw, 1366) && approxEq(vh, 1024));
      const isIpadAirByScreen =
        (approxEq(sw, 820) && approxEq(sh, 1180)) ||
        (approxEq(sw, 1180) && approxEq(sh, 820));
      const isIpadAirByViewport =
        (approxEq(vw, 820) && approxEq(vh, 1180)) ||
        (approxEq(vw, 1180) && approxEq(vh, 820));

      if (isiPad) {
        setShowJoystick(true);
        return;
      }
      if (hasTouch && (isIpadProByScreen || isIpadProByViewport || isIpadAirByScreen || isIpadAirByViewport)) {
        setShowJoystick(true);
        return;
      }
      setShowJoystick(Boolean(hasTouch && isMobile));
    };

    compute();
    const handler = () => compute();
    window.addEventListener("resize", handler);
    window.addEventListener("orientationchange", handler);
    return () => {
      window.removeEventListener("resize", handler);
      window.removeEventListener("orientationchange", handler);
    };
  }, []);

  // Bottom sheet state
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleSubmitIdea = ({ title, description, files }) => {
    const { orbColor, auraColor } = getUniqueColorPair(usedColors);
    const newIdea = {
      id: Date.now(),
      title: title && title.trim() ? title.trim() : `New Idea ${ideas.length + 1}`,
      bodyText: description || "",
      images: [],
      author: "You",
      role: "Creator",
      likes: 0,
      connections: 0,
      orbColor,
      auraColor
    };
    setIdeas((prev) => [...prev, newIdea]);
    setSelectedIndex(ideas.length);
    setIsAddOpen(false);
  };

  const handleOrbClick = (position) => {
    if (controlsRef.current) {
      const controls = controlsRef.current;
      const target = { x: position[0], y: position[1], z: position[2] };
      const camOffset = { x: position[0], y: position[1], z: position[2] + 8 };

      gsap.to(controls.object.position, {
        x: camOffset.x,
        y: camOffset.y,
        z: camOffset.z,
        duration: 1.2,
        onUpdate: () => controls.update(),
      });

      gsap.to(controls.target, {
        x: target.x,
        y: target.y,
        z: target.z,
        duration: 1.2,
        onUpdate: () => controls.update(),
      });
    }
  };

  const zoomToNeighbor = (direction) => {
    let newIndex = selectedIndex;
    if (direction === "left") newIndex = (selectedIndex - 1 + ideas.length) % ideas.length;
    if (direction === "right") newIndex = (selectedIndex + 1) % ideas.length;
    setSelectedIndex(newIndex);

    const offset = 2 / ideas.length;
    const increment = Math.PI * (3 - Math.sqrt(5));
    const y = newIndex * offset - 1 + offset / 2;
    const r = Math.sqrt(1 - y * y);
    const phi = newIndex * increment;
    const x = Math.cos(phi) * r;
    const z = Math.sin(phi) * r;

    handleOrbClick([x * sphereRadius, y * sphereRadius, z * sphereRadius]);
  };

  const sphereRadius = 20;
  const orbCount = ideas.length;

  const orbs = ideas.map((idea, i) => {
    const offset = 2 / orbCount;
    const increment = Math.PI * (3 - Math.sqrt(5));
    const y = i * offset - 1 + offset / 2;
    const r = Math.sqrt(1 - y * y);
    const phi = i * increment;
    const x = Math.cos(phi) * r;
    const z = Math.sin(phi) * r;
    const pos = [x * sphereRadius, y * sphereRadius, z * sphereRadius];

    return (
      <IdeaOrb
        key={idea.id ?? i}
        position={pos}
        text={idea.title || idea.text}
        orbColor={idea.orbColor}
        auraColor={idea.auraColor}
        onClick={() => {
          handleOrbClick(pos);
          if (idea.id) {
            navigate(`/ideas/${idea.id}`);
          } else {
            navigate(`/ideas`);
          }
          setSelectedIndex(i);
        }}
      />
    );
  });

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <NavBar
        onAdd={() => setIsAddOpen(true)}
        onLeft={() => zoomToNeighbor("left")}
        onRight={() => zoomToNeighbor("right")}
      />

      <Canvas camera={{ position: [0, 0, 50], fov: 75 }}>
        <color attach="background" args={["#FFFFFF"]} />
        <ambientLight intensity={0.6} />
        <directionalLight intensity={0.4} position={[5, 5, 5]} />
        <CameraController joystickVecRef={joystickVecRef} />
        {orbs}
        <OrbitControls ref={controlsRef} enableZoom={false} enablePan={false} target={[0, 0, 0]} makeDefault />
      </Canvas>

      {showJoystick && !isAddOpen && <Joystick onMove={handleJoystickMove} />}

      <AddIdeaSheet
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleSubmitIdea}
      />
    </div>
  );
};

export default Scene;