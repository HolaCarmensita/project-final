import React from "react";
import styled from "styled-components";

const StyledSVG = styled.svg`
  width: 56px;
  height: 56px;
  display: block;
`;

const PlusIcon = () => (
  <StyledSVG viewBox="0 0 56 56" fill="none">
    <circle cx="28" cy="28" r="27" fill="#fff" />
    <path d="M28 18V38M18 28H38" stroke="#232323" strokeWidth="3" strokeLinecap="round" />
  </StyledSVG>
);

export default PlusIcon;
