import React from 'react';
import styled from 'styled-components';
import IdeaCard from '../ideaCard/IdeaCard';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIdeasStore } from '../../../store/useIdeasStore';
import { useUIStore } from '../../../store/useUIStore';

const IdeaPageContainer = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
`;

const LoadingMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 16px;
  color: #666;
`;

const ErrorMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 16px;
  color: #d32f2f;
  text-align: center;
  padding: 20px;
`;

const NoIdeasMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 16px;
  color: #666;
`;

const IdeaPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Get state from stores
  const ideas = useIdeasStore((state) => state.ideas);
  const isLoading = useIdeasStore((state) => state.isLoading);
  const error = useIdeasStore((state) => state.error);
  const fetchIdeas = useIdeasStore((state) => state.fetchIdeas);
  const selectedIndex = useUIStore((state) => state.selectedIndex);
  const setSelectedIndex = useUIStore((state) => state.setSelectedIndex);

  // Fetch ideas if not already loaded
  useEffect(() => {
    if (ideas.length === 0 && !isLoading) {
      fetchIdeas();
    }
  }, [ideas.length, isLoading, fetchIdeas]);

  // Update selected index when ideas or id changes
  useEffect(() => {
    if (ideas.length > 0 && id) {
      const idx = ideas.findIndex(
        (idea) => idea._id === id || idea.id === Number(id)
      );
      if (idx >= 0) {
        setSelectedIndex(idx);
      } else {
        // Idea not found - redirect to home or show error
        console.log('Idea not found, redirecting...');
        navigate('/');
      }
    }
  }, [ideas, id, setSelectedIndex, navigate]);

  // Show loading state
  if (isLoading && ideas.length === 0) {
    return (
      <IdeaPageContainer>
        <LoadingMessage>Loading ideas...</LoadingMessage>
      </IdeaPageContainer>
    );
  }

  // Show error state
  if (error && ideas.length === 0) {
    return (
      <IdeaPageContainer>
        <ErrorMessage>Error loading ideas: {error}</ErrorMessage>
      </IdeaPageContainer>
    );
  }

  // Show no ideas state
  if (!isLoading && ideas.length === 0) {
    return (
      <IdeaPageContainer>
        <NoIdeasMessage>No ideas available.</NoIdeasMessage>
      </IdeaPageContainer>
    );
  }

  // Show idea if available
  if (ideas.length > 0 && selectedIndex >= 0 && selectedIndex < ideas.length) {
    return (
      <IdeaPageContainer>
        <IdeaCard idea={ideas[selectedIndex]} />
        {/* <MockNavigation onNext={goToNext} onPrevious={goToPrevious} /> */}
      </IdeaPageContainer>
    );
  }

  // Fallback - should not reach here
  return (
    <IdeaPageContainer>
      <NoIdeasMessage>Loading...</NoIdeasMessage>
    </IdeaPageContainer>
  );
};

export default IdeaPage;
