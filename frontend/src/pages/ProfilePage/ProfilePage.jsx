// this is the profile page for the user!!
import React from 'react';
import styled from 'styled-components';
import MyIdeasSection from './components/MyIdeasSection';
import LikedIdeasSection from './components/LikedIdeasSection';
import ConnectionsSection from './components/ConnectionsSection';
import { useAuthStore } from '../../store/useAuthStore';
import ProfileSettingsSection from './components/ProfileSettingsSection';

// Container pinned to the right using global overlay rules
const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  /* Remove overflow-y: auto to prevent double scrollbars */
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 0;
  border-bottom: 1px solid #eee;
  margin-bottom: 8px;
`;

const LoggedInText = styled.span`
  font-size: 14px;
  color: #666;
`;

const Username = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

// The content sections below are now split into dedicated components.

const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <Page>
      <UserInfo>
        <LoggedInText>Logged in:</LoggedInText>
        <Username>{user?.fullName || user?.firstName || 'User'}</Username>
      </UserInfo>
      <MyIdeasSection />
      <LikedIdeasSection />
      <ConnectionsSection />
      <ProfileSettingsSection />
    </Page>
  );
};

export default ProfilePage;
