import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useIdeasStore } from '../../../store/useIdeasStore';
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

const LoadingMessage = styled.div`
  text-align: center;
  color: #666;
  padding: 20px;
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: #d32f2f;
  padding: 20px;
`;

const EmptyMessage = styled.div`
  text-align: center;
  color: #666;
  padding: 20px;
`;

export default function ConnectionsSection() {
  const navigate = useNavigate();

  // Get state from AuthStore (user data with receivedConnections)
  const currentUser = useAuthStore((store) => store.user);

  // Get received connections from user data
  const receivedConnections = currentUser?.receivedConnections || [];

  // No loading/error states needed since we get data from store

  return (
    <Section>
      <SectionHeader>
        <h3>
          People Who Connected To My Ideas{' '}
          <span className='count'>({receivedConnections.length})</span>
        </h3>
      </SectionHeader>
      <ConnectionsList>
        {receivedConnections.length > 0 ? (
          receivedConnections.map((connection, i) => (
            <Person
              key={connection._id || i}
              style={{ cursor: 'pointer' }}
              onClick={() =>
                navigate(
                  `/user/${
                    connection.connectedBy._id || connection.connectedBy
                  }`
                )
              }
            >
              <Avatar style={{ background: connection.color || '#ddd' }} />
              <div>
                <Name>
                  {connection.connectedBy?.fullName ||
                    (connection.connectedBy?.firstName &&
                    connection.connectedBy?.lastName
                      ? `${connection.connectedBy.firstName} ${connection.connectedBy.lastName}`
                      : 'Unknown User')}
                </Name>
                <Role>
                  Connected to: {connection.idea?.title || 'Unknown Idea'}
                </Role>
                <Note>{connection.message}</Note>
              </div>
            </Person>
          ))
        ) : (
          <EmptyMessage>No one has connected to your ideas yet.</EmptyMessage>
        )}
      </ConnectionsList>
    </Section>
  );
}
