import React from 'react';
import styled from 'styled-components';
import { responsiveContainer } from '../../styles/breakpoints';

const Box = styled.div`
  background: #fff;
  height: 100vh;
  padding: 16px;
  ${responsiveContainer}
`;

export default function ProfileIdeas() {
  return (
    <Box>
      <h2>My Ideas</h2>
      <p>Coming soon…</p>
    </Box>
  );
}
