import React from 'react';
import { ProfileButton } from './components/ProfileButton';
import { ConnectButton } from './components/ConnectButton';
import { LikeButton } from './components/LikeButton';

export const IdeaCard = () => {
  return (
    <div>
      {/* IdeaCard component content will go here */}
      <ProfileButton />
      <ConnectButton />
      <LikeButton />
    </div>
  );
};
