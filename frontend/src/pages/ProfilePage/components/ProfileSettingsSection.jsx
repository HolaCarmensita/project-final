import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../../store/useAuthStore';
import useUserStore from '../../../store/useUserStore';

const Section = styled.section``;

const SectionHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 10px;
  h3 {
    font-size: 18px;
    font-weight: 600;
  }
`;
const ProfileCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 2px solid #e9e9e9;
  margin-bottom: 10px;
`;
const Avatar = styled.div`
  width: 62px;
  height: 62px;
  border-radius: 8px;
  background: ${(p) => p.bg || '#E8E8E8'};
`;
const Name = styled.div`
  font-weight: 600;
`;
const Role = styled.div`
  color: #6b6b6b;
  font-size: 14px;
`;
const Field = styled.div`
  padding: 12px 0;
  border-bottom: 1px solid #eee;
  label {
    display: block;
    color: #6b6b6b;
    font-size: 12px;
    margin-bottom: 4px;
  }
  input,
  textarea {
    width: 100%;
    border: none;
    outline: none;
    font-size: 16px;
    color: #111;
    background: transparent;
    resize: none;
  }
`;
const ActionsRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 12px;
`;
const ActionButton = styled.button`
  flex: 1;
  padding: 14px 16px;
  border-radius: 14px;
  border: 1px solid #232323;
  background: ${(p) => (p.$primary ? '#232323' : '#fff')};
  color: ${(p) => (p.$primary ? '#fff' : '#232323')};
  cursor: pointer;
  font-size: 16px;
`;
const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 14px;
  margin-top: 10px;
`;

const DeleteConfirmModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;
const DeleteConfirmContent = styled.div`
  background-color: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  text-align: center;
  h3 {
    margin-bottom: 15px;
  }
  p {
    margin-bottom: 15px;
    color: #333;
  }
`;
const DeleteConfirmActions = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
`;

export default function ProfileSettingsSection() {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();
  const { deleteAccount, isLoading, error } = useUserStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    try {
      const result = await deleteAccount();
      if (result.success) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Delete account failed:', error);
    }
  };

  return (
    <Section>
      <SectionHeader>
        <h3>Profile settings</h3>
      </SectionHeader>
      <ProfileCard>
        <Avatar />
        <div>
          <Name>{user?.fullName || 'User'}</Name>
          <Role>{user?.role || 'User'}</Role>
        </div>
      </ProfileCard>

      <Field>
        <label>Name</label>
        <input defaultValue={user?.fullName || 'User'} />
      </Field>
      <Field>
        <label>Username</label>
        <input defaultValue={user?.email || 'user@example.com'} />
      </Field>
      <Field>
        <label>Title</label>
        <input defaultValue={user?.role || 'User'} />
      </Field>
      <Field>
        <label>Biography</label>
        <textarea
          rows={3}
          defaultValue={'Lorem Ipsum è un testo segnaposto.'}
        />
      </Field>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <ActionsRow>
        <ActionButton $primary onClick={handleLogout}>
          Log out
        </ActionButton>
        <ActionButton
          onClick={() => setShowDeleteConfirm(true)}
          disabled={isLoading}
          style={{
            backgroundColor: '#dc3545',
            color: '#fff',
            borderColor: '#dc3545',
          }}
        >
          {isLoading ? 'Deleting...' : 'Delete account'}
        </ActionButton>
      </ActionsRow>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <DeleteConfirmModal>
          <DeleteConfirmContent>
            <h3>Delete Account</h3>
            <p>
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>
            <p>All your ideas and data will be permanently deleted.</p>
            <DeleteConfirmActions>
              <ActionButton onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </ActionButton>
              <ActionButton
                onClick={handleDeleteAccount}
                style={{
                  backgroundColor: '#dc3545',
                  color: '#fff',
                  borderColor: '#dc3545',
                }}
              >
                Delete Account
              </ActionButton>
            </DeleteConfirmActions>
          </DeleteConfirmContent>
        </DeleteConfirmModal>
      )}
    </Section>
  );
}
