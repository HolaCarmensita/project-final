import React from 'react';
import styled from 'styled-components';
import { responsiveContainer } from '../../styles/breakpoints';

const ProfileLikedContainer = styled.div`
  ${responsiveContainer}
  background-color: #fff3e0;
`;

const ProfileLiked = () => {
  return (
    <ProfileLikedContainer>
      <h1>Liked Ideas</h1>
      <p>This is a placeholder for the user's liked ideas.</p>
      <p>List of liked ideas will be displayed here.</p>
    </ProfileLikedContainer>
  );
};

export default ProfileLiked;
