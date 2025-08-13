import React from 'react';
import styled from 'styled-components';
import { LikeButton } from './components/LikeButton';
import { ConnectButton } from './components/ConnectButton';

const IdeaSocialBarContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  padding: 16px 8px 16px 8px;
`;

const IdeaSocialBar = ({ likes = 0, connections = 0 }) => {
  return (
    <IdeaSocialBarContainer>
      <LikeButton initialLikes={likes} />
      <ConnectButton initialConnections={connections} />
    </IdeaSocialBarContainer>
  );
};

export default IdeaSocialBar;
