import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useUserStore } from '../../store/useUserStore';
import { useIdeasStore } from '../../store/useIdeasStore';
import TopBar from '../../components/TopBar';
import callMadeIcon from '../../assets/icons/callMade.svg';

const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const PageText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 600;
  cursor: pointer;
  color: #222;
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    color: #0056b3;
  }
`;

const TitleIcon = styled.img`
  width: 22px;
  height: 22px;
  opacity: 0.7;
  transition: opacity 0.2s ease;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #0056b3;

    ${TitleIcon} {
      opacity: 1;
    }
  }
`;

const BodyText = styled.p`
  font-size: 16px;
  color: #222;
`;

const ConnectionInfo = styled.div`
  border-top: 1px solid #eee;
  padding-top: 16px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
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
  color: #333;
`;

const MessageText = styled.p`
  font-size: 16px;
  color: #222;
  line-height: 1.5;
`;

const ImageGallery = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ImageContainer = styled.div`
  border-radius: 12px;
  overflow: hidden;
  background: #f7f7f7;

  img {
    width: 100%;
    display: block;
  }
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
      <PageContent>
        <PageText>
          <TitleContainer onClick={() => navigate(`/ideas/${idea._id}`)}>
            <Title>{idea?.title || 'Unknown Idea'}</Title>
            <TitleIcon src={callMadeIcon} alt='Open in new' />
          </TitleContainer>
          <BodyText>
            {idea?.description || 'No description available.'}
          </BodyText>

          {idea?.images && idea.images.length > 0 && (
            <ImageGallery>
              {idea.images.map((image, index) => (
                <ImageContainer key={index}>
                  <img src={image} alt={`Idea image ${index + 1}`} />
                </ImageContainer>
              ))}
            </ImageGallery>
          )}
        </PageText>
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

          {connection.message && (
            <MessageBox>
              <MessageTitle>
                {isMyConnection ? 'My Message:' : "User's Message:"}
              </MessageTitle>
              <MessageText>{connection.message}</MessageText>
            </MessageBox>
          )}

          <DateRow>Connected on: {formatDate(connection.connectedAt)}</DateRow>
        </ConnectionInfo>
      </PageContent>
    </Page>
  );
};

export default ConnectionPage;
