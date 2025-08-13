// import React from 'react';
import Scene from './pages/3DScene/3DScene';
import Joystick from "./components/ui/Joystick";
import IdeaCarousel from './pages/ideas/IdeaCarousel/IdeaCarousel';

export const App = () => {
  return (
    <>
      <Joystick onMove={(data) => console.log(data)} />
      {/* <IdeaCarousel /> */}
      <Scene velocity={0} />
    </>
  );
};
