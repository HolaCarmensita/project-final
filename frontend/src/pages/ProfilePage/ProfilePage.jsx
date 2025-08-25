import React from 'react';
import styled from 'styled-components';
import MyIdeasSection from './components/MyIdeasSection';
import LikedIdeasSection from './components/LikedIdeasSection';
import ConnectionsSection from './components/ConnectionsSection';
import { useIdeasStore } from '../../store/useIdeasStore';
import ProfileSettingsSection from './components/ProfileSettingsSection';

// Container pinned to the right using global overlay rules
const Page = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

// The content sections below are now split into dedicated components.

const ProfilePage = () => {
  const connections = useIdeasStore((s) => s.connections);

  return (
    <Page>
      <MyIdeasSection />
      <LikedIdeasSection />
      <ConnectionsSection connections={connections} />
      <ProfileSettingsSection />
    </Page>
  );
};

export default ProfilePage;
