import React from 'react';
import styled from 'styled-components';
import ProfileButton from './components/ProfileButton';
import ImageCarousel from './components/ImageCarousel';
import IdeaSocialBar from '../IdeaSocialBar/IdeaSocialBar';
import IdeaText from './components/IdeaText';

const IdeaCardContainer = styled.div`
  width: 100%;
  cursor: default;
  &:hover {
    cursor: pointer;
  }
  &:hover * {
    cursor: pointer !important;
  }
`;

const IdeaCard = ({ idea = null }) => {
  if (!idea) {
    return <div>No idea data available</div>;
  }
  return (
    <IdeaCardContainer>
      <ProfileButton author={idea?.author} role={idea?.role} />
      <ImageCarousel images={idea?.images} />
      <IdeaSocialBar ideaId={idea?.id} likes={idea?.likes} connections={idea?.connections} />
      <IdeaText title={idea?.title} bodyText={idea?.bodyText} />
    </IdeaCardContainer>
  );
};

export default IdeaCard;
