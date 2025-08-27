import React from 'react';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import arrowIcon from '../assets/icons/arrow_forward.svg';
import { useIdeasStore } from '../store/useIdeasStore';

const sharedStyles = css`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  min-height: 40px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: lighter;
  text-decoration: none;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  line-height: 1;
  transition: background-color 0.2s ease, box-shadow 0.2s ease,
    transform 0.2s ease, border-color 0.2s ease, color 0.2s ease;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.16);

  &:hover {
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.16);
  }

  img {
    width: 18px;
    height: 18px;
    pointer-events: none;
  }
`;

const Filled = styled(Link)`
  ${sharedStyles};
  background: #232323;
  color: #ffffff;
  border: none;

  &:hover {
    background: #111111;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }
  img {
    filter: invert(1) brightness(1.4);
  }
`;

const Outlined = styled(Link)`
  ${sharedStyles};
  background: #fff;
  color: #232323;
  border: 1px solid #232323;
  box-shadow: none;

  &:hover {
    background: #f7f7f7;
  }
`;

export default function OpenIdeaButton({
  ideaId,
  to,
  title,
  variant = 'primary',
  className,
  style,
  children,
}) {
  const ideas = useIdeasStore((s) => s.ideas);
  const href = to || `/ideas/${ideaId}`;
  const aria = title ? `Open idea "${title}"` : 'Open idea';
  const onClick = () => {
    const idx = ideas.findIndex((i) => i._id === ideaId);
    if (idx >= 0)
      window.dispatchEvent(
        new CustomEvent('moveCameraToIndex', { detail: idx })
      );
  };

  const Btn = variant === 'outlined' ? Outlined : Filled;

  return (
    <Btn
      to={href}
      aria-label={aria}
      onClick={onClick}
      className={className}
      style={style}
    >
      {children || 'OPEN IDEA'} <img src={arrowIcon} alt='open' />
    </Btn>
  );
}
