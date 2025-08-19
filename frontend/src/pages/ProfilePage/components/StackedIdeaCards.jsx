import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import arrowIcon from '../../../assets/icons/arrow_forward.svg';
import { useIdeasStore } from '../../../store/useIdeasStore';

const StackWrap = styled.div`
  position: relative;
`;

const StackCard = styled.div`
  position: relative;
  border-radius: 16px;
  padding: 16px;
  color: #121212;
  border: 1px solid rgba(0,0,0,0.08);
  background: ${(p) => p.bg || '#e5f3ff'};
  transform: translateY(${(p) => p.offset || 0}px);
  box-shadow: ${(p) => (p.top ? '0 8px 18px rgba(0,0,0,0.08)' : 'none')};
  z-index: ${(p) => p.z || 1};
  margin-top: -40px;

  &:first-child { margin-top: 0; }
`;

const IdeaTitle = styled.h4`
  font-size: 18px;
  line-height: 1.2;
  margin-bottom: 12px;
`;

const OpenButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 12px;
  border: 1px solid #232323;
  background: #fff;
  cursor: pointer;
  font-size: 14px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  color: #6b6b6b;
  font-size: 12px;
`;

/**
 * StackedIdeaCards
 * props:
 * - ideas: array of ideas with id, title, orbColor, auraColor, createdAt
 * - showFooter: boolean (show date/footer on the top card)
 * - linkBuilder: (id) => string (route to open idea)
 */
export default function StackedIdeaCards({ ideas = [], showFooter = true, linkBuilder = (id) => `/ideas/${id}` }) {
  const storeIdeas = useIdeasStore((s) => s.ideas);
  return (
    <StackWrap>
      {ideas.map((idea, idx) => (
        <StackCard
          key={idea.id}
          z={idx + 1}
          offset={idx * 8}
          bg={`linear-gradient(180deg, ${idea.orbColor} 0%, ${idea.auraColor} 100%)`}
          top={idx === ideas.length - 1}
        >
          {idx === ideas.length - 1 ? (
            <>
              <IdeaTitle>{idea.title}</IdeaTitle>
              <OpenButton
                as={Link}
                to={linkBuilder(idea.id)}
                aria-label={`Open idea "${idea.title}"`}
                onClick={() => {
                  const idx = storeIdeas.findIndex((i) => i.id === idea.id);
                  if (idx >= 0) {
                    window.dispatchEvent(new CustomEvent('moveCameraToIndex', { detail: idx }));
                  }
                }}
              >
                OPEN IDEA <img src={arrowIcon} width={14} height={14} alt="open" />
              </OpenButton>
              {showFooter && (
                <Row>
                  <span>{new Date(idea.createdAt || Date.now()).toLocaleDateString()}</span>
                </Row>
              )}
            </>
          ) : (
            <IdeaTitle style={{ opacity: 0.85 }}>{idea.title}</IdeaTitle>
          )}
        </StackCard>
      ))}
    </StackWrap>
  );
}
