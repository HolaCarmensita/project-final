import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  flex: 1;
  padding: 16px 20px;
  border-radius: 14px;
  border: 1px solid #232323;
  font-size: 16px;
  cursor: pointer;
  background: ${(p) => (p.$primary ? '#232323' : '#fff')};
  color: ${(p) => (p.$primary ? '#fff' : '#232323')};
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: ${(p) => (p.$primary ? '#444' : '#f5f5f5')};
  }
`;

const Button = ({ children, primary, ...rest }) => (
  <StyledButton $primary={primary} {...rest}>
    {children}
  </StyledButton>
);

export default Button;
