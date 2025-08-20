import React from 'react';
import styled from 'styled-components';
import MyIdeasSection from './components/MyIdeasSection';
import LikedIdeasSection from './components/LikedIdeasSection';
import ConnectionsSection from './components/ConnectionsSection';
import ProfileSettingsSection from './components/ProfileSettingsSection';

// Container pinned to the right using global overlay rules
const Page = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 16px;
  overflow-y: auto;
`;

// The content sections below are now split into dedicated components.

const ProfilePage = () => {
  const connections = [
    { name: 'Mary Smith', role: 'UX Designer', note: 'Working on a idea together.', color: '#C9F46C' },
    { name: 'Tom Brown', role: 'Teacher', note: 'Working on a idea together.', color: '#F3B7B5' },
    { name: 'Emma Johnson', role: 'Designer', note: 'Co-designing user interfaces.', color: '#224EA0' },
  ];

  return (
    <Page className="modal-container active">
      <MyIdeasSection />
      <LikedIdeasSection />
      <ConnectionsSection connections={connections} />
      <ProfileSettingsSection />
    </Page>
  );
};

export default ProfilePage;
