import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
// import moreIcon from '../../assets/icons/more_vert.svg';
import arrowIcon from '../../assets/icons/arrow_forward.svg';
import { useIdeasStore } from '../../store/useIdeasStore';

// Container pinned to the right using global overlay rules
const Page = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 16px;
  overflow-y: auto;
`;

const Section = styled.section`
  margin-bottom: 60px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 10px;

  h3 {
    font-size: 18px;
    font-weight: 600;
  }

  .count {
    color: #6b6b6b;
    font-weight: 400;
    margin-left: 6px;
    font-size: 14px;
  }

  a {
    color: #232323;
    text-decoration: none;
    font-size: 14px;
  }

  /* Button styled like a link for the toggle */
  button.linklike {
    color: #232323;
    background: transparent;
    border: 0;
    padding: 0;
    font-size: 14px;
    cursor: pointer;
    text-decoration: none;
  }
`;

// Stacked colorful idea previews (purely visual)
const StackWrap = styled.div`
  position: relative;
`;

// Replace StackCard with this version (no collapsed logic; heavy overlap)
const StackCard = styled.div`
  position: relative;
  border-radius: 16px;
  padding: 16px;
  color: #121212;
  border: 1px solid rgba(0,0,0,0.08);
  background: ${(p) => p.bg || '#e5f3ff'};
  display: flex;
  flex-direction: column;

  transform: ${(p) => {
    const baseY = typeof p.offset === 'number' ? p.offset : 0;
    if (p.unstacked) {
      return p.popped ? 'translateY(0) scale(1.02)' : 'translateY(0)';
    }
    return p.popped ? `translateY(${baseY}px) scale(1.02)` : `translateY(${baseY}px)`;
  }};
  box-shadow: ${(p) =>
    p.popped
      ? '0 18px 36px rgba(0,0,0,0.20), 0 8px 16px rgba(0,0,0,0.12)'
      : p.unstacked
        ? '0 4px 12px rgba(0,0,0,0.06)'
        : p.top
          ? '0 8px 18px rgba(0,0,0,0.08)'
          : 'none'};
  z-index: ${(p) => (p.popped ? 1000 : (p.z || 1))};
  overflow: hidden; /* keep visuals clean at tight overlap */

  /* Heavy overlap so only the title band peeks on non-top cards */
  margin-top: ${(p) => (p.isFirst ? 0 : p.unstacked ? 12 : -120)}px;

  @media (min-width: 768px) {
    /* min-height is 220px → 220 - 56 ≈ 164, rounded a bit tighter */
    margin-top: ${(p) => (p.isFirst ? 0 : p.unstacked ? 16 : -168)}px;
  }
  @media (min-width: 1024px) {
    /* min-height is 260px → 260 - 56 ≈ 204, rounded a bit tighter */
    margin-top: ${(p) => (p.isFirst ? 0 : p.unstacked ? 16 : -208)}px;
  }

  /* keep your existing larger sizing when unstacked or for the top card */
  @media (min-width: 768px) {
    aspect-ratio: 5 / 3;
    min-height: 220px;
  }
  @media (min-width: 1024px) {
    aspect-ratio: 16 / 9;
    min-height: 260px;
  }

  transition:
    transform 260ms cubic-bezier(0.2, 0.8, 0.2, 1),
    margin-top 260ms cubic-bezier(0.2, 0.8, 0.2, 1),
    box-shadow 220ms ease;
`;

// Keep CardContent simple (no special offsets)
const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  margin-top: 0;
`;

// Optionally let description breathe a bit more on larger screens
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

// Keep the button right-aligned and near the bottom
const OpenButton = styled.button`
  align-self: flex-end;
  margin-top: auto;        /* push towards bottom inside the card */
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  min-height: 40px;
  border: none;
  border-radius: 12px;
  background: #232323;
  color: #ffffff;
  font-size: 16px;
  font-weight: lighter;
  cursor: pointer;
  text-decoration: none;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  line-height: 1;
  box-shadow: 0 6px 16px rgba(0,0,0,0.16);
  transition: background-color .2s ease, box-shadow .2s ease, transform .2s ease;

  &:hover {
    background: #111111;
    box-shadow: 0 8px 20px rgba(0,0,0,0.20);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 12px rgba(0,0,0,0.16);
  }

  img {
    width: 18px;
    height: 18px;
    filter: invert(1) brightness(1.4);
    pointer-events: none;
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  color: #6b6b6b;
  font-size: 12px;
`;

const ConnectionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Person = styled.div`
  display: grid;
  grid-template-columns: 56px 1fr;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #eee;

  &:last-child { border-bottom: none; }
`;

const Avatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 8px;
  background: ${(p) => p.bg || '#ddd'};
`;

const Name = styled.div`
  font-weight: 600;
`;

const Role = styled.div`
  color: #6b6b6b;
  font-size: 14px;
`;

const Note = styled.div`
  color: #3d3d3d;
  font-size: 14px;
  /* Override layout.css .modal-container.active mobile offset */
  position: relative !important;
  top: 0 !important;
`;

const ProfileCard = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 2px solid #e9e9e9;
  margin-bottom: 10px;
`;

const Field = styled.div`
  padding: 12px 0;
  border-bottom: 1px solid #eee;

  label {
    display: block;
    color: #6b6b6b;
    font-size: 12px;
    margin-bottom: 4px;
  }

  input, textarea {
    width: 100%;
    border: none;
    outline: none;
    font-size: 16px;
    color: #111;
    background: transparent;
    resize: none;
  }
`;

const ActionsRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 12px;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 14px 16px;
  border-radius: 14px;
  border: 1px solid #232323;
  background: ${(p) => (p.primary ? '#232323' : '#fff')};
  color: ${(p) => (p.primary ? '#fff' : '#232323')};
  cursor: pointer;
  font-size: 16px;
