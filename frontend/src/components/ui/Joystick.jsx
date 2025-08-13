import React, { useEffect, useRef } from "react";
import nipplejs from "nipplejs";

const Joystick = () => {
  const joystickRef = useRef(null);

  useEffect(() => {
    const manager = nipplejs.create({
      zone: joystickRef.current,
      mode: "static",
      color: "black",
      size: 90,
    });

    manager.on("move", (evt, data) => {
      console.log("Joystick moved!", data);
    });
    manager.on("start", () => console.log("Joystick started!"));
    manager.on("end", () => console.log("Joystick ended!"));

    return () => manager.destroy();
  }, []);

  return (
    <div
      ref={joystickRef}
      style={{
        position: "absolute",
        left: "20%",
        bottom: "30px",
        width: "120px",
        height: "120px",
        zIndex: 1001,
        touchAction: "none",
      }}
    />
  );
};

export default Joystick;