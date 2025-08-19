import React from 'react';
import styled from 'styled-components';

const Wrap = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 8px;
`;

export default function CardActions({ children, className, style }) {
  return (
    <Wrap className={className} style={style}>
      {children}
    </Wrap>
  );
}
