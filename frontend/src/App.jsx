import React from 'react';
import Scene from './pages/3DScene/3DScene';

import IdeaCarousel from './pages/ideas/IdeaCarousel/IdeaCarousel';

export const App = () => {
  return (
    <>
      <Scene velocity={0} />
      <IdeaCarousel />
    </>
  );
};
