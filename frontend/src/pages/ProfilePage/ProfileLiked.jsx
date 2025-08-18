import React from 'react';
import styled from 'styled-components';

const ProfileLikedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  height: 100%;
  background-color: white;
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
