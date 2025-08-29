import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSwipeable } from 'react-swipeable';

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: 8px;
  cursor: grab;
  user-select: none;
  /* box-shadow: 0 4px 12px rgba(0, 0, 0, 0.10); */
  border: 1px solid rgba(0, 0, 0, 0.08);

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

// New Navigation Button Components
const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  color: white;
  font-size: 18px;
  font-weight: bold;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
    transform: translateY(-50%) scale(1.1);
  }

  &:focus {
    outline: 2px solid #007bff;
    outline-offset: 2px;
    background: rgba(0, 0, 0, 0.7);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    transform: translateY(-50%);
  }
`;

const PrevButton = styled(NavigationButton)`
  left: 10px;
`;

const NextButton = styled(NavigationButton)`
  right: 10px;
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

  useEffect(() => {
    console.log('ImageCarousel images prop:', images);
  }, [images]);

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

  return (
    <CarouselContainer
      {...handlers}
      role='region'
      aria-label={`Image carousel, ${currentIndex + 1} of ${displayImages.length
        } images`}
      aria-live='polite'
    >
      <CarouselTrack $currentIndex={currentIndex}>
        {displayImages.map((image, index) => (
          <CarouselSlide key={index}>
            <CarouselImage
              src={typeof image === 'string' ? image : image.url}
              alt={`Image ${index + 1} of ${displayImages.length}`}
              aria-hidden={index !== currentIndex}
            />
          </CarouselSlide>
        ))}
      </CarouselTrack>

      {/* Navigation Buttons - Only show if there are multiple images */}
      {displayImages.length > 1 && (
        <>
          <PrevButton
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            tabIndex={0}
            aria-label={`Go to previous image (${currentIndex} of ${displayImages.length})`}
          >
            ‹
          </PrevButton>
          <NextButton
            onClick={goToNext}
            disabled={currentIndex === displayImages.length - 1}
            tabIndex={0}
            aria-label={`Go to next image (${currentIndex + 2} of ${displayImages.length
              })`}
          >
            ›
          </NextButton>
        </>
      )}

      {/* Dots Navigation - Made non-focusable */}
      {displayImages.length > 1 && (
        <DotsContainer>
          {displayImages.map((_, index) => (
            <Dot
              key={index}
              $active={index === currentIndex}
              onClick={() => goToSlide(index)}
              tabIndex={0} // Accessible tab order
              aria-hidden='true' // Hide from screen readers
            />
          ))}
        </DotsContainer>
      )}
    </CarouselContainer>
  );
};

export default ImageCarousel;
