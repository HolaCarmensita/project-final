import React from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import SectionHeader from '../../components/SectionHeader';
import StackedIdeaCards from '../../components/StackedIdeaCards';
import ColorIdeaCard from '../../components/ColorIdeaCard';
import OpenIdeaButton from '../../components/OpenIdeaButton';
import UnstackToggleButton from '../../components/UnstackToggleButton';
import { mockIdeas } from '../../data/mockData';
import { users } from '../../data/mockData';

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


export default function UserProfilePage() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [unstacked, setUnstacked] = React.useState(false);

  // Get user from userId param
  const currentUserId = '1'; // Replace with auth logic if available
  const decodedParam = decodeURIComponent(userId || '');
  const profileUser =
    users.find((u) => u.id === userId) ||
    users.find((u) => u.name === decodedParam) ||
    { id: decodedParam, name: decodedParam, role: 'Member' };
  const isOwnProfile = userId === currentUserId;
  // Filter ideas authored by this user
  const userIdeas = mockIdeas.filter(idea => idea.author === profileUser.name);

  return (
    <Page>
      <TopBar>
        <BackBtn aria-label="Back" onClick={() => navigate(-1)}>
          &#x2039; Back
        </BackBtn>
      </TopBar>

      <UserRow>
        <Avatar>
          {profileUser.avatar && (
            <img src={profileUser.avatar} alt="avatar" style={{ width: '100%', borderRadius: '50%' }} />
          )}
        </Avatar>
        <UserInfo>
          <UserName>{profileUser.name}</UserName>
          <UserRole>{profileUser.role}</UserRole>
        </UserInfo>
      </UserRow>

      <UserDetails>
        {profileUser.bio}
        {profileUser.socialLinks && (
          <div style={{ marginTop: 8 }}>
            {profileUser.socialLinks.twitter && (
              <a href={profileUser.socialLinks.twitter} target="_blank" rel="noopener noreferrer" style={{ marginRight: 12 }}>
                Twitter
              </a>
            )}
            {profileUser.socialLinks.linkedin && (
              <a href={profileUser.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            )}
          </div>
        )}
        {isOwnProfile && (
          <div style={{ marginTop: 16 }}>
            <button style={{ padding: '8px 16px', borderRadius: 6, background: '#d46a8c', color: '#fff', border: 'none', cursor: 'pointer' }}>
              Edit Profile
            </button>
          </div>
        )}
      </UserDetails>

      <IdeasSection>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
          <SectionHeader title="ideas" count={userIdeas.length} />
          <UnstackToggleButton unstacked={unstacked} onClick={() => setUnstacked((v) => !v)} />
        </div>
        <StackedIdeaCards
          ideas={userIdeas}
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
