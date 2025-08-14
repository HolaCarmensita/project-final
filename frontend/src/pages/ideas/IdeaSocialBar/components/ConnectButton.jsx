import React, { useState } from 'react';
import styled from 'styled-components';
import at from '../../../../assets/icons/at.svg';
import atBold from '../../../../assets/icons/at_bold.svg';

const ConnectButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px; /* Fixed width to make sure the width of "Connected" text */
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

const ConnectBtn = styled.button`
  background-color: #ffffff;
  color: #000000;
  border-radius: 8px;
  border: none;
  padding-inline: 0px;

  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }

  &:focus {
    outline: 2px solid #007bff;
    outline-offset: 2px;
    background-color: rgba(0, 123, 255, 0.05);
  }

  &:focus-visible {
    outline: 2px solid #007bff;
    outline-offset: 2px;
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

const ConnectCount = styled.p`
  font-weight: 400;
`;

export const ConnectButton = ({ initialConnections = 0 }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connections, setConnections] = useState(initialConnections);

  const handleClick = () => {
    setIsConnected(!isConnected);
    setConnections(isConnected ? connections - 1 : connections + 1);
  };

  return (
    <ConnectButtonContainer>
      <ButtonContainer>
        <ConnectBtn
          onClick={handleClick}
          tabIndex={5}
          aria-label={`${
            isConnected ? 'Disconnect from' : 'Connect with'
          } this idea. ${connections} connections`}
        >
          <ConnectIcon
            src={isConnected ? atBold : at}
            alt={isConnected ? 'connected' : 'connect'}
          />
        </ConnectBtn>
        <ConnectCount>{connections}</ConnectCount>
      </ButtonContainer>
      <ConnectText>{isConnected ? 'Connected' : 'Connect'}</ConnectText>
    </ConnectButtonContainer>
  );
};
