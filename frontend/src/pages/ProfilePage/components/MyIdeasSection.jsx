import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import editIcon from '../../../assets/icons/edit_square_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.svg';
import deleteIcon from '../../../assets/icons/delete_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.svg';
import { useIdeasStore } from '../../../store/useIdeasStore';
import SectionHeader from '../../../components/SectionHeader';
import OpenIdeaButton from '../../../components/OpenIdeaButton';
import CardActions from '../../../components/CardActions';
import IconButton from '../../../components/IconButton';

const Section = styled.section`
  margin-bottom: 60px;
`;

// SectionHeader moved to a shared component

const StackWrap = styled.div`
  position: relative;
`;

const StackCard = styled.div`
  position: relative;
  border-radius: 16px;
  padding: 16px;
  color: #121212;
  border: 1px solid rgba(0,0,0,0.08);
  background: ${(p) => p.bg || '#f2f2f2'};
  display: flex;
  flex-direction: column;
  cursor: default;
  &:hover { cursor: pointer; }
  &:hover * { cursor: pointer !important; }
  transform: ${(p) => {
    const baseY = typeof p.offset === 'number' ? p.offset : 0;
    if (p.unstacked) return p.popped ? 'translateY(0) scale(1.02)' : 'translateY(0)';
    return p.popped ? `translateY(${baseY}px) scale(1.02)` : `translateY(${baseY}px)`;
  }};
  box-shadow: ${(p) => (p.popped
    ? '0 18px 36px rgba(0,0,0,0.20), 0 8px 16px rgba(0,0,0,0.12)'
    : p.unstacked
      ? '0 4px 12px rgba(0,0,0,0.06)'
      : p.top
        ? '0 8px 18px rgba(0,0,0,0.08)'
        : 'none')};
  z-index: ${(p) => (p.popped ? 1000 : (p.z || 1))};
  overflow: hidden;
  margin-top: ${(p) => (p.isFirst ? 0 : p.unstacked ? 12 : -120)}px;
  @media (min-width: 768px) {
    margin-top: ${(p) => (p.isFirst ? 0 : p.unstacked ? 16 : -168)}px;
    aspect-ratio: 5 / 3;
    min-height: 220px;
  }
  @media (min-width: 1024px) {
    margin-top: ${(p) => (p.isFirst ? 0 : p.unstacked ? 16 : -208)}px;
    aspect-ratio: 16 / 9;
    min-height: 260px;
  }
  transition: transform 260ms cubic-bezier(0.2, 0.8, 0.2, 1), margin-top 260ms cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 220ms ease;
`;

// CardActions and IconButton are shared components

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  margin-top: 0;
`;
const IdeaTitle = styled.h4`
  font-size: 20px; font-weight: 700; line-height: 1.2; margin: 0 0 4px; color: #0f0f0f;
`;
const IdeaDesc = styled.p`
  font-size: 16px; line-height: 1.35; margin: 6px 0 14px; color: #111; display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis;
  @media (min-width: 768px) { -webkit-line-clamp: 3; line-clamp: 3; }
`;
// OpenIdeaButton is shared; we only adjust margin for layout
const OpenButtonWrap = styled.div`
  align-self: flex-end;
  margin-top: auto;
`;
const Row = styled.div`
  display: flex; align-items: center; justify-content: space-between; margin-top: 16px; color: #6b6b6b; font-size: 12px;
`;

export default function MyIdeasSection() {
  const navigate = useNavigate();
  const ideas = useIdeasStore((s) => s.ideas);
  const deleteIdea = useIdeasStore((s) => s.deleteIdea);
  const myIdeas = useMemo(() => ideas.filter(i => i.author === 'You'), [ideas]);

  const [unstack, setUnstack] = useState(false);
  const [poppedIdx, setPoppedIdx] = useState(null);

  return (
    <Section>
      <SectionHeader
        title="My ideas"
        count={myIdeas.length}
        isExpanded={unstack}
        onToggle={() => { setUnstack((v) => { const next = !v; if (next) setPoppedIdx(null); return next; }); }}
      />

      <StackWrap>
        {myIdeas.map((idea, idx) => {
          const isLast = idx === myIdeas.length - 1;
          const isFirst = idx === 0;
          const popped = !unstack && poppedIdx === idx;
          return (
            <StackCard
              key={idea.id}
              z={idx + 1}
              offset={idx * 4}
              isFirst={isFirst}
              unstacked={unstack}
              popped={popped}
              bg={idea.orbColor || '#f2f2f2'}
              top={!unstack && !popped && isLast}
              onClick={() => setPoppedIdx((cur) => (cur === idx ? null : idx))}
            >
              <CardActions>
                <IconButton
                  aria-label="Edit idea"
                  title="Edit"
                  iconSrc={editIcon}
                  onClick={(e) => { e.stopPropagation(); navigate(`/profile/my-idea/${idea.id}`); }}
                />
                <IconButton
                  aria-label="Delete idea"
                  title="Delete"
                  iconSrc={deleteIcon}
                  onClick={(e) => { e.stopPropagation(); deleteIdea(idea.id); }}
                />
              </CardActions>

              <CardContent>
                <IdeaTitle>{idea.title}</IdeaTitle>
                <IdeaDesc>{idea.bodyText || ''}</IdeaDesc>
                <OpenButtonWrap>
                  <OpenIdeaButton ideaId={idea.id} to={`/profile/my-idea/${idea.id}`} title={idea.title} />
                </OpenButtonWrap>
                <Row>
                  <span>{new Date(idea.createdAt || Date.now()).toLocaleDateString()}</span>
                </Row>
              </CardContent>
            </StackCard>
          );
        })}
      </StackWrap>
    </Section>
  );
}
