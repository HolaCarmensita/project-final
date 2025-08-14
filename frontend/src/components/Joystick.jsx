import React, { useEffect, useRef } from "react";
import nipplejs from "nipplejs";

const Joystick = ({ onMove }) => {
  const joystickRef = useRef(null);

  useEffect(() => {
    if (!joystickRef.current) return;
    const manager = nipplejs.create({
      zone: joystickRef.current,
      mode: "static",
      color: "black",
      size: 90,
      position: { left: "50%", top: "50%" },
      multitouch: false,
      restOpacity: 0.8,
    });

    const handleMove = (evt, data) => {
      if (onMove && data) onMove(data);
    };
    const handleEnd = () => {
      if (onMove) onMove({ vector: { x: 0, y: 0 }, force: 0 });
    };

    manager.on("move", handleMove);
    manager.on("end", handleEnd);

    return () => {
      manager.off("move", handleMove);
      manager.off("end", handleEnd);
      manager.destroy();
    };
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