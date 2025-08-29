import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import arrowBackIcon from '../assets/icons/arrow_back.svg';

const TopBarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 16px 0;
  border-bottom: 1px solid #eee;
  background: #fff;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-size: 18px;
  font-weight: 400;
  color: #333;

  &:hover {
    opacity: 0.8;
  }

  img {
    width: 16px;
    height: 16px;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-size: 18px;
  font-weight: 400;
  color: #333;

  &:hover {
    opacity: 0.8;
  }
`;

const TopBar = ({
  title,
  onBack,
  backLabel = 'Back',
  actionLabel,
  onAction,
  showBackButton = true,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <TopBarContainer>
      {showBackButton && (
        <BackButton onClick={handleBack} aria-label={backLabel}>
          <img src={arrowBackIcon} alt={backLabel} />
          <h4>{title}</h4>
        </BackButton>
      )}

      {actionLabel && onAction && (
        <ActionButton onClick={onAction}>{actionLabel}</ActionButton>
      )}
    </TopBarContainer>
  );
};

export default TopBar;
