import React from 'react';
import styled from 'styled-components';

const IdeaTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  gap: 16px;
`;

const IdeaText = ({
  title = 'Idea title default value',
  bodyText = 'Idea content default value',
}) => {
  return (
    <IdeaTextContainer>
      <h1>{title}</h1>
      <p>{bodyText}</p>
    </IdeaTextContainer>
  );
};

export default IdeaText;
