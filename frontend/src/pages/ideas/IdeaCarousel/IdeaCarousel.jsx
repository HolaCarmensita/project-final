import React from 'react';
import styled from 'styled-components';
import IdeaCard from '../ideaCard/IdeaCard';
import { useState, useEffect } from 'react';
import mockApi from '../../../data/mockData';

const IdeaCarouselContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  max-width: 400px;
`;

const IdeaCarousel = () => {
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

  return (
    <IdeaCarouselContainer>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {ideas.length > 0 && <IdeaCard idea={ideas[0]} />}
    </IdeaCarouselContainer>
  );
};

export default IdeaCarousel;
