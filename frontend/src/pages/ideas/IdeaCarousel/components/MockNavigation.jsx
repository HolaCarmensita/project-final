import React from 'react';

const MockNavigation = ({ onNext, onPrevious }) => {
  return (
    <div>
      <button onClick={onPrevious}>Previous</button>
      <button onClick={onNext}>Next</button>
    </div>
  );
};

export default MockNavigation;
