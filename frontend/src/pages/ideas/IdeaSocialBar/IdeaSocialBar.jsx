import React from 'react';
import styled from 'styled-components';
import { LikeButton } from './components/LikeButton';
import { ConnectButton } from './components/ConnectButton';

const IdeaSocialBarContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  padding: 16px 0px 16px 0px;
`;

const IdeaSocialBar = () => {
  return (
    <IdeaSocialBarContainer>
      <LikeButton />
      <ConnectButton />
    </IdeaSocialBarContainer>
  );
};

export default IdeaSocialBar;
