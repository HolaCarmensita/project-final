// section header for the ProfilePage

import React from 'react';
import styled from 'styled-components';

const HeaderWrap = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 10px;

  h3 { font-size: 18px; font-weight: 600; }
  .count { color: #6b6b6b; font-weight: 400; margin-left: 6px; font-size: 14px; }
  button.linklike { color: #232323; background: transparent; border: 0; padding: 0; font-size: 14px; cursor: pointer; text-decoration: none; }
`;

export default function SectionHeader({ title, count, isExpanded = false, onToggle }) {
  return (
    <HeaderWrap>
      <h3>
        {title} {typeof count === 'number' && <span className="count">({count})</span>}
      </h3>
      {onToggle && (
        <button type="button" className="linklike" onClick={onToggle} aria-expanded={isExpanded}>
          {isExpanded ? 'Collapse' : 'See all'}
        </button>
      )}
    </HeaderWrap>
  );
}
