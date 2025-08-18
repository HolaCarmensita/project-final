import React from 'react';
import styled from 'styled-components';
import { useIdeasStore } from '../../store/useIdeasStore';
import StackedIdeaCards from './components/StackedIdeaCards';

const Box = styled.div`
  background: #fff;
  height: 100vh;
  padding: 16px;
  position: relative !important;
  top: 0 !important;
`;

export default function ProfileIdeas() {
  const ideas = useIdeasStore((s) => s.ideas);
  return (
    <Box className="modal-container active">
      <h2 style={{ marginBottom: 12 }}>All my ideas</h2>
      <StackedIdeaCards ideas={ideas} stacked={false} />
    </Box>
  );
}
