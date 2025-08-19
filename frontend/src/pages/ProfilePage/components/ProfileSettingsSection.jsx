import React from 'react';
import styled from 'styled-components';

const Section = styled.section`
  margin-bottom: 60px;
`;
const SectionHeader = styled.div`
  display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 10px;
  h3 { font-size: 18px; font-weight: 600; }
`;
const ProfileCard = styled.div`
  display: grid; grid-template-columns: 40px 1fr; gap: 12px; padding: 12px 0; border-bottom: 2px solid #e9e9e9; margin-bottom: 10px;
`;
const Avatar = styled.div`
  width: 56px; height: 56px; border-radius: 8px; background: ${(p) => p.bg || '#E8E8E8'};
`;
const Name = styled.div` font-weight: 600; `;
const Role = styled.div` color: #6b6b6b; font-size: 14px; `;
const Field = styled.div`
  padding: 12px 0; border-bottom: 1px solid #eee;
  label { display: block; color: #6b6b6b; font-size: 12px; margin-bottom: 4px; }
  input, textarea { width: 100%; border: none; outline: none; font-size: 16px; color: #111; background: transparent; resize: none; }
`;
const ActionsRow = styled.div` display: flex; gap: 12px; margin-top: 12px; `;
const ActionButton = styled.button`
  flex: 1; padding: 14px 16px; border-radius: 14px; border: 1px solid #232323; background: ${(p) => (p.primary ? '#232323' : '#fff')}; color: ${(p) => (p.primary ? '#fff' : '#232323')}; cursor: pointer; font-size: 16px;
`;

export default function ProfileSettingsSection() {
  return (
    <Section>
      <SectionHeader>
        <h3>Profile settings</h3>
      </SectionHeader>
      <ProfileCard>
        <Avatar />
        <div>
          <Name>John Doe</Name>
          <Role>Designer</Role>
        </div>
      </ProfileCard>

      <Field>
        <label>Name</label>
        <input defaultValue="John Doe" />
      </Field>
      <Field>
        <label>Username</label>
        <input defaultValue="John Doe" />
      </Field>
      <Field>
        <label>Title</label>
        <input defaultValue="Designer" />
      </Field>
      <Field>
        <label>Biography</label>
        <textarea rows={3} defaultValue={'Lorem Ipsum è un testo segnaposto.'} />
      </Field>

      <ActionsRow>
        <ActionButton primary>Log out</ActionButton>
        <ActionButton>Delete account</ActionButton>
      </ActionsRow>
    </Section>
  );
}
