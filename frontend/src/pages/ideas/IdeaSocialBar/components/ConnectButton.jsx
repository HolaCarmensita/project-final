import React, { useState } from 'react';
import styled from 'styled-components';
import at from '/icons/at.svg';
import atBold from '/icons/at_bold.svg';

const ConnectButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px; /* Fixed width to make sure the width of "Connected" text */
`;

const ConnectBtn = styled.button`
  background-color: #ffffff;
  color: #000000;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const ConnectIcon = styled.img`
  width: 32px;
  height: 32px;
`;

const ConnectText = styled.h4`
  color: #808080;
  font-weight: 400;
`;

export const ConnectButton = () => {
  const [isConnected, setIsConnected] = useState(false);

  const handleClick = () => {
    setIsConnected(!isConnected);
  };

  return (
    <ConnectButtonContainer>
      <ConnectBtn>
        <ConnectIcon
          onClick={handleClick}
          src={isConnected ? atBold : at}
          alt={isConnected ? 'connected' : 'connect'}
        ></ConnectIcon>
      </ConnectBtn>
      <ConnectText>{isConnected ? 'Connected' : 'Connect'}</ConnectText>
    </ConnectButtonContainer>
  );
};
