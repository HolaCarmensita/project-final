import React from 'react';
import styled from 'styled-components';
import { responsiveContainer } from '../../styles/breakpoints';

const ProfileSettingsContainer = styled.div`
  ${responsiveContainer}
  background-color: #e8f5e8;
`;

const ProfileSettings = () => {
  return (
    <ProfileSettingsContainer>
      <h1>Settings</h1>
      <p>This is a placeholder for the user's settings page.</p>
      <p>Settings form and options will be displayed here.</p>
    </ProfileSettingsContainer>
  );
};

export default ProfileSettings;
