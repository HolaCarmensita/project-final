import React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { responsiveContainer } from '../../styles/breakpoints';
import Button from '../../components/Button';

const LoginContainer = styled.div`
  ${responsiveContainer}
  align-items: center;
  padding: 24px 16px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
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
  padding: 32px 24px;
`;

const Title = styled.h3`
  margin: 0 0 24px 0;
  font-weight: 600;
  text-align: center;
  color: #333;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  color: #333;
  margin: 14px 0 6px;
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

    // Check each field individually
    if (!email) {
      setEmailError('Email is required');
      return;
    }

    if (!password) {
      setPasswordError('Password is required');
      return;
    }

    setIsLoading(true);

    //fake api call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      if (email === 'test@test.com' && password === 'test') {
        console.log('Login Success');
        navigate('/');
      } else {
        setGeneralError('Invalid email or password');
      }
    } catch (error) {
      setGeneralError('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError(''); // Clear email error when user types
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError(''); // Clear password error when user types
  };

  return (
    <LoginContainer>
      <WelcomeText>
        <h2>
          Welcome to Penive, a place to explore, share and connect with creative
          ideas and minds.
        </h2>

        <h2> Please login or register to get started.</h2>
      </WelcomeText>

      <LoginForm onSubmit={handleSubmit}>
        <Title>Login</Title>

        <Label htmlFor='email'>Email</Label>
        <Input
          id='email'
          type='email'
          placeholder='Enter your email'
          value={email}
          onChange={handleEmailChange}
        />
        {emailError && (
          <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
            {emailError}
          </p>
        )}

        <Label htmlFor='password'>Password</Label>
        <Input
          id='password'
          type='password'
          placeholder='Enter your password'
          value={password}
          onChange={handlePasswordChange}
        />
        {passwordError && (
          <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
            {passwordError}
          </p>
        )}

        {generalError && (
          <p
            style={{
              color: 'red',
              fontSize: '14px',
              textAlign: 'center',
              marginTop: '8px',
            }}
          >
            {generalError}
          </p>
        )}

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
