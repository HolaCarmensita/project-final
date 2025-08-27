import React, { useMemo } from 'react';
import styled from 'styled-components';
import at from '../../../../assets/icons/at.svg';
import atBold from '../../../../assets/icons/at_bold.svg';
import { useIdeasStore } from '../../../../store/useIdeasStore';
import { useAuthStore } from '../../../../store/useAuthStore';

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
    transform: ${(props) => (props.disabled ? 'none' : 'scale(1.05)')};
  }

  &:focus {
    outline: none;
  }

  &:focus-visible {
    outline: none;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.3;
    filter: grayscale(50%);
  }
`;

const ConnectIcon = styled.img`
  width: 32px;
  height: 32px;
`;

const ConnectText = styled.h4`
  color: ${(props) => (props.disabled ? '#cccccc' : '#808080')};
  font-weight: 400;
`;

const ConnectCount = styled.p`
  font-weight: 400;
`;

export const ConnectButton = ({ ideaId }) => {
  // Get all data from store (updates automatically)
  const idea = useIdeasStore((store) =>
    store.ideas.find((i) => i._id === ideaId || i.id === ideaId)
  );

  const connectedIds = useIdeasStore((store) => store.connectedIds || []);
  const connectToIdea = useIdeasStore((store) => store.connectToIdea);
  const disconnectFromIdea = useIdeasStore((store) => store.disconnectFromIdea);

  // Get current user from auth store
  const currentUser = useAuthStore((store) => store.user);

  const isConnected = useMemo(
    () => connectedIds.includes(ideaId),
    [connectedIds, ideaId]
  );

  const connections = idea?.connectionCount ?? 0;
  const creatorName = idea?.creator?.fullName;
  const ideaTitle = idea?.title;

  // Check if this is the user's own idea
  const isOwnIdea = currentUser && idea?.creator?._id === currentUser._id;

  const handleClick = async () => {
    // Don't allow interaction if it's the user's own idea
    if (isOwnIdea) return;

    if (isConnected) {
      // Disconnect from idea
      const result = await disconnectFromIdea(ideaId);
      if (!result.success) {
        console.error('Failed to disconnect:', result.message);
      }
    } else {
      // Open connect modal via custom event to keep component decoupled
      const event = new CustomEvent('openConnectModal', {
        detail: {
          ideaId,
          userId: idea?.creator?._id,
          userName: creatorName,
          ideaTitle,
        },
      });
      window.dispatchEvent(event);
    }
  };

  return (
    <ConnectButtonContainer>
      <ButtonContainer>
        <ConnectBtn
          onClick={handleClick}
          disabled={isOwnIdea}
          tabIndex={5}
          aria-label={`${
            isOwnIdea
              ? 'Cannot connect to your own idea'
              : isConnected
              ? 'Disconnect from'
              : 'Connect with'
          } this idea. ${connections} connections`}
        >
          <ConnectIcon
            src={isConnected ? atBold : at}
            alt={isConnected ? 'connected' : 'connect'}
          />
        </ConnectBtn>
        <ConnectCount>{connections}</ConnectCount>
      </ButtonContainer>
      <ConnectText disabled={isOwnIdea}>
        {isOwnIdea ? 'Your Idea' : isConnected ? 'Connected' : 'Connect'}
      </ConnectText>
    </ConnectButtonContainer>
  );
};
