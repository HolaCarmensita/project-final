import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import SectionHeader from '../../components/SectionHeader';
import StackedIdeaCards from '../../components/StackedIdeaCards';
import ColorIdeaCard from '../../components/ColorIdeaCard';
import OpenIdeaButton from '../../components/OpenIdeaButton';
import UnstackToggleButton from '../../components/UnstackToggleButton';
import { useUsersStore } from '../../store/useUsersStore';
import { useIdeasStore } from '../../store/useIdeasStore';
import { useAuthStore } from '../../store/useAuthStore';

const Page = styled.div`
  padding: 32px 18px 32px 18px;
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

const LoadingMessage = styled.div`
  text-align: center;
  color: #666;
  padding: 40px 20px;
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: #d32f2f;
  padding: 40px 20px;
`;

export default function UserProfilePage() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [unstacked, setUnstacked] = useState(false);
  const [userIdeas, setUserIdeas] = useState([]);

  // Get current user for comparison
  const currentUser = useAuthStore((state) => state.user);
  const isOwnProfile = currentUser?._id === userId;

  // Get user data from UsersStore
  const fetchUserById = useUsersStore((state) => state.fetchUserById);
  const isLoading = useUsersStore((state) => state.isLoading);
  const error = useUsersStore((state) => state.error);

  // Get ideas from IdeasStore
  const ideas = useIdeasStore((state) => state.ideas);

  // Fetch user data when component mounts
  useEffect(() => {
    if (userId) {
      fetchUserById(userId);
    }
  }, [userId, fetchUserById]);

  // Filter ideas for this user when ideas or userId changes
  useEffect(() => {
    if (ideas.length > 0 && userId) {
      const filteredIdeas = ideas.filter((idea) => 
        idea.creator?._id === userId || idea.creatorId === userId
      );
      setUserIdeas(filteredIdeas);
    }
  }, [ideas, userId]);

  // Show loading state
  if (isLoading) {
    return (
      <Page>
        <TopBar>
          <BackBtn aria-label="Back" onClick={() => navigate(-1)}>
            &#x2039; Back
          </BackBtn>
        </TopBar>
        <LoadingMessage>Loading user profile...</LoadingMessage>
      </Page>
    );
  }

  // Show error state
  if (error) {
    return (
      <Page>
        <TopBar>
          <BackBtn aria-label="Back" onClick={() => navigate(-1)}>
            &#x2039; Back
          </BackBtn>
        </TopBar>
        <ErrorMessage>Error loading profile: {error}</ErrorMessage>
      </Page>
    );
  }

  // Get user data from the store (this would need to be implemented in UsersStore)
  // For now, we'll use a placeholder approach
  const profileUser = {
    _id: userId,
    fullName: 'Loading...',
    role: 'User',
    bio: 'User bio will be loaded from API',
  };

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
          <UserName>{profileUser.fullName}</UserName>
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
                <OpenIdeaButton ideaId={idea._id || idea.id} to={`/ideas/${idea._id || idea.id}`} title={idea.title} />
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
