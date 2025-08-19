import React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';

const LoginContainer = styled.div`
  align-items: center;
  padding: 48px 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
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

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setEmailError('');
    setPasswordError('');
    setGeneralError('');

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

    setIsLoading(true);

    // Login API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call

      if (email === 'test@test.com' && password === 'test') {
        console.log('Login Success');
        navigate('/');
      } else {
        setGeneralError('Invalid email or password');
      }
    } catch (error) {
      setGeneralError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
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

  return (
    <LoginContainer>
      {/* <WelcomeText>
        <h2>
          Welcome to Penive, a place to explore, share and connect with creative
          ideas and minds.
        </h2>

        <h2> Please login or register to get started.</h2>
      </WelcomeText> */}

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

        {generalError && <ErrorMessage>{generalError}</ErrorMessage>}

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
  );
};

export default LoginPage;
