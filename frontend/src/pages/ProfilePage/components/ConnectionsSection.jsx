import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useUsersStore } from '../../../store/useUsersStore';

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

  // Get state from UsersStore
  const userConnections = useUsersStore((state) => state.userConnections);
  const isLoading = useUsersStore((state) => state.isLoading);
  const error = useUsersStore((state) => state.error);
  const fetchUserConnections = useUsersStore(
    (state) => state.fetchUserConnections
  );

  // Fetch connections when component mounts
  useEffect(() => {
    fetchUserConnections();
  }, [fetchUserConnections]);

  if (isLoading) {
    return (
      <Section>
        <SectionHeader>
          <h3>My Connections</h3>
        </SectionHeader>
        <LoadingMessage>Loading connections...</LoadingMessage>
      </Section>
    );
  }

  if (error) {
    return (
      <Section>
        <SectionHeader>
          <h3>My Connections</h3>
        </SectionHeader>
        <ErrorMessage>Error loading connections: {error}</ErrorMessage>
      </Section>
    );
  }

  return (
    <Section>
      <SectionHeader>
        <h3>
          My Connections{' '}
          <span className='count'>({userConnections.length})</span>
        </h3>
      </SectionHeader>
      <ConnectionsList>
        {userConnections.length > 0 ? (
          userConnections.map((connection, i) => (
            <Person
              key={connection._id || i}
              style={{ cursor: 'pointer' }}
              onClick={() =>
                navigate(`/user/${connection.user?._id || connection.userId}`)
              }
            >
              <Avatar style={{ background: connection.color || '#ddd' }} />
              <div>
                <Name>
                  {connection.user?.fullName ||
                    connection.userName ||
                    'Unknown User'}
                </Name>
                <Role>{connection.user?.role || 'User'}</Role>
                <Note>{connection.message || 'Connected'}</Note>
              </div>
            </Person>
          ))
        ) : (
          <EmptyMessage>
            No connections yet. Start connecting with other users!
          </EmptyMessage>
        )}
      </ConnectionsList>
    </Section>
  );
}
