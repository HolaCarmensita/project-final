// this is the profile page for the user!!
import React from 'react';
import styled from 'styled-components';
import PageHeader from '../../components/PageHeader';
import MyIdeasSection from './components/MyIdeasSection';
import LikedIdeasSection from './components/LikedIdeasSection';
import ConnectionsSection from './components/ConnectionsSection';
import { useUserStore } from '../../store/useUserStore';
import ProfileSettingsSection from './components/ProfileSettingsSection';

// Container pinned to the right using global overlay rules
const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  /* Remove overflow-y: auto to prevent double scrollbars */
`;

// The content sections below are now split into dedicated components.

const ProfilePage = () => {
  const user = useUserStore((state) => state.user);

  return (
    <Page>
      <PageHeader title='Profile' user={user} />
      <MyIdeasSection />
      <LikedIdeasSection />
      <ConnectionsSection />
      <ProfileSettingsSection />
    </Page>
  );
};

export default ProfilePage;
