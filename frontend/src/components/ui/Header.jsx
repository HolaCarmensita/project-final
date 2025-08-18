import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import HeadIcon from './icons/head.svg';

const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: white;
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;

  /* iPad Mini and larger screens: Header within 3D scene area */
  @media (min-width: 768px) {
    position: absolute; /* Changed from fixed to absolute */
    top: 0;
    left: 0;
    right: auto;
    width: 100%; /* Full width of its container */
    border-radius: 0;
    background: transparent;
  }
`;

const Logo = styled.h1`
  font-size: 32px;
  font-weight: 600;
  color: #000;
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const ProfileLink = styled(Link)`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
  text-decoration: none;
`;

const LogoIcon = styled.img`
  width: 26px;
  height: 26px;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const IconSVG = styled.svg`
  width: 26px;
  height: 26px;
  fill: #000;
`;

const Header = ({ onThemeToggle }) => {
  return (
    <HeaderWrapper>
      <Logo>OurLogo</Logo>
      <HeaderActions>
        <IconButton onClick={onThemeToggle} aria-label='Toggle theme'>
          <IconSVG viewBox='0 0 24 24' fill='none'>
            <path
              d='M12 2.25V4.5M12 19.5V21.75M4.5 12H2.25M6.34 6.34L4.5 4.5M6.34 17.66L4.5 19.5M21.75 12H19.5M17.66 6.34L19.5 4.5M17.66 17.66L19.5 19.5M12 15.75C14.0711 15.75 15.75 14.0711 15.75 12C15.75 9.92893 14.0711 8.25 12 8.25C9.92893 8.25 8.25 9.92893 8.25 12C8.25 14.0711 9.92893 15.75 12 15.75Z'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </IconSVG>
        </IconButton>
        <ProfileLink to='/profile' aria-label='Go to profile'>
          <LogoIcon src={HeadIcon} alt='Profile Logo' />
        </ProfileLink>
      </HeaderActions>
    </HeaderWrapper>
  );
};

export default Header;
