import React from 'react';

export default function UnstackToggleButton({ unstacked, onClick, style }) {
  return (
    <button
      style={{
        margin: '12px 0 18px auto',
        display: 'block',
        background: 'none',
        border: 'none',
        color: '#224EA0',
        fontWeight: 600,
        fontSize: 15,
        cursor: 'pointer',
        textDecoration: 'none',
        ...style,
      }}
      onClick={onClick}
    >
      {unstacked ? 'Stack cards' : 'See all'}
    </button>
  );
}
