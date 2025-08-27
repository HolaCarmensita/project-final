import React, { useState } from 'react';
import styled from 'styled-components';
import { useUserStore } from '../../../store/useUserStore';
import SectionHeader from '../../../components/SectionHeader';
import MyConnections from './MyConnections';

const Section = styled.section``;

const SubSectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

export default function ConnectionsSection() {
  const currentUser = useUserStore((store) => store.user);
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

      <SubSectionContainer>
        <MyConnections
          myConnections={limitedMyConnections}
          receivedConnections={limitedReceivedConnections}
        />
      </SubSectionContainer>
    </Section>
  );
}
