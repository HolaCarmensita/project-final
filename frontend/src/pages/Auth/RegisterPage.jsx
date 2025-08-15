import React from 'react';
import styled from 'styled-components';

const RegisterContainer = styled.div`
  background-color: white;
  width: 100%;
  height: 100%;
  padding: 16px;
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
