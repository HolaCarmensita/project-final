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

  &:focus {
    outline: 2px solid #007bff;
    outline-offset: 2px;
    background-color: rgba(0, 123, 255, 0.05);
  }

  &:focus-visible {
    outline: 2px solid #007bff;
    outline-offset: 2px;
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

const ProfileButton = ({
  author = 'unknown member',
  role = 'unknown role',
}) => {
  const handleClick = () => {
    console.log('Profile clicked!'); //redirect to profile page later on
  };

  return (
    <ProfileContainer
      onClick={handleClick}
      tabIndex={1}
      role='button'
      aria-label={`View profile of ${author}, ${role}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <Circle />
      <TextContainer>
        <Name>{author}</Name>
        <Role>{role}</Role>
      </TextContainer>
    </ProfileContainer>
  );
};

export default ProfileButton;
