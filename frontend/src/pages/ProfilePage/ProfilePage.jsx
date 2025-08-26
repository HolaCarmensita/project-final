// this is the profile page for the user!!
import React from 'react';
import styled from 'styled-components';
import MyIdeasSection from './components/MyIdeasSection';
import LikedIdeasSection from './components/LikedIdeasSection';
import ConnectionsSection from './components/ConnectionsSection';
import MyConnectionsSection from './components/MyConnectionsSection';
import { useAuthStore } from '../../store/useAuthStore';
import ProfileSettingsSection from './components/ProfileSettingsSection';

// Container pinned to the right using global overlay rules
const Page = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  /* Remove overflow-y: auto to prevent double scrollbars */
`;

// The content sections below are now split into dedicated components.

const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <Page>
      <MyIdeasSection />
      <LikedIdeasSection />
      <MyConnectionsSection />
      <ConnectionsSection />
      <ProfileSettingsSection />
    </Page>
  );
};

export default ProfilePage;
