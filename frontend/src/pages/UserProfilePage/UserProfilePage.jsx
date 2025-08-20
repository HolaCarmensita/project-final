import React from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import SectionHeader from '../../components/SectionHeader';
import StackedIdeaCards from '../../components/StackedIdeaCards';
import ColorIdeaCard from '../../components/ColorIdeaCard';
import OpenIdeaButton from '../../components/OpenIdeaButton';
import UnstackToggleButton from '../../components/UnstackToggleButton';
import lightbulbIcon from '../../assets/icons/at.svg';

const Page = styled.div`
  /* max-width: 420px; */
  /* margin: 0 auto; */
  padding: 32px 18px 32px 18px;
  /* background: #fff; */
  /* min-height: 100vh; */
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
  const [unstacked, setUnstacked] = React.useState(false);

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
          <SectionHeader title="ideas" count={mockIdeas.length} />
          <UnstackToggleButton unstacked={unstacked} onClick={() => setUnstacked((v) => !v)} />
        </div>
        <StackedIdeaCards
          ideas={mockIdeas}
          renderContent={(idea) => (
            <ColorIdeaCard
              idea={idea}
              openButton={
                <OpenIdeaButton ideaId={idea.id} to={`/ideas/${idea.id}`} title={idea.title} />
              }
              showDate={true}
            />
          )}
          unstacked={unstacked}
        />
      </IdeasSection>
    </Page>
  );
}
