import React from 'react';
import styled from 'styled-components';

const Box = styled.div`
  background: #fff;
  height: 100vh;
  padding: 16px;
  ${responsiveContainer}
`;

export default function ProfileSettings() {
  return (
    <Box>
      <h2>Settings</h2>
      <p>Coming soon…</p>
    </Box>
  );
}
