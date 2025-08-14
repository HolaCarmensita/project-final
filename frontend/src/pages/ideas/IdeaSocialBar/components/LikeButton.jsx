import React, { useState } from 'react';
import heart from '../../../../assets/icons/heart.svg';
import heartFill from '../../../../assets/icons/heart_fill.svg';
import styled from 'styled-components';

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

const HeartIcon = styled.img`
  transition: all 0.2s ease;
  width: 32px;
  height: 32px;
`;

const LikeText = styled.h4`
  color: #808080;
  font-weight: 400;
`;

const LikeCount = styled.p`
  font-weight: 400;
`;

export const LikeButton = ({ initialLikes = 0 }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);

  const handleClick = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  return (
    <LikeButtonContainer>
      <ButtonContainer>
        <StyledButton
          onClick={handleClick}
          tabIndex={4}
          aria-label={`${
            isLiked ? 'Unlike' : 'Like'
          } this idea. ${likes} likes`}
        >
          <HeartIcon src={isLiked ? heartFill : heart} alt='heart' />
        </StyledButton>
        <LikeCount>{likes}</LikeCount>
      </ButtonContainer>
      <LikeText>{isLiked ? 'Liked' : 'Like'}</LikeText>
    </LikeButtonContainer>
  );
};
