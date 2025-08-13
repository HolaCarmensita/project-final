import React, { useState } from 'react';
import heart from '/icons/heart.svg';
import heartFill from '/icons/heart_fill.svg';
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

  /* Styled-components built-in focus styles */
  &:focus-visible {
    outline: 2px solid #0035f4;
    outline-offset: 2px;
  }

  /* Remove focus for mouse users */
  &:focus:not(:focus-visible) {
    outline: none;
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
        <StyledButton onClick={handleClick}>
          <HeartIcon src={isLiked ? heartFill : heart} alt='heart' />
        </StyledButton>
        <LikeCount>{likes}</LikeCount>
      </ButtonContainer>
      <LikeText>{isLiked ? 'Liked' : 'Like'}</LikeText>
    </LikeButtonContainer>
  );
};
