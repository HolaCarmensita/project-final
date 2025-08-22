import React from 'react';
import styled from 'styled-components';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import useAuthStore from '../../store/useAuthStore';

const RegisterContainer = styled.div`
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

const RegisterForm = styled.form`
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

const AlreadyAccountText = styled.p`
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

const SuccessMessage = styled.div`
  color: #28a745;
  font-size: 14px;
  margin-top: 16px;
  padding: 12px;
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
`;

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatedPassword, setRepeatedPassword] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setFirstNameError('');
    setLastNameError('');
    setEmailError('');
    setPasswordError('');
    clearError();
    setIsSuccess(false);

    let hasErrors = false;

    // Validate firstName
    if (!firstName.trim()) {
      setFirstNameError('First name is required');
      hasErrors = true;
    } else if (firstName.trim().length < 2) {
      setFirstNameError('First name must be at least 2 characters');
      hasErrors = true;
    }

    // Validate lastName
    if (!lastName.trim()) {
      setLastNameError('Last name is required');
      hasErrors = true;
    } else if (lastName.trim().length < 2) {
      setLastNameError('Last name must be at least 2 characters');
      hasErrors = true;
    }

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
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      hasErrors = true;
    }

    // Validate password confirmation
    if (!repeatedPassword) {
      setPasswordError('Please confirm your password');
      hasErrors = true;
    } else if (password !== repeatedPassword) {
      setPasswordError('Passwords do not match');
      hasErrors = true;
    }

    // If any errors, stop here
    if (hasErrors) {
      return;
    }

    // Real registration API call
    try {
      await register({ firstName, lastName, email, password });
      // Show success message
      setIsSuccess(true);
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      // Error is already handled by the store
      console.error('Registration failed:', error);
    }
  };

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
    setFirstNameError(''); // Clear error when user types
    clearError(); // Clear any general errors when user starts typing
    setIsSuccess(false); // Clear success state when user starts typing
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
    setLastNameError(''); // Clear error when user types
    clearError(); // Clear any general errors when user starts typing
    setIsSuccess(false); // Clear success state when user starts typing
  };

  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);

    // Clear email error when user starts typing
    if (emailValue === '') {
      setEmailError('');
      return;
    }
    clearError(); // Clear any general errors when user starts typing
    setIsSuccess(false); // Clear success state when user starts typing
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
    clearError(); // Clear any general errors when user starts typing
    setIsSuccess(false); // Clear success state when user starts typing
  };

  const handlePasswordConfirmation = (e) => {
    setRepeatedPassword(e.target.value);

    // Clear password error when user types
    setPasswordError('');

    // Check if passwords match when both fields have values
    if (password && e.target.value && password !== e.target.value) {
      setPasswordError('Passwords do not match');
    } else if (password && e.target.value && password === e.target.value) {
      setPasswordError(''); // Clear error when passwords match
    }
    clearError(); // Clear any general errors when user starts typing
    setIsSuccess(false); // Clear success state when user starts typing
  };

  return (
    <RegisterContainer>
      {/* <WelcomeText>
        <h2>
          Welcome to Penive, a place to explore, share and connect with creative
          ideas and minds.
        </h2>

        <h2> Please login or register to get started.</h2>
      </WelcomeText> */}

      <RegisterForm onSubmit={handleSubmit}>
        <Title>Register</Title>

        <InputContainer>
          <Label htmlFor='firstName'>First Name</Label>
          <Input
            id='firstName'
            type='text'
            placeholder='Enter your first name'
            value={firstName}
            onChange={handleFirstNameChange}
          />
          {firstNameError && <ErrorMessage>{firstNameError}</ErrorMessage>}
        </InputContainer>

        <InputContainer>
          <Label htmlFor='lastName'>Last Name</Label>
          <Input
            id='lastName'
            type='text'
            placeholder='Enter your last name'
            value={lastName}
            onChange={handleLastNameChange}
          />
          {lastNameError && <ErrorMessage>{lastNameError}</ErrorMessage>}
        </InputContainer>

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
          {passwordError && <ErrorMessage> {passwordError} </ErrorMessage>}
        </InputContainer>

        <InputContainer>
          <Label htmlFor='password-repeat'>Repeat Password</Label>
          <Input
            id='password-repeat'
            type='password'
            placeholder='Repeat password'
            value={repeatedPassword}
            onChange={handlePasswordConfirmation}
          />
          {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
        </InputContainer>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {isSuccess && (
          <SuccessMessage>
            Registration successful! Redirecting to login page...
          </SuccessMessage>
        )}

        <Button
          type='submit'
          primary
          disabled={isLoading || isSuccess}
          style={{ width: '100%', marginTop: '16px' }}
        >
          {isLoading ? 'REGISTER...' : isSuccess ? 'SUCCESS!' : 'REGISTER'}
        </Button>

        <AlreadyAccountText>
          Already have an account? <Link to='/login'>Login</Link>
        </AlreadyAccountText>
      </RegisterForm>
    </RegisterContainer>
  );
};

export default RegisterPage;
