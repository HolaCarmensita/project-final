import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import arrowIcon from '../../../assets/icons/arrow_forward.svg';
import heartBrokenIcon from '../../../assets/icons/heart_broken.svg';
import { useIdeasStore } from '../../../store/useIdeasStore';

const Section = styled.section`
  margin-bottom: 60px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 10px;

  h3 { font-size: 18px; font-weight: 600; }
  .count { color: #6b6b6b; font-weight: 400; margin-left: 6px; font-size: 14px; }
  button.linklike { color: #232323; background: transparent; border: 0; padding: 0; font-size: 14px; cursor: pointer; text-decoration: none; }
`;

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

const CardActions = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 8px;
`;

const IconButton = styled.button`
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  box-shadow: none;
  cursor: pointer;
  padding: 0;
  img { width: 16px; height: 16px; filter: none; opacity: 0.55; transition: opacity 120ms ease-in-out; pointer-events: none; }
  &:hover img { opacity: 1; }
`;

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
const OpenButton = styled.button`
  align-self: flex-end; margin-top: auto; display: inline-flex; align-items: center; gap: 10px; padding: 10px 16px; min-height: 40px; border: none; border-radius: 12px; background: #232323; color: #ffffff; font-size: 16px; font-weight: lighter; cursor: pointer; text-decoration: none; letter-spacing: 0.02em; text-transform: uppercase; line-height: 1; box-shadow: 0 6px 16px rgba(0,0,0,0.16); transition: background-color .2s ease, box-shadow .2s ease, transform .2s ease;
  &:hover { background: #111111; box-shadow: 0 8px 20px rgba(0,0,0,0.20); transform: translateY(-1px); }
  &:active { transform: translateY(0); box-shadow: 0 4px 12px rgba(0,0,0,0.16); }
  img { width: 18px; height: 18px; filter: invert(1) brightness(1.4); pointer-events: none; }
`;
const Row = styled.div`
  display: flex; align-items: center; justify-content: space-between; margin-top: 16px; color: #6b6b6b; font-size: 12px;
`;

export default function LikedIdeasSection() {
  const ideas = useIdeasStore((s) => s.ideas);
  const likedIds = useIdeasStore((s) => s.likedIds);
  const unlikeIdea = useIdeasStore((s) => s.unlikeIdea);
  const likedIdeas = useMemo(() => ideas.filter((i) => likedIds.includes(i.id)), [ideas, likedIds]);

  const [unstack, setUnstack] = useState(false);
  const [poppedIdx, setPoppedIdx] = useState(null);

  return (
    <Section>
      <SectionHeader>
        <h3>
          Liked ideas <span className="count">({likedIdeas.length})</span>
        </h3>
        <button
          type="button"
          className="linklike"
          onClick={() => { setUnstack((v) => { const next = !v; if (next) setPoppedIdx(null); return next; }); }}
          aria-expanded={unstack}
        >
          {unstack ? 'Collapse' : 'See all'}
        </button>
      </SectionHeader>

      <StackWrap>
        {likedIdeas.map((idea, idx) => {
          const isLast = idx === likedIdeas.length - 1;
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
                  type="button"
                  aria-label="Remove like"
                  title="Remove like"
                  onClick={(e) => { e.stopPropagation(); unlikeIdea(idea.id); }}
                >
                  <img src={heartBrokenIcon} alt="Remove like" />
                </IconButton>
              </CardActions>

              <CardContent>
                <IdeaTitle>{idea.title}</IdeaTitle>
                <IdeaDesc>{idea.bodyText || ''}</IdeaDesc>
                <OpenButton
                  as={Link}
                  to={`/ideas/${idea.id}`}
                  aria-label={`Open idea "${idea.title}"`}
                  onClick={() => {
                    const idxAbs = ideas.findIndex((i) => i.id === idea.id);
                    if (idxAbs >= 0) window.dispatchEvent(new CustomEvent('moveCameraToIndex', { detail: idxAbs }));
                  }}
                >
                  OPEN IDEA <img src={arrowIcon} width={14} height={14} alt="open" />
                </OpenButton>
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
