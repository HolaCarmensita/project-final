import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useUserStore } from '../../store/useUserStore';
import { useIdeasStore } from '../../store/useIdeasStore';
import TopBar from '../../components/TopBar';

const Page = styled.div`
  padding: 24px 18px 32px 18px;
  position: relative;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const BodyText = styled.p`
  font-size: 16px;
  color: #222;
  margin-bottom: 18px;
`;

const ConnectionInfo = styled.div`
  margin-top: 18px;
  border-top: 1px solid #eee;
  padding-top: 12px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 15px;
  color: #232323;
`;

const ClickableName = styled.span`
  color: #007bff;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: #0056b3;
  }
`;

const DateRow = styled.div`
  font-size: 13px;
  color: #888;
  margin-top: 8px;
`;

const MessageBox = styled.div`
  background: #f7f7f7;
  padding: 16px;
  border-radius: 12px;
  margin-top: 16px;
`;

const MessageTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
`;

const MessageText = styled.p`
  font-size: 16px;
  color: #222;
  line-height: 1.5;
`;

const ConnectionPage = () => {
  const { connectionId } = useParams();
  const navigate = useNavigate();

  const currentUser = useUserStore((store) => store.user);
  const ideas = useIdeasStore((store) => store.ideas);

  // Find the idea first
  const idea = ideas.find((i) => i._id === connectionId);

  if (!idea) {
    return (
      <Page>
        <TopBar title='Idea Not Found' />
        <BodyText>This idea could not be found.</BodyText>
      </Page>
    );
  }

  // Find the connection (either from myConnections or receivedConnections)
  const myConnection = currentUser?.connectedIdeas?.find(
    (conn) => conn.idea._id === connectionId || conn.idea === connectionId
  );

  const receivedConnection = currentUser?.receivedConnections?.find(
    (conn) => conn.idea._id === connectionId || conn.idea === connectionId
  );

  const connection = myConnection || receivedConnection;
  const isMyConnection = !!myConnection;

  if (!connection) {
    return (
      <Page>
        <TopBar title='Connection Not Found' />
        <BodyText>This connection could not be found.</BodyText>
      </Page>
    );
  }

  const connectedUser = isMyConnection ? idea?.creator : connection.connectedBy;

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown Date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Page>
      <TopBar
        title={isMyConnection ? 'My Connection' : 'Received Connection'}
      />

      <Title>{idea?.title || 'Unknown Idea'}</Title>
      <BodyText>{idea?.description || 'No description available.'}</BodyText>

      <ConnectionInfo>
        <InfoRow>
          <strong>{isMyConnection ? 'Creator:' : 'Connected by:'}</strong>
          <ClickableName
            onClick={() => navigate(`/user/${connectedUser?._id}`)}
          >
            {connectedUser?.fullName ||
              (connectedUser?.firstName && connectedUser?.lastName
                ? `${connectedUser.firstName} ${connectedUser.lastName}`
                : 'Unknown User')}
          </ClickableName>
        </InfoRow>

        <InfoRow>
          <strong>Connection type:</strong>
          {isMyConnection
            ? 'I connected to this idea'
            : 'User connected to my idea'}
        </InfoRow>

        <DateRow>Connected on: {formatDate(connection.connectedAt)}</DateRow>
      </ConnectionInfo>

      {connection.message && (
        <MessageBox>
          <MessageTitle>
            {isMyConnection ? 'My Message:' : "User's Message:"}
          </MessageTitle>
          <MessageText>{connection.message}</MessageText>
        </MessageBox>
      )}
    </Page>
  );
};

export default ConnectionPage;
