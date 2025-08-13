import { useThree, useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";

const MOVE_SPEED = 0.5;
const JOYSTICK_SCALE = 0.6;

const keyMap = {
  ArrowUp: "forward",
  ArrowDown: "backward",
  ArrowLeft: "left",
  ArrowRight: "right",
  w: "forward",
  s: "backward",
  a: "left",
  d: "right",
};

export default function CameraController({ joystickVecRef }) {
  const { camera, controls } = useThree();
  const pressed = useRef({});

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (keyMap[e.key]) pressed.current[keyMap[e.key]] = true;
    };
    const handleKeyUp = (e) => {
      if (keyMap[e.key]) pressed.current[keyMap[e.key]] = false;
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useFrame(() => {
    let moveX = 0, moveZ = 0;

    if (pressed.current.forward) moveZ += MOVE_SPEED;
    if (pressed.current.backward) moveZ -= MOVE_SPEED;
    if (pressed.current.left) moveX -= MOVE_SPEED;
    if (pressed.current.right) moveX += MOVE_SPEED;

    if (joystickVecRef && joystickVecRef.current) {
      const { x = 0, y = 0, force = 0 } = joystickVecRef.current || {};
      moveX += x * JOYSTICK_SCALE * MOVE_SPEED * (force || 1);
      moveZ += y * JOYSTICK_SCALE * MOVE_SPEED * (force || 1);
    }

    if ((moveX !== 0 || moveZ !== 0) && controls) {
      const dir = controls.target.clone().sub(camera.position).normalize();
      const right = dir.clone().cross(camera.up).normalize();

      camera.position.add(dir.clone().multiplyScalar(moveZ));
      camera.position.add(right.clone().multiplyScalar(moveX));
      controls.target.add(dir.clone().multiplyScalar(moveZ));
      controls.target.add(right.clone().multiplyScalar(moveX));
      controls.update();
    }
  });

  return null;
}