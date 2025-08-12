import React from 'react';
import styled from 'styled-components';
import { IdeaCard } from '../ideaCard/IdeaCard';

const IdeaCarouselContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  max-width: 400px;
`;

const IdeaCarousel = () => {
  return (
    <IdeaCarouselContainer>
      <IdeaCard />
    </IdeaCarouselContainer>
  );
};

export default IdeaCarousel;
