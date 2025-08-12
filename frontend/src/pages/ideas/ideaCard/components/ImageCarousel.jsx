import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import artpice1 from '../../../../assets/img/artpice1.png';
import artpice2 from '../../../../assets/img/artpice2.png';
import cells from '../../../../assets/img/cells.png';
import dots from '../../../../assets/img/dots.png';

const CarouselContainer = styled.div`
  position: relative;
  max-width: 400px;
  height: 360px;
  overflow: hidden;
  border-radius: 8px;

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

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.8);
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

  &:hover {
    background: rgba(255, 255, 255, 0.95);
    transform: translateY(-50%) scale(1.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${(props) => (props.direction === 'prev' ? 'left: 10px;' : 'right: 10px;')}

  img {
    width: 20px;
    height: 20px;
    filter: ${(props) => (props.direction === 'prev' ? 'none' : 'none')};
  }
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

  // Placeholder images for development - remove when API is ready
  const placeholderImages = [artpice1, artpice2, cells, dots];

  // Use provided images or fallback to placeholders
  const displayImages = images.length > 0 ? images : placeholderImages;

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

      {/* Navigation Arrows */}
      {displayImages.length > 1 && (
        <>
          <NavigationButton
            direction='prev'
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            aria-label={`Go to previous image (currently image ${
              currentIndex + 1
            } of ${displayImages.length})`}
          >
            <img src='/icons/arrow_back.svg' alt='Previous' />
          </NavigationButton>
          <NavigationButton
            direction='next'
            onClick={goToNext}
            disabled={currentIndex === displayImages.length - 1}
            aria-label={`Go to next image (currently image ${
              currentIndex + 1
            } of ${displayImages.length})`}
          >
            <img src='/icons/arrow_forward.svg' alt='Next' />
          </NavigationButton>
        </>
      )}

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
