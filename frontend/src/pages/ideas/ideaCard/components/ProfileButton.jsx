import React from 'react';
import styled from 'styled-components';

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 16px 0px 16px 0px;
  border-radius: 8px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const Circle = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #6c757d;
  flex-shrink: 0;
`;

const TextContainer = styled.div``;

const Name = styled.h3`
  color: #333;
  line-height: 1.2;
`;

const Role = styled.h4`
  font-weight: 400;
  color: #666;
  line-height: 1.2;
`;

const ProfileButton = ({ onClick = () => {} }) => {
  const handleClick = () => {
    // Redirect to profile page (to be implemented)
    onClick();
    // You can add navigation logic here later
    // Example: navigate('/profile');
  };

  return (
    <ProfileContainer onClick={handleClick}>
      <Circle />
      <TextContainer>
        <Name>John Doe</Name>
        <Role>Designer</Role>
      </TextContainer>
    </ProfileContainer>
  );
};

export default ProfileButton;
