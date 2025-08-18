import React from 'react';
import styled from 'styled-components';

const ProfileIdeasContainer = styled.div`
  background-color: white;
  width: 100%;
  height: 100%;
  padding: 16px;
`;

const ProfileIdeas = () => {
  return (
    <ProfileIdeasContainer>
      <h1>My Ideas</h1>
      <p>This is a placeholder for the user's created ideas.</p>
      <p>List of user's ideas will be displayed here.</p>
    </ProfileIdeasContainer>
  );
};

export default ProfileIdeas;
