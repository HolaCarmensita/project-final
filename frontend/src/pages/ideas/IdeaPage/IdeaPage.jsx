import React from 'react';
import styled from 'styled-components';
import IdeaCard from '../ideaCard/IdeaCard';
import MockNavigation from './components/MockNavigation';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useIdeasStore } from '../../../store/useIdeasStore';
import { responsiveContainer } from '../../../styles/breakpoints';

const IdeaPageContainer = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  height: 100vh;
  ${responsiveContainer}
`;

const MockNavigationContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

const IdeaPage = () => {
  const { id } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const ideas = useIdeasStore((state) => state.ideas);

  useEffect(() => {
    if (ideas.length && id) {
      const idx = ideas.findIndex((i) => i.id === Number(id));
      if (idx >= 0) setCurrentIndex(idx);
    }
  }, [ideas, id]);

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === ideas.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? ideas.length - 1 : prevIndex - 1
    );
  };

  return (
    <IdeaPageContainer>
      {ideas.length > 0 ? (
        <>
          <IdeaCard idea={ideas[currentIndex]} />
          <MockNavigation onNext={goToNext} onPrevious={goToPrevious} />
        </>
      ) : (
        <p>No ideas available.</p>
      )}
    </IdeaPageContainer>
  );
};

export default IdeaPage;
