import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ConnectionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Avatar = styled.div`
  min-width: 62px;
  min-height: 62px;
  flex-shrink: 0;
  border-radius: 8px;
  background: ${(p) => p.bg || '#ddd'};
`;

const Title = styled.div`
  font-weight: 600;
`;

const Info = styled.div`
  color: #6b6b6b;
  font-size: 14px;
`;

const Message = styled.div`
  color: #3d3d3d;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 420px;
`;

const EmptyMessage = styled.div`
  text-align: center;
  color: #666;
  padding: 20px;
`;

const SubSection = ({
  title,
  connections = [],
  onItemClick,
  getItemTitle,
  getItemInfo,
  getItemMessage,
  emptyMessage,
}) => {
  const navigate = useNavigate();

  const handleItemClick = (connection, index) => {
    if (onItemClick) {
      onItemClick(connection, index);
    }
  };

  return (
    <Section>
      <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
        {title}
      </h4>
      <ConnectionsList>
        {connections.length > 0 ? (
          connections.map((connection, i) => (
            <Item
              key={connection._id || i}
              style={{ cursor: 'pointer' }}
              onClick={() => handleItemClick(connection, i)}
            >
              <Avatar style={{ background: connection.color || '#ddd' }} />
              <div>
                <Title>{getItemTitle(connection)}</Title>
                <Info>{getItemInfo(connection)}</Info>
                <Message>{getItemMessage(connection)}</Message>
              </div>
            </Item>
          ))
        ) : (
          <EmptyMessage>{emptyMessage}</EmptyMessage>
        )}
      </ConnectionsList>
    </Section>
  );
};

export default SubSection;
