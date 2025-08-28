import React from 'react';
import styled from 'styled-components';

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  margin-top: 0;
`;
const IdeaTitle = styled.h4`
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 4px;
  color: #0f0f0f;
`;
const IdeaDesc = styled.p`
  font-size: 16px;
  line-height: 1.35;
  margin: 6px 0 14px;
  color: #111;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  @media (min-width: 768px) {
    -webkit-line-clamp: 3;
    line-clamp: 3;
  }
`;
const OpenButtonWrap = styled.div`
  align-self: flex-end;
  margin-top: auto;
  opacity: ${(props) => (props.$isVisible ? 1 : 0)};
  transition: opacity 0.6s ease-in-out;
`;
const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  color: #6b6b6b;
  font-size: 12px;
`;

  idea,
  actions,
  openButton,
  showDate = true,
}) {
  return (
    <CardContent>
      {actions}
      <IdeaTitle>{idea.title}</IdeaTitle>
      <IdeaDesc>{idea.description || ''}</IdeaDesc>
      {openButton && (
        <OpenButtonWrap $isVisible={true}>{openButton}</OpenButtonWrap>
      )}
      {showDate && (
        <Row>
          <span>
            {new Date(idea.createdAt || Date.now()).toLocaleDateString()}
          </span>
        </Row>
      )}
    </CardContent>
  );
}
