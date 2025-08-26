import React from 'react';
import styled from 'styled-components';
import { LikeButton } from './components/LikeButton';
import { ConnectButton } from './components/ConnectButton';

const IdeaSocialBarContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  padding: 0 8px;
`;

const IdeaSocialBar = ({
  ideaId,
  creatorId,
  creatorName,
  ideaTitle,
  likes = 0,
  connections = 0,
}) => {
  return (
    <IdeaSocialBarContainer>
      <LikeButton ideaId={ideaId} initialLikes={likes} />
      <ConnectButton
        ideaId={ideaId}
        creatorId={creatorId}
        creatorName={creatorName}
        ideaTitle={ideaTitle}
        initialConnections={connections}
      />
    </IdeaSocialBarContainer>
  );
};

export default IdeaSocialBar;
