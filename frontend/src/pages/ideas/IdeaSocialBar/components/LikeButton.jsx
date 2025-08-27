import React, { useMemo } from 'react';
import heart from '../../../../assets/icons/heart.svg';
import heartFill from '../../../../assets/icons/heart_fill.svg';
import styled from 'styled-components';
import { useIdeasStore } from '../../../../store/useIdeasStore';
import { useAuthStore } from '../../../../store/useAuthStore';

const LikeButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

const StyledButton = styled.button`
  background-color: #ffffff;
  color: #000000;
  border-radius: 8px;
  border: none;
  transition: all 0.2s ease;
  cursor: pointer;
  padding-inline: 0px;

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

const HeartIcon = styled.img`
  transition: all 0.2s ease;
  width: 32px;
  height: 32px;
`;

const LikeText = styled.h4`
  color: ${(props) => (props.disabled ? '#cccccc' : '#808080')};
  font-weight: 400;
`;

const LikeCount = styled.p`
  font-weight: 400;
`;

export const LikeButton = ({ ideaId }) => {
  // Get all data from store (updates automatically)
  const idea = useIdeasStore((store) =>
    store.ideas.find((i) => i._id === ideaId)
  );

  const likedIds = useIdeasStore((store) => store.likedIds);
  const likeIdea = useIdeasStore((store) => store.likeIdea);
  const unlikeIdea = useIdeasStore((store) => store.unlikeIdea);

  // Get current user from auth store
  const currentUser = useAuthStore((store) => store.user);

  const isLiked = useMemo(() => likedIds.includes(ideaId), [likedIds, ideaId]);

  const likes = idea?.likeCount ?? 0;

  // Check if this is the user's own idea
  const isOwnIdea = currentUser && idea?.creator?._id === currentUser._id;

  const handleClick = () => {
    // Don't allow interaction if it's the user's own idea
    if (isOwnIdea || !ideaId) return;
    if (isLiked) unlikeIdea(ideaId);
    else likeIdea(ideaId);
  };

  return (
    <LikeButtonContainer>
      <ButtonContainer>
        <StyledButton
          onClick={handleClick}
          disabled={isOwnIdea}
          tabIndex={4}
          aria-label={`${
            isOwnIdea
              ? 'Cannot like your own idea'
              : isLiked
              ? 'Unlike'
              : 'Like'
          } this idea. ${likes} likes`}
        >
          <HeartIcon src={isLiked ? heartFill : heart} alt='heart' />
        </StyledButton>
        <LikeCount>{likes}</LikeCount>
      </ButtonContainer>
      <LikeText disabled={isOwnIdea}>
        {isOwnIdea ? 'Your Idea' : isLiked ? 'Liked' : 'Like'}
      </LikeText>
    </LikeButtonContainer>
  );
};
