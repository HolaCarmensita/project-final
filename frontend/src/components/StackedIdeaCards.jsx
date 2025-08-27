import React, { useState } from 'react';
import styled from 'styled-components';

const StackWrap = styled.div`
  position: relative;
`;

const StackCard = styled.div`
  position: relative;
  border-radius: 16px;
  padding: 16px;
  color: #121212;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: ${(p) => p.$bg || '#f2f2f2'};
  display: flex;
  flex-direction: column;
  cursor: default;
  &:hover {
    cursor: pointer;
  }
  &:hover * {
    cursor: pointer !important;
  }
  transform: ${(p) => {
    const baseY = typeof p.$offset === 'number' ? p.$offset : 0;
    if (p.$unstacked)
      return p.$popped ? 'translateY(0) scale(1.02)' : 'translateY(0)';
    return p.$popped
      ? `translateY(${baseY}px) scale(1.02)`
      : `translateY(${baseY}px)`;
  }};
  box-shadow: ${(p) =>
    p.$popped
      ? '0 18px 36px rgba(0,0,0,0.20), 0 8px 16px rgba(0,0,0,0.12)'
      : p.$unstacked
      ? '0 4px 12px rgba(0,0,0,0.06)'
      : p.$top
      ? '0 8px 18px rgba(0,0,0,0.08)'
      : 'none'};
  z-index: ${(p) => (p.$popped ? 1000 : p.$z || 1)};
  overflow: hidden;
  margin-top: ${(p) => (p.$isFirst ? 0 : p.$unstacked ? 12 : -120)}px;
  @media (min-width: 768px) {
    margin-top: ${(p) => (p.$isFirst ? 0 : p.$unstacked ? 16 : -168)}px;
    aspect-ratio: 5 / 3;
    min-height: 220px;
  }
  @media (min-width: 1024px) {
    margin-top: ${(p) => (p.$isFirst ? 0 : p.$unstacked ? 16 : -208)}px;
    aspect-ratio: 16 / 9;
    min-height: 260px;
  }
  transition: transform 260ms cubic-bezier(0.2, 0.8, 0.2, 1),
    margin-top 260ms cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 220ms ease;
`;

export default function StackedIdeaCards({
  ideas,
  renderActions,
  renderContent,
  unstacked = false,
}) {
  const [poppedIdx, setPoppedIdx] = useState(null);

  return (
    <StackWrap>
      {ideas.map((idea, idx) => {
        const isLast = idx === ideas.length - 1;
        const isFirst = idx === 0;
        const popped = !unstacked && poppedIdx === idx;
        return (
          <StackCard
            key={idea._id}
            $z={idx + 1}
            $offset={idx * 4}
            $isFirst={isFirst}
            $unstacked={unstacked}
            $popped={popped}
            $bg={idea.orbColor || '#f2f2f2'}
            $top={!unstacked && !popped && isLast}
            onClick={() => setPoppedIdx((cur) => (cur === idx ? null : idx))}
          >
            {renderActions && renderActions(idea, idx)}
            {renderContent && renderContent(idea, idx)}
          </StackCard>
        );
      })}
    </StackWrap>
  );
}
