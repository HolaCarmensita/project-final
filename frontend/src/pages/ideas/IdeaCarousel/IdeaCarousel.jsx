import React from 'react';
import styled from 'styled-components';
import IdeaCard from '../ideaCard/IdeaCard';
import MockNavigation from './components/MockNavigation';
import { useState, useEffect } from 'react';
import mockApi from '../../../data/mockData';
import { responsiveContainer } from '../../../styles/breakpoints';

const IdeaCarouselContainer = styled.div`
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

const IdeaCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        setLoading(true);
        const fetchedIdeas = await mockApi.getIdeas();
        setIdeas(fetchedIdeas);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIdeas();
  }, []);

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
    <IdeaCarouselContainer>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {ideas.length > 0 && (
        <>
          <IdeaCard idea={ideas[currentIndex]} />
          <MockNavigation onNext={goToNext} onPrevious={goToPrevious} />
        </>
      )}
    </IdeaCarouselContainer>
  );
};

export default IdeaCarousel;
