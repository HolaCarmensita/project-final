import React from 'react';
import styled from 'styled-components';
import { responsiveContainer } from '../../styles/breakpoints';

const ProfileIdeasContainer = styled.div`
  ${responsiveContainer}
  background-color: #e3f2fd;
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
