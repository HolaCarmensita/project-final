import React from 'react';
import styled from 'styled-components';
import IdeaCard from '../ideaCard/IdeaCard';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useIdeasStore } from '../../../store/useIdeasStore';

const IdeaPageContainer = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  height: 100%;
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  transition: opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1);
`;

const IdeaPage = () => {
  const { id } = useParams();
  const ideas = useIdeasStore((state) => state.ideas);
  const selectedIndex = useIdeasStore((state) => state.selectedIndex);
  const setSelectedIndex = useIdeasStore((state) => state.setSelectedIndex);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    const timer = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(timer);
  }, [id, selectedIndex]);

  useEffect(() => {
    if (ideas.length && id) {
      const idx = ideas.findIndex((i) => i.id === Number(id));
      if (idx >= 0) setSelectedIndex(idx);
    }
  }, [ideas, id, setSelectedIndex]);

  const goToNext = () => {
    setSelectedIndex((selectedIndex + 1) % ideas.length);
  };

  const goToPrevious = () => {
    setSelectedIndex((selectedIndex - 1 + ideas.length) % ideas.length);
  };

  return (
    <IdeaPageContainer $visible={visible}>
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
