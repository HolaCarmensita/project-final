import React from 'react';
import { useNavigate } from 'react-router-dom';
import SubSection from '../../../components/SubSection';

const MyConnections = ({ myConnections = [], receivedConnections = [] }) => {
  const navigate = useNavigate();

  // Handler for clicking on ideas I connected to
  const handleMyConnectionClick = (connection) => {
    navigate(`/connections/${connection.idea._id || connection.idea}`);
  };

  // Handler for clicking on people who connected to my ideas
  const handleReceivedConnectionClick = (connection) => {
    navigate(`/connections/${connection.idea._id || connection.idea}`);
  };

  // Functions for "Ideas I Connected To" section
  const getMyConnectionTitle = (connection) => {
    return connection.idea?.title || 'Unknown Idea';
  };

  const getMyConnectionInfo = (connection) => {
    return `Connected on: ${
      connection.connectedAt
        ? new Date(connection.connectedAt).toLocaleDateString()
        : 'Unknown Date'
    }`;
  };

  const getMyConnectionMessage = (connection) => {
    return connection.message;
  };

  // Functions for "People Who Connected To My Ideas" section
  const getReceivedConnectionTitle = (connection) => {
    return (
      connection.connectedBy?.fullName ||
      (connection.connectedBy?.firstName && connection.connectedBy?.lastName
        ? `${connection.connectedBy.firstName} ${connection.connectedBy.lastName}`
        : 'Unknown User')
    );
  };

  const getReceivedConnectionInfo = (connection) => {
    let info = `Connected to: ${connection.idea?.title || 'Unknown Idea'}`;
    if (connection.connectedAt) {
      info += ` on ${new Date(connection.connectedAt).toLocaleDateString()}`;
    }
    return info;
  };

  const getReceivedConnectionMessage = (connection) => {
    return connection.message;
  };

  return (
    <>
      <SubSection
        title='Ideas I Connected To'
        connections={myConnections}
        onItemClick={handleMyConnectionClick}
        getItemTitle={getMyConnectionTitle}
        getItemInfo={getMyConnectionInfo}
        getItemMessage={getMyConnectionMessage}
        emptyMessage="You haven't connected to any ideas yet."
      />

      <SubSection
        title='People Who Connected To My Ideas'
        connections={receivedConnections}
        onItemClick={handleReceivedConnectionClick}
        getItemTitle={getReceivedConnectionTitle}
        getItemInfo={getReceivedConnectionInfo}
        getItemMessage={getReceivedConnectionMessage}
        emptyMessage='No one has connected to your ideas yet.'
      />
    </>
  );
};

export default MyConnections;
