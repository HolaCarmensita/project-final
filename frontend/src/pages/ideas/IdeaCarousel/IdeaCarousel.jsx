import React from 'react';
import { Navigation } from './components/Navigation';
import { LikeButton } from './components/LikeButton';
import { ConnectButton } from './components/ConnectButton';
import { IdeaCard } from './components/IdeaCard';

export const IdeaCarousel = () => {
  return (
    <div>
      <Navigation />
      <IdeaCard />
      <LikeButton />
      <ConnectButton />
    </div>
  );
};
