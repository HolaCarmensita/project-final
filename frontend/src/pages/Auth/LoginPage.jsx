import React from 'react';
import styled from 'styled-components';

const LoginContainer = styled.div`
  background-color: white;
  width: 100%;
  height: 100%;
  padding: 16px;
`;

const LoginPage = () => {
  return (
    <LoginContainer>
      <h1>Login</h1>
      <p>This is a placeholder for the login page.</p>
      <p>Login form will be displayed here.</p>
    </LoginContainer>
  );
};

export default LoginPage;