`;

const IdeaTitle = styled.h4`
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 4px;
  color: #0f0f0f;
`;

const ProfilePage = () => {
  const [unstackMyIdeas, setUnstackMyIdeas] = useState(false);
  const [unstackLikedIdeas, setUnstackLikedIdeas] = useState(false);
  const [poppedMyIdx, setPoppedMyIdx] = useState(null);
  const [poppedLikedIdx, setPoppedLikedIdx] = useState(null);

  const ideas = useIdeasStore((s) => s.ideas);
  const myIdeas = ideas.slice(0, 5);
  const likedIdeas = ideas.slice(1, 4);

  const connections = [
    { name: 'Mary Smith', role: 'UX Designer', note: 'Working on a idea together.', color: '#C9F46C' },
    { name: 'Tom Brown', role: 'Teacher', note: 'Working on a idea together.', color: '#F3B7B5' },
    { name: 'Emma Johnson', role: 'Designer', note: 'Co-designing user interfaces.', color: '#224EA0' },
  ];

  return (
    <Page className="modal-container active">
      {/* My ideas */}
      <Section>
        <SectionHeader>
          <h3>
            My ideas <span className="count">({myIdeas.length})</span>
          </h3>
          <button
            type="button"
            className="linklike"
            onClick={() => {
              setUnstackMyIdeas((v) => {
                const next = !v;
                if (next) setPoppedMyIdx(null); // reset pop when unstacking all
                return next;
              });
            }}
            aria-expanded={unstackMyIdeas}
          >
            {unstackMyIdeas ? 'Collapse' : 'See all'}
          </button>
        </SectionHeader>
        <StackWrap>
          {myIdeas.map((idea, idx) => {
            const isLast = idx === myIdeas.length - 1; // top
            const isFirst = idx === 0;
            const popped = !unstackMyIdeas && poppedMyIdx === idx;

            return (
              <StackCard
                key={idea.id}
                z={idx + 1}
                offset={idx * 4}         // small per-card translate to keep a subtle cascade
                isFirst={isFirst}
                unstacked={unstackMyIdeas}
                popped={popped}
                bg={idea.orbColor || '#f2f2f2'}
                top={!unstackMyIdeas && !popped && isLast}
                onClick={() => setPoppedMyIdx((cur) => (cur === idx ? null : idx))}
              >
                <CardContent>
                  <IdeaTitle>{idea.title}</IdeaTitle>
                  <IdeaDesc>{idea.bodyText || ''}</IdeaDesc>
                  <OpenButton as={Link} to={`/ideas/${idea.id}`}>
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

      {/* Liked ideas */}
      <Section>
        <SectionHeader>
          <h3>
            Liked ideas <span className="count">({likedIdeas.length})</span>
          </h3>
          <button
            type="button"
            className="linklike"
            onClick={() => {
              setUnstackLikedIdeas((v) => {
                const next = !v;
                if (next) setPoppedLikedIdx(null);
                return next;
              });
            }}
            aria-expanded={unstackLikedIdeas}
          >
            {unstackLikedIdeas ? 'Collapse' : 'See all'}
          </button>
        </SectionHeader>
        <StackWrap>
          {likedIdeas.map((idea, idx) => {
            const isLast = idx === likedIdeas.length - 1;
            const isFirst = idx === 0;
            const popped = !unstackLikedIdeas && poppedLikedIdx === idx;

            return (
              <StackCard
                key={idea.id}
                z={idx + 1}
                offset={idx * 4}         // small per-card translate to keep a subtle cascade
                isFirst={isFirst}
                unstacked={unstackLikedIdeas}
                popped={popped}
                bg={idea.orbColor || '#f2f2f2'}
                top={!unstackLikedIdeas && !popped && isLast}
                onClick={() => setPoppedLikedIdx((cur) => (cur === idx ? null : idx))}
              >
                <CardContent unstacked={unstackLikedIdeas} popped={popped} top={!unstackLikedIdeas && !popped && isLast}>
                  <IdeaTitle>{idea.title}</IdeaTitle>
                  <IdeaDesc>{idea.bodyText || ''}</IdeaDesc>
                  <OpenButton as={Link} to={`/ideas/${idea.id}`}>
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

      {/* Connections */}
      <Section>
        <SectionHeader>
          <h3>
            My Connections <span className="count">(10)</span>
          </h3>
          <Link>See all</Link>
        </SectionHeader>
        <ConnectionsList>
          {connections.map((c, i) => (
            <Person key={i}>
              <Avatar style={{ background: c.color }} />
              <div>
                <Name>{c.name}</Name>
                <Role>{c.role}</Role>
                <Note>{c.note}</Note>
              </div>
            </Person>
          ))}
        </ConnectionsList>
      </Section>

      {/* Profile settings */}
      <Section>
        <SectionHeader>
          <h3>Profile settings</h3>
        </SectionHeader>
        <ProfileCard>
          <Avatar style={{ background: '#E8E8E8' }} />
          <div>
            <Name>John Doe</Name>
            <Role>Designer</Role>
          </div>
        </ProfileCard>

        <Field>
          <label>Name</label>
          <input defaultValue="John Doe" />
        </Field>
        <Field>
          <label>Username</label>
          <input defaultValue="John Doe" />
        </Field>
        <Field>
          <label>Title</label>
          <input defaultValue="Designer" />
        </Field>
        <Field>
          <label>Biography</label>
          <textarea rows={3} defaultValue={'Lorem Ipsum è un testo segnaposto.'} />
        </Field>

        <ActionsRow>
          <ActionButton primary>Log out</ActionButton>
          <ActionButton>Delete account</ActionButton>
        </ActionsRow>
      </Section>
    </Page>
  );
};

export default ProfilePage;
