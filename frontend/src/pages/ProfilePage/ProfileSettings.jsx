import React from 'react';
import styled from 'styled-components';

const Box = styled.div`
  background: #fff;
  height: 100vh;
  padding: 16px;
`;

export default function ProfileSettings() {
  return (
    <Box className="modal-container active">
      <h2>Settings</h2>
      <p>Coming soon…</p>
    </Box>
  );
}
