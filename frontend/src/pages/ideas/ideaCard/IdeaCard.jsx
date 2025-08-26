import React from 'react';
import styled from 'styled-components';
import ProfileButton from './components/ProfileButton';
import ImageCarousel from './components/ImageCarousel';
import IdeaSocialBar from '../IdeaSocialBar/IdeaSocialBar';
import IdeaText from './components/IdeaText';

const IdeaCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
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
      <ProfileButton
        author={idea?.creator?.fullName}
        role={idea?.creator?.role}
        userId={idea?.creator?._id}
      />
      <ImageCarousel images={idea?.images} />
      <IdeaSocialBar
        ideaId={idea?._id}
        likes={idea?.likeCount}
        connections={idea?.connectionCount}
      />
      <IdeaText title={idea?.title} bodyText={idea?.description} />
    </IdeaCardContainer>
  );
};

export default IdeaCard;
