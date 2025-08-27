import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuthStore } from '../../../store/useAuthStore';
import SectionHeader from '../../../components/SectionHeader';
import MyConnectionsSection from './MyConnectionsSection';
import MyConnectionsSection2 from './MyConnectionsSection2';

const Section = styled.section``;

const SubSection = styled.div`
  background-color: aliceblue;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

export default function ConnectionsSection() {
  const currentUser = useAuthStore((store) => store.user);
  const [isExpanded, setIsExpanded] = useState(false);

  // Get both types of connections
  const myConnections = currentUser?.connectedIdeas || [];
  const receivedConnections = currentUser?.receivedConnections || [];

  // Calculate total connections
  const totalConnections = myConnections.length + receivedConnections.length;

  // Limit connections when not expanded (show only 4 total)
  const limitedMyConnections = isExpanded
    ? myConnections
    : myConnections.slice(0, 2);
  const limitedReceivedConnections = isExpanded
    ? receivedConnections
    : receivedConnections.slice(0, 2);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Section>
      <SectionHeader
        title='My Connections'
        count={totalConnections}
        isExpanded={isExpanded}
        onToggle={handleToggle}
      />

      <SubSection>
        <MyConnectionsSection connections={limitedMyConnections} />
        <MyConnectionsSection2 connections={limitedReceivedConnections} />
      </SubSection>
    </Section>
  );
}
