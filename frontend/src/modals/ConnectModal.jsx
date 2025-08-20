import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../components/Button';
import { useIdeasStore } from '../store/useIdeasStore';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
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
  box-shadow: 0 12px 40px rgba(0,0,0,0.25);
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

export default function ConnectModal() {
  const isOpen = useIdeasStore((s) => s.isConnectOpen);
  const target = useIdeasStore((s) => s.connectTarget);
  const close = useIdeasStore((s) => s.closeConnectModal);
  const submit = useIdeasStore((s) => s.submitConnection);
  const [message, setMessage] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    submit(message);
    setMessage('');
  };

  const userName = target?.userName || 'this user';

  return (
    <>
      <Overlay open={isOpen} onClick={close} />
      {isOpen && (
        <Sheet role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
          <form onSubmit={onSubmit}>
            <Title>{`Connect to ${userName}'s Idea`}</Title>
            <Label htmlFor="connect-msg">Write a personal message</Label>
            <TextArea
              id="connect-msg"
              placeholder="Hi! I like your thought...."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div style={{ color: '#888', fontSize: 14, marginTop: 8 }}>
              {`Write a personal message to ${userName}`}
            </div>
            <Row>
              <Button type="button" onClick={close}>CANCEL</Button>
              <Button type="submit" primary>CONNECT</Button>
            </Row>
          </form>
        </Sheet>
      )}
    </>
  );
}


