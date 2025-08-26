import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuthStore } from '../../../store/useAuthStore';

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

const EmptyMessage = styled.div`
  text-align: center;
  color: #666;
  padding: 20px;
`;

export default function MyConnectionsSection() {
  const navigate = useNavigate();

  // Get state from AuthStore (user data with connectedIdeas)
  const currentUser = useAuthStore((store) => store.user);

  // Get ideas I connected to from user data
  const myConnections = currentUser?.connectedIdeas || [];

  return (
    <Section>
      <SectionHeader>
        <h3>
          Ideas I Connected To{' '}
          <span className='count'>({myConnections.length})</span>
        </h3>
      </SectionHeader>
      <ConnectionsList>
        {myConnections.length > 0 ? (
          myConnections.map((connection, i) => (
            <Person
              key={connection._id || i}
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/ideas/${connection.idea}`)}
            >
              <Avatar style={{ background: '#ddd' }} />
              <div>
                <Name>Idea ID: {connection.idea}</Name>
                <Role>
                  Connected on:{' '}
                  {new Date(connection.connectedAt).toLocaleDateString()}
                </Role>
                <Note>{connection.message}</Note>
              </div>
            </Person>
          ))
        ) : (
          <EmptyMessage>You haven't connected to any ideas yet.</EmptyMessage>
        )}
      </ConnectionsList>
    </Section>
  );
}
