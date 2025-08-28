import React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import IconButton from '../../components/IconButton';
import closeIcon from '../../assets/icons/close.svg';
import { useAuthStore } from '../../store/useAuthStore';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(8px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoginContainer = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  padding: 40px 32px;
  min-width: 340px;
  max-width: 90vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  @media (max-width: 600px) {
    width: 100vw;
    height: 100vh;
    max-width: 100vw;
    min-width: 100vw;
    border-radius: 0;
    padding: 24px 20px;
    align-items: stretch;
    overflow-y: auto;
  }
`;

const WelcomeText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: center;
`;

const LoginForm = styled.form`
  width: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Title = styled.h3`
  margin: 0 0 24px 0;
  font-weight: 600;
  text-align: center;
  color: #333;
`;

const Label = styled.label`
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid #ddd;
  font-size: 16px;
  outline: none;
`;

const ForgotPasswordLink = styled(Link)`
  color: #007bff;
  font-size: 14px;
  text-decoration: underline;
  margin: 8px 0 16px 0;
  display: inline-block;

  &:hover {
    color: #0056b3;
  }
`;

const SignUpText = styled.p`
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: #666;

  a {
    color: #007bff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;
const ErrorMessage = styled.p`
  color: red;
  font-size: 12px;
  margin-top: 4px;
`;

const LoginModal = ({ onClose }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Use AuthStore state instead of local state
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setEmailError('');
    setPasswordError('');
    clearError(); // Clear AuthStore error

    let hasErrors = false;

    // Validate email
    if (!email) {
      setEmailError('Email is required');
      hasErrors = true;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError('Please enter a valid email address');
        hasErrors = true;
      }
    }

    // Validate password
    if (!password) {
      setPasswordError('Password is required');
      hasErrors = true;
    }

    // If any errors, stop here
    if (hasErrors) {
      return;
    }

    // Login using AuthStore
    try {
      const result = await login(email, password);

      if (result.success) {
        console.log('Login Success');
        navigate('/');
      }
      // If login fails, error is already set in AuthStore
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);

    // Clear email error when user starts typing
    if (emailValue === '') {
      setEmailError('');
      return;
    }
  };

  const handleEmailBlur = (e) => {
    const emailValue = e.target.value;

    if (emailValue === '') {
      setEmailError('');
      return;
    }

    // Validate email when user leaves the field
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError(''); // Clear error when email is valid
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError(''); // Clear password error when user types
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
      return;
    }
    navigate('/');
  };

  return (
    <ModalOverlay>
      <LoginContainer>
        <IconButton
          iconSrc={closeIcon}
          ariaLabel="Close"
          title="Close"
          onClick={handleClose}
          style={{ position: 'absolute', top: 12, right: 12, width: 44, height: 44 }}
        >
          <img src={closeIcon} alt="Close" style={{ width: 28, height: 28 }} />
        </IconButton>
        <LoginForm onSubmit={handleSubmit}>
          <Title>Login</Title>
          <InputContainer>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              type='text'
              placeholder='Enter your email'
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
            />
            {emailError && <ErrorMessage>{emailError}</ErrorMessage>}
          </InputContainer>
          <InputContainer>
            <Label htmlFor='password'>Password</Label>
            <Input
              id='password'
              type='password'
              placeholder='Enter your password'
              value={password}
              onChange={handlePasswordChange}
            />
            {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
          </InputContainer>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <ForgotPasswordLink to='/forgot-password'>
            Forgot password?
          </ForgotPasswordLink>
          <Button
            type='submit'
            primary
            disabled={isLoading}
            style={{ width: '100%', marginTop: '16px' }}
          >
            {isLoading ? 'LOGGING IN...' : 'LOGIN'}
          </Button>
          <SignUpText>
            Don't have an account yet? <Link to='/register'>Sign up</Link>
          </SignUpText>
        </LoginForm>
      </LoginContainer>
    </ModalOverlay>
  );
};

export default LoginModal;
