import React, { useEffect, useRef } from "react";
import nipplejs from "nipplejs";

const Joystick = ({ onMove }) => {
  const joystickRef = useRef(null);

  useEffect(() => {
    const manager = nipplejs.create({
      zone: joystickRef.current,
      mode: "static",
      color: "black",
      size: 90,
    });

    manager.on("move", (evt, data) => {
      if (onMove && data) {
        onMove(data);
      }
    });

    return () => manager.destroy();
  }, [onMove]);

  return (
    <div
      ref={joystickRef}
      style={{
        position: "absolute",
        left: 0,
        bottom: "80px",
        width: "180px",
        height: "180px",
        zIndex: 1001,
        touchAction: "none",
      }}
    />
  );
};

export default Joystick;