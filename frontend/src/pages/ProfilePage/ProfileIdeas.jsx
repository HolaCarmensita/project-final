import React from 'react';
import styled from 'styled-components';

const Box = styled.div`
  background: #fff;
  height: 100vh;
  padding: 16px;
  position: relative !important;
  top: 0 !important;
`;

export default function ProfileIdeas() {
  return (
    <Box className="modal-container active">
      <h2>My Ideas</h2>
      <p>Coming soon…</p>
    </Box>
  );
}
