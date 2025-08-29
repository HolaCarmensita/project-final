import React from 'react';
import styled from 'styled-components';

const Btn = styled.button`
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  border-radius: 50%;
  cursor: pointer;
  padding: 0;

  img {
    width: 24px;
    height: 24px;
    filter: none;
    opacity: 0.55;
    transition: opacity 120ms ease-in-out;
    pointer-events: none;
  }

  &:hover {
    background: #a80000;
  }
  &:hover img {
    opacity: 1;
    filter: brightness(0) invert(1);
  }
`;

export default function IconButton({ iconSrc, alt = '', ariaLabel, title, onClick, className, style, children, ...rest }) {
  return (
    <Btn
      type="button"
      aria-label={ariaLabel}
      title={title}
      onClick={onClick}
      className={className}
      style={style}
      {...rest}
    >
      {children ? children : <img src={iconSrc} alt={alt || title || ariaLabel || 'icon'} />}
    </Btn>
  );
}
