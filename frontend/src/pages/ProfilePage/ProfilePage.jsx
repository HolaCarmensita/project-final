import React from 'react';
import styled from 'styled-components';

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  height: 100%;
  background-color: white !important;
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
