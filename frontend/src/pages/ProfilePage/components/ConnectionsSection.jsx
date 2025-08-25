import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Section = styled.section`
  margin-bottom: 60px;
`;
const SectionHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 10px;
  h3 {
    font-size: 18px;
    font-weight: 600;
  }
`;
const ConnectionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;
const Person = styled.div`
  display: grid;
  grid-template-columns: 56px 1fr;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
  &:last-child {
    border-bottom: none;
  }
`;
const Avatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 8px;
  background: ${(p) => p.bg || '#ddd'};
`;
const Name = styled.div`
  font-weight: 600;
`;
const Role = styled.div`
  color: #6b6b6b;
  font-size: 14px;
`;
const Note = styled.div`
  color: #3d3d3d;
  font-size: 14px;
  position: relative !important;
  top: 0 !important;
`;

export default function ConnectionsSection({ connections = [] }) {
  const navigate = useNavigate();
  return (
    <Section>
      <SectionHeader>
        <h3>
          My Connections <span className='count'>({connections.length})</span>
        </h3>
      </SectionHeader>
      <ConnectionsList>
        {connections.map((c, i) => (
          <Person
            key={i}
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(`/user/${c.id || c.name}`)}
          >
            <Avatar style={{ background: c.color }} />
            <div>
              <Name>{c.name}</Name>
              <Role>{c.role}</Role>
              <Note>{c.note}</Note>
            </div>
          </Person>
        ))}
      </ConnectionsList>
    </Section>
  );
}
