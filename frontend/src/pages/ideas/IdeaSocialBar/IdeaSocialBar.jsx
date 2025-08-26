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

const IdeaSocialBar = ({ ideaId, likes = 0, connections = 0 }) => {
  return (
    <IdeaSocialBarContainer>
      <LikeButton ideaId={ideaId} />
      <ConnectButton ideaId={ideaId} />
    </IdeaSocialBarContainer>
  );
};

export default IdeaSocialBar;
