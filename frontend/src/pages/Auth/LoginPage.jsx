import React from 'react';
import styled from 'styled-components';
import { responsiveContainer } from '../../styles/breakpoints';

const LoginContainer = styled.div`
  ${responsiveContainer}
  background-color: #fce4ec;
  justify-content: center;
  align-items: center;
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
