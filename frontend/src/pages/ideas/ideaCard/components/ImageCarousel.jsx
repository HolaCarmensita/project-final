import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSwipeable } from 'react-swipeable';

const CarouselContainer = styled.div`
  position: relative;
  max-width: 400px;
  height: 360px;
  overflow: hidden;
  border-radius: 8px;
  cursor: grab;
  user-select: none;

  &:active {
    cursor: grabbing;
  }

  &:focus {
    outline: 2px solid #007bff;
    outline-offset: 2px;
  }
`;

const CarouselTrack = styled.div`
  display: flex;
  transition: transform 0.5s ease-in-out;
  height: 100%;
  transform: translateX(-${(props) => props.$currentIndex * 100}%);
`;

const CarouselSlide = styled.div`
  min-width: 100%;
  height: 100%;
  position: relative;
`;

const CarouselImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const DotsContainer = styled.div`
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 10;
`;

const Dot = styled.button`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background: ${(props) =>
    props.$active ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.4)'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.7);
  }
`;

const ImageCarousel = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const displayImages = images || [];

  // Swipe handlers
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      // Swipe left = go to next image
      if (currentIndex < displayImages.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    },
    onSwipedRight: () => {
      // Swipe right = go to previous image
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    },
    preventDefaultTouchmoveEvent: true, // Prevents default touch behavior
    trackMouse: true, // Enables mouse drag support
    delta: 10, // Minimum distance for a swipe to be registered
    swipeDuration: 500, // Maximum time for a swipe gesture
  });

  // If no images, show a placeholder message
  if (displayImages.length === 0) {
    return (
      <CarouselContainer>
        <div>No images available</div>
      </CarouselContainer>
    );
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === displayImages.length - 1
        ? displayImages.length - 1
        : prevIndex + 1
    );
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? 0 : prevIndex - 1));
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Keyboard navigation
  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        if (currentIndex > 0) {
          setCurrentIndex(currentIndex - 1);
        }
        break;
      case 'ArrowRight':
        event.preventDefault();
        if (currentIndex < displayImages.length - 1) {
          setCurrentIndex(currentIndex + 1);
        }
        break;
      default:
        break;
    }
  };

  return (
    <CarouselContainer
      {...handlers}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role='region'
      aria-label={`Image carousel, ${currentIndex + 1} of ${
        displayImages.length
      } images`}
      aria-live='polite'
    >
      <CarouselTrack $currentIndex={currentIndex}>
        {displayImages.map((image, index) => (
          <CarouselSlide key={index}>
            <CarouselImage
              src={image.url || image}
              alt={image.alt || `Image ${index + 1} of ${displayImages.length}`}
              aria-hidden={index !== currentIndex}
            />
          </CarouselSlide>
        ))}
      </CarouselTrack>

      {/* Dots Navigation */}
      {displayImages.length > 1 && (
        <DotsContainer>
          {displayImages.map((_, index) => (
            <Dot
              key={index}
              $active={index === currentIndex}
              onClick={() => goToSlide(index)}
              aria-label={`Go to image ${index + 1} of ${displayImages.length}`}
              aria-current={index === currentIndex ? 'true' : 'false'}
            />
          ))}
        </DotsContainer>
      )}
    </CarouselContainer>
  );
};

export default ImageCarousel;
