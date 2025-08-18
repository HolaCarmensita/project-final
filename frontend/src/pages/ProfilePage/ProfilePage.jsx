import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import arrowIcon from '../../assets/icons/arrow_forward.svg';
import moreIcon from '../../assets/icons/more_vert.svg';
import { useIdeasStore } from '../../store/useIdeasStore';
import { responsiveContainer } from '../../styles/breakpoints';

// Container pinned to the right using global overlay rules
const Page = styled.div`
  background: #fff;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 16px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  ${responsiveContainer}
  overflow-y: auto;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 8px;
  border-bottom: 2px solid #e9e9e9;
  margin-bottom: 12px;
`;

const LogoText = styled.div`
  font-size: 28px;
  font-weight: 600;
`;

const Section = styled.section`
  margin-bottom: 20px;
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
`;

// Stacked colorful idea previews (purely visual)
const StackWrap = styled.div`
  position: relative;
  padding: 12px 12px 22px;
  background: #f7f7f7;
  border-radius: 12px;
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

const ProfilePage = () => {
  const ideas = useIdeasStore((s) => s.ideas);
  const myIdeas = ideas.slice(0, 5);
  const likedIdeas = ideas.slice(1, 4);

  const connections = [
    {
      name: 'Mary Smith',
      role: 'UX Designer',
      note: 'Working on a idea together.',
      color: '#C9F46C',
    },
    { name: 'Tom Brown', role: 'Teacher', note: 'Working on a idea together.', color: '#F3B7B5' },
    { name: 'Emma Johnson', role: 'Designer', note: 'Co-designing user interfaces.', color: '#224EA0' },
  ];

  return (
    <Page>
      <TopBar>
        <LogoText>OurLogo</LogoText>
        <img src={moreIcon} alt="menu" width={20} height={20} />
      </TopBar>

      {/* My ideas */}
      <Section>
        <SectionHeader>
          <h3>
            My ideas <span className="count">({myIdeas.length})</span>
          </h3>
          <Link to="/profile/ideas">See all</Link>
        </SectionHeader>
        <StackWrap>
          {myIdeas.map((idea, idx) => (
            <StackCard
              key={idea.id}
              z={idx + 1}
              offset={idx * 8}
              bg={`linear-gradient(180deg, ${idea.orbColor} 0%, ${idea.auraColor} 100%)`}
              top={idx === myIdeas.length - 1}
            >
              {idx === myIdeas.length - 1 ? (
                <>
                  <IdeaTitle>{idea.title}</IdeaTitle>
                  <OpenButton as={Link} to={`/ideas/${idea.id}`}>
                    OPEN IDEA <img src={arrowIcon} width={14} height={14} alt="open" />
                  </OpenButton>
                  <Row>
                    <span>✦</span>
                    <span>{new Date(idea.createdAt || Date.now()).toLocaleDateString()}</span>
                  </Row>
                </>
              ) : (
                <IdeaTitle style={{ opacity: 0.85 }}>{idea.title}</IdeaTitle>
              )}
            </StackCard>
          ))}
        </StackWrap>
      </Section>

      {/* Liked ideas */}
      <Section>
        <SectionHeader>
          <h3>
            Liked ideas <span className="count">({likedIdeas.length})</span>
          </h3>
        </SectionHeader>
        <StackWrap>
          {likedIdeas.map((idea, idx) => (
            <StackCard
              key={idea.id}
              z={idx + 1}
              offset={idx * 8}
              bg={`linear-gradient(180deg, ${idea.orbColor} 0%, ${idea.auraColor} 100%)`}
              top={idx === likedIdeas.length - 1}
            >
              {idx === likedIdeas.length - 1 ? (
                <>
                  <IdeaTitle>{idea.title}</IdeaTitle>
                  <OpenButton as={Link} to={`/ideas/${idea.id}`}>
                    OPEN IDEA <img src={arrowIcon} width={14} height={14} alt="open" />
                  </OpenButton>
                  <Row>
                    <span>✦</span>
                    <span>{new Date(idea.createdAt || Date.now()).toLocaleDateString()}</span>
                  </Row>
                </>
              ) : (
                <IdeaTitle style={{ opacity: 0.85 }}>{idea.title}</IdeaTitle>
              )}
            </StackCard>
          ))}
        </StackWrap>
      </Section>

      {/* Connections */}
      <Section>
        <SectionHeader>
          <h3>
            My Connections <span className="count">(10)</span>
          </h3>
          <Link to="/profile/connections">See all</Link>
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
          <textarea rows={3} defaultValue={"Lorem Ipsum è un testo segnaposto."} />
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
