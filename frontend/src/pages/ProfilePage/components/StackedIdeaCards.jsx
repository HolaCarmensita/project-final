import React from 'react';
import styled from 'styled-components';
import OpenIdeaButton from '../../../components/OpenIdeaButton';
import { useIdeasStore } from '../../../store/useIdeasStore';

const StackWrap = styled.div`
  position: relative;
`;

const StackCard = styled.div`
  position: relative;
  border-radius: 16px;
  padding: 16px;
  color: #121212;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: ${(p) => p.bg || '#e5f3ff'};
  transform: translateY(${(p) => p.offset || 0}px);
  box-shadow: ${(p) => (p.top ? '0 8px 18px rgba(0,0,0,0.08)' : 'none')};
  z-index: ${(p) => p.z || 1};
  margin-top: -40px;

  &:first-child {
    margin-top: 0;
  }
`;

const IdeaTitle = styled.h4`
  font-size: 18px;
  line-height: 1.2;
  margin-bottom: 12px;
`;

// Open button now uses shared component; keep a wrapper only if we need custom layout.

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
export default function StackedIdeaCards({
  ideas = [],
  showFooter = true,
  linkBuilder = (id) => `/ideas/${id}`,
}) {
  const storeIdeas = useIdeasStore((s) => s.ideas);
  return (
    <StackWrap>
      {ideas.map((idea, idx) => (
        <StackCard
          key={idea._id}
          z={idx + 1}
          offset={idx * 8}
          bg={`linear-gradient(180deg, ${idea.orbColor} 0%, ${idea.auraColor} 100%)`}
          top={idx === ideas.length - 1}
        >
          {idx === ideas.length - 1 ? (
            <>
              <IdeaTitle $delay={idx}>{idea.title}</IdeaTitle>
              <OpenIdeaButton
                ideaId={idea._id}
                to={linkBuilder(idea._id)}
                title={idea.title}
                variant='outlined'
                style={{ padding: '8px 12px', fontSize: 14 }}
              />
              {showFooter && (
                <Row $delay={idx}>
                  <span>
                    {new Date(
                      idea.createdAt || Date.now()
                    ).toLocaleDateString()}
                  </span>
                </Row>
              )}
            </>
          ) : (
            <IdeaTitle style={{ opacity: 0.85 }} $delay={idx}>
              {idea.title}
            </IdeaTitle>
          )}
        </StackCard>
      ))}
    </StackWrap>
  );
}
