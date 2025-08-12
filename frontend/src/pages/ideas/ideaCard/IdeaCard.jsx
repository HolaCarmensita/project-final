import React from 'react';
import styled from 'styled-components';
import ProfileButton from './components/ProfileButton';
import ImageCarousel from './components/ImageCarousel';
import IdeaSocialBar from '../IdeaSocialBar/IdeaSocialBar';
import IdeaText from './components/IdeaText';

const IdeaCardContainer = styled.div`
  max-width: 400px;
`;

export const IdeaCard = () => {
  return (
    <IdeaCardContainer>
      <ProfileButton />
      <ImageCarousel />
      <IdeaSocialBar />
      <IdeaText />
    </IdeaCardContainer>
  );
};
