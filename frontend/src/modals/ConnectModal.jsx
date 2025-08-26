import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../components/Button';
import { useUIStore } from '../store/useUIStore';
import { useIdeasStore } from '../store/useIdeasStore';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: ${(p) => (p.open ? 'block' : 'none')};
  z-index: 5000;
`;

const Sheet = styled.div`
  position: fixed;
  left: 50%;
  top: 8%;
  transform: translateX(-50%);
  width: min(560px, 95%);
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
  padding: 20px 18px 16px;
  z-index: 5001;
`;

const Title = styled.h3`
  margin: 0 0 12px 0;
  font-weight: 600;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  color: #333;
  margin: 14px 0 6px;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid #ddd;
  font-size: 16px;
  outline: none;
  resize: vertical;
`;

const Row = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 18px;
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
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

export default function ConnectModal() {
  const isOpen = useUIStore((s) => s.isConnectOpen);
  const target = useUIStore((s) => s.connectTarget);
  const close = useUIStore((s) => s.setIsConnectOpen);
  const [message, setMessage] = useState('');
  const [messageError, setMessageError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Get store functions
  const connectToIdea = useIdeasStore((state) => state.connectToIdea);
  const isLoading = useIdeasStore((state) => state.isLoading);
  const error = useIdeasStore((state) => state.error);
  const clearError = useIdeasStore((state) => state.clearError);

  const validateForm = () => {
    let isValid = true;

    // Clear previous errors
    setMessageError('');
    clearError();

    // Validate message
    if (!message.trim()) {
      setMessageError('Message is required');
      isValid = false;
    } else if (message.trim().length < 5) {
      setMessageError('Message must be at least 5 characters');
      isValid = false;
    } else if (message.trim().length > 500) {
      setMessageError('Message must be less than 500 characters');
      isValid = false;
    }

    return isValid;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const result = await connectToIdea(target?.ideaId, message.trim());

      if (result.success) {
        setIsSuccess(true);
        setMessage('');

        // Close modal after 2 seconds
        setTimeout(() => {
          close(false);
          setIsSuccess(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to connect to idea:', error);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setMessage('');
      setMessageError('');
      clearError();
      setIsSuccess(false);
      close(false);
    }
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    setMessageError('');
    clearError();
    setIsSuccess(false);
  };

  const userName = target?.userName || 'this user';
  const ideaTitle = target?.ideaTitle || 'this idea';

  return (
    <>
      <Overlay open={isOpen} onClick={handleClose} />
      {isOpen && (
        <Sheet
          role='dialog'
          aria-modal='true'
          onClick={(e) => e.stopPropagation()}
        >
          <form onSubmit={onSubmit}>
            <Title>{`Connect to ${userName}'s Idea`}</Title>
            <h4>{`${ideaTitle}`}</h4>
            <Label htmlFor='connect-msg'>Write a personal message</Label>
            <TextArea
              id='connect-msg'
              placeholder='Hi! I like your thought....'
              value={message}
              onChange={handleMessageChange}
              disabled={isLoading || isSuccess}
            />
            {messageError && <ErrorMessage>{messageError}</ErrorMessage>}
            <div style={{ color: '#888', fontSize: 14, marginTop: 8 }}>
              {`Write a personal message to ${userName}`}
            </div>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            {isSuccess && (
              <SuccessMessage>
                Connection request sent successfully! Closing modal...
              </SuccessMessage>
            )}

            <Row>
              <Button
                type='button'
                onClick={handleClose}
                disabled={isLoading || isSuccess}
              >
                CANCEL
              </Button>
              <Button type='submit' primary disabled={isLoading || isSuccess}>
                {isLoading ? 'SENDING...' : isSuccess ? 'SENT!' : 'CONNECT'}
              </Button>
            </Row>
          </form>
        </Sheet>
      )}
    </>
  );
}
