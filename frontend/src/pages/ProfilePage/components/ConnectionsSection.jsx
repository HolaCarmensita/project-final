import React from 'react';
import styled from 'styled-components';
import { useAuthStore } from '../../../store/useAuthStore';
import SectionHeader from '../../../components/SectionHeader';
import MyConnectionsSection from './MyConnectionsSection';
import MyConnectionsSection2 from './MyConnectionsSection2';

const Section = styled.section`
  margin-bottom: 60px;
`;

const SubSection = styled.div`
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export default function ConnectionsSection() {
  const currentUser = useAuthStore((store) => store.user);

  // Get both types of connections
  const myConnections = currentUser?.connectedIdeas || [];
  const receivedConnections = currentUser?.receivedConnections || [];

  // Calculate total connections
  const totalConnections = myConnections.length + receivedConnections.length;

  return (
    <Section>
      <SectionHeader title='My Connections' count={totalConnections} />

      <SubSection>
        <MyConnectionsSection />
      </SubSection>

      <SubSection>
        <MyConnectionsSection2 />
      </SubSection>
    </Section>
  );
}
