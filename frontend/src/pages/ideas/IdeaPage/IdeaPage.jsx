import React from 'react';
import styled from 'styled-components';
import IdeaCard from '../ideaCard/IdeaCard';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useIdeasStore } from '../../../store/useIdeasStore';
import { useUIStore } from '../../../store/useUIStore';

const IdeaPageContainer = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
`;

const IdeaPage = () => {
  const { id } = useParams();
  const ideas = useIdeasStore((state) => state.ideas);
  const selectedIndex = useUIStore((state) => state.selectedIndex);
  const setSelectedIndex = useUIStore((state) => state.setSelectedIndex);

  useEffect(() => {
    if (ideas.length && id) {
      const idx = ideas.findIndex((i) => i.id === Number(id));
      if (idx >= 0) setSelectedIndex(idx);
    }
  }, [ideas, id, setSelectedIndex]);

  return (
    <IdeaPageContainer>
      {ideas.length > 0 ? (
        <>
          <IdeaCard idea={ideas[selectedIndex]} />
          {/* <MockNavigation onNext={goToNext} onPrevious={goToPrevious} /> */}
        </>
      ) : (
        <p>No ideas available.</p>
      )}
    </IdeaPageContainer>
  );
};

export default IdeaPage;
