import React from 'react';
import styled from 'styled-components';

const Btn = styled.button`
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  box-shadow: none;
  cursor: pointer;
  padding: 0;

  img {
    width: 16px;
    height: 16px;
    filter: none;
    opacity: 0.55;
    transition: opacity 120ms ease-in-out;
    pointer-events: none;
  }

  &:hover img { opacity: 1; }
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
