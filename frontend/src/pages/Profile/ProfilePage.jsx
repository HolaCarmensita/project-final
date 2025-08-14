import React from 'react';
import styled from 'styled-components';
import { responsiveContainer } from '../../styles/breakpoints';

const ProfileContainer = styled.div`
  ${responsiveContainer}
  background-color: #f8f9fa;
`;

const ProfilePage = () => {
  return (
    <ProfileContainer>
      <h1>Profile Page</h1>
      <p>This is a placeholder for the main profile page.</p>
      <p>Navigation to sub-routes will be added here.</p>
    </ProfileContainer>
  );
};

export default ProfilePage;
