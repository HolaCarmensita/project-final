import React from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import SectionHeader from '../../components/SectionHeader';
import IdeaCard from '../ideas/ideaCard/IdeaCard';
import lightbulbIcon from '../../assets/icons/at.svg';

const Page = styled.div`
  max-width: 420px;
  margin: 0 auto;
  padding: 32px 18px 32px 18px;
  background: #fff;
  min-height: 100vh;
`;
const TopBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
`;
const BackBtn = styled.button`
  background: none;
  border: none;
  font-size: 26px;
  color: #232323;
  cursor: pointer;
`;
const UserRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
`;
const Avatar = styled.div`
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: #d46a8c;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;
const UserName = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: #232323;
`;
const UserRole = styled.div`
  font-size: 16px;
  color: #888;
`;
const UserDetails = styled.div`
  font-size: 18px;
  color: #232323;
  margin-bottom: 24px;
`;
const IdeasSection = styled.div`
  margin-top: 18px;
`;
const StackWrap = styled.div`
  position: relative;
`;

const StackCard = styled.div`
  position: relative;
  border-radius: 28px;
  padding: 24px 20px 32px 20px;
  color: #121212;
  background: ${(p) => p.bg || '#f2f2f2'};
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  margin-top: ${(p) => (p.isFirst ? 0 : -60)}px;
  z-index: ${(p) => (p.z || 1)};
  overflow: hidden;
  transition: margin-top 220ms cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 220ms ease;
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;
const IdeaTitle = styled.h4`
  font-size: 20px; font-weight: 700; line-height: 1.2; margin: 0 0 4px; color: #0f0f0f;
`;
const OpenButtonWrap = styled.div`
  align-self: flex-end;
  margin-top: auto;
`;
const Row = styled.div`
  display: flex; align-items: center; justify-content: space-between; margin-top: 16px; color: #6b6b6b; font-size: 12px;
`;

const mockIdeas = [
  {
    id: 1,
    title: 'Lorem Ipsum è un testo segnaposto.',
    bodyText: 'Lorem Ipsum è un testo segnaposto.',
    orbColor: '#a6b8ff',
    createdAt: '2 feb 2021',
  },
  {
    id: 2,
    title: 'Lorem Ipsum è un testo segnaposto.',
    bodyText: 'Lorem Ipsum è un testo segnaposto.',
    orbColor: '#e47c6a',
    createdAt: '2 feb 2021',
  },
  {
    id: 3,
    title: 'Lorem Ipsum è un testo segnaposto.',
    bodyText: 'Lorem Ipsum è un testo segnaposto.',
    orbColor: '#d6ff8a',
    createdAt: '2 feb 2021',
  },
];

export default function UserProfilePage() {
  const navigate = useNavigate();
  const { userId } = useParams();

  return (
    <Page>
      <TopBar>
        <BackBtn aria-label="Back" onClick={() => navigate(-1)}>
          &#x2039; Back
        </BackBtn>
      </TopBar>

      <UserRow>
        <Avatar />
        <UserInfo>
          <UserName>Mary Smith</UserName>
          <UserRole>Designer</UserRole>
        </UserInfo>
      </UserRow>

      <UserDetails>
        Here add text details of the user... etc
      </UserDetails>

      <IdeasSection>
        <SectionHeader title="ideas" count={mockIdeas.length} />
        <StackWrap>
          {mockIdeas.map((idea, idx) => (
            <StackCard key={idea.id} bg={idea.orbColor} isFirst={idx === 0} z={mockIdeas.length - idx}>
              <CardContent>
                <IdeaTitle>{idea.title}</IdeaTitle>
                <OpenButtonWrap>
                  <button style={{
                    background: '#232323',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '8px 18px',
                    fontWeight: 500,
                    fontSize: 15,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer',
                  }}>
                    OPEN IDEA <img src={lightbulbIcon} alt="icon" style={{ width: 18, height: 18 }} />
                  </button>
                </OpenButtonWrap>
                <Row>
                  <span><img src={lightbulbIcon} alt="icon" style={{ width: 18, height: 18, marginRight: 6 }} /></span>
                  <span>{idea.createdAt}</span>
                </Row>
              </CardContent>
            </StackCard>
          ))}
        </StackWrap>
      </IdeasSection>
    </Page>
  );
}
