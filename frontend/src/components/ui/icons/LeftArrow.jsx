import React from "react";
import styled from "styled-components";

const StyledSVG = styled.svg`
  width: 48px;
  height: 48px;
  display: block;
`;

const LeftArrow = () => (
  <StyledSVG viewBox="0 0 48 48" fill="none">
    <path
      d="M30 12L18 24L30 36"
      stroke="#fff"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </StyledSVG>
);

export default LeftArrow;
