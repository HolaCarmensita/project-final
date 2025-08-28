import React from 'react';
import styled from 'styled-components';

const PageHeaderContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 0 16px 0;
  border-bottom: 1px solid #eee;
  margin-bottom: 24px;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #333;
`;

const UserInfo = styled.div`
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LoggedInText = styled.span`
  font-size: 14px;
  color: #666;
`;

const Username = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

const PageHeader = ({ title, user }) => {
  const hasUserInfo = user && (user.fullName || user.firstName);

  return (
    <PageHeaderContainer>
      <PageTitle>{title}</PageTitle>
      {hasUserInfo && (
        <UserInfo>
          <LoggedInText>Logged in:</LoggedInText>
          <Username>{user.fullName || user.firstName || 'User'}</Username>
        </UserInfo>
      )}
    </PageHeaderContainer>
  );
};

export default PageHeader;
