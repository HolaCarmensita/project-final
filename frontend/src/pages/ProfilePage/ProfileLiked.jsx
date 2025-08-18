import React from 'react';
import styled from 'styled-components';
import { responsiveContainer } from '../../styles/breakpoints';

const Box = styled.div`
  background: #fff;
  height: 100vh;
  padding: 16px;
  ${responsiveContainer}
`;

export default function ProfileLiked() {
  return (
    <Box>
      <h2>Liked Ideas</h2>
      <p>Coming soon…</p>
    </Box>
  );
}
