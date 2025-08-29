import React from 'react';
import styled from 'styled-components';

const IdeaTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  gap: 16px;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
  }

  &:focus-visible {
    outline: none;
  }
`;

const IdeaTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
`;

const IdeaBody = styled.p`
  margin: 0;
  font-size: 1rem;
  line-height: 1.6;
  color: #666;
`;

const IdeaText = ({
  title = 'Idea title default value',
  bodyText = 'Idea content default value',
}) => {
  return (
    <IdeaTextContainer
      tabIndex={0}
      role='article'
      aria-label={`Idea: ${title}`}
      aria-describedby='idea-body'
    >
      <IdeaTitle id='idea-title'>{title}</IdeaTitle>
      <IdeaBody id='idea-body'>{bodyText}</IdeaBody>
    </IdeaTextContainer>
  );
};

export default IdeaText;
