import React, { useEffect, useRef } from "react";
import nipplejs from "nipplejs";

const Joystick = ({ onMove }) => {
  const joystickRef = useRef(null);

  useEffect(() => {
    const manager = nipplejs.create({
      zone: joystickRef.current,
      mode: "static",
      position: { left: "50%", bottom: "80px" },
      color: "blue",
      size: 80,
    });

    manager.on("move", (evt, data) => {
      if (onMove && data) {
        onMove(data);
      }
    });

    return () => {
      manager.destroy();
    };
  }, [onMove]);

  return (
    <div
      ref={joystickRef}
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        height: "200px",
        zIndex: 1000,
        touchAction: "none",
      }}
    />
  );
};

export default Joystick;