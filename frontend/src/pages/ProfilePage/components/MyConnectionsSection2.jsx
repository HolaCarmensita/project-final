import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useIdeasStore } from '../../../store/useIdeasStore';
import { useAuthStore } from '../../../store/useAuthStore';

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

export default function MyConnectionsSection2({ connections = [] }) {
  const navigate = useNavigate();

  return (
    <div>
      <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
        People Who Connected To My Ideas
      </h4>
      <ConnectionsList>
        {connections.length > 0 ? (
          connections.map((connection, i) => (
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
    </div>
  );
}
