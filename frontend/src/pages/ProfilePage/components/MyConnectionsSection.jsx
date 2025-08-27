import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import SectionHeader from '../../../components/SectionHeader';

const Section = styled.section`
  margin-bottom: 60px;
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

export default function MyConnectionsSection({ connections = [] }) {
  const navigate = useNavigate();

  return (
    <div>
      <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
        Ideas I Connected To
      </h4>
      <ConnectionsList>
        {connections.length > 0 ? (
          connections.map((connection, i) => (
            <Person
              key={connection._id || i}
              style={{ cursor: 'pointer' }}
              onClick={() =>
                navigate(`/ideas/${connection.idea._id || connection.idea}`)
              }
            >
              <Avatar style={{ background: '#ddd' }} />
              <div>
                <Name>{connection.idea?.title || 'Unknown Idea'}</Name>
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
    </div>
  );
}
