import React from 'react';
import styled from 'styled-components';
import { responsiveContainer } from '../../styles/breakpoints';

const RegisterContainer = styled.div`
  ${responsiveContainer}
  background-color: #e0f2f1;
  justify-content: center;
  align-items: center;
`;

const RegisterPage = () => {
  return (
    <RegisterContainer>
      <h1>Register</h1>
      <p>This is a placeholder for the registration page.</p>
      <p>Registration form will be displayed here.</p>
    </RegisterContainer>
  );
};

export default RegisterPage;
