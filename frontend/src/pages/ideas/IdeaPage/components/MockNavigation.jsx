import React from 'react';
import styled from 'styled-components';

const NavigationButton = styled.button`
  &:focus {
    outline: 2px solid #007bff;
    outline-offset: 2px;
  }

  &:focus-visible {
    outline: 2px solid #007bff;
    outline-offset: 2px;
  }
`;

const MockNavigation = ({ onNext, onPrevious }) => {
  return (
    <div>
      <NavigationButton
        onClick={onPrevious}
        tabIndex={6}
        aria-label='Go to previous idea'
      >
        Previous
      </NavigationButton>
      <NavigationButton
        onClick={onNext}
        tabIndex={7}
        aria-label='Go to next idea'
      >
        Next
      </NavigationButton>
    </div>
  );
};

export default MockNavigation;
