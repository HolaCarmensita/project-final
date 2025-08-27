import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useIdeasStore } from '../../store/useIdeasStore';
import TopBar from '../../components/TopBar';
import IconButton from '../../components/IconButton';
import editIcon from '../../assets/icons/edit_square_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.svg';
import deleteIcon from '../../assets/icons/delete_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.svg';
import aiIcon from '../../assets/icons/at_bold.svg';

const Page = styled.div`
  padding: 24px 18px 32px 18px;
  position: relative;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
`;
const BodyText = styled.p`
  font-size: 16px;
  color: #222;
  margin-bottom: 18px;
`;
const ImageGallery = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: 18px;
`;
const ImgWrap = styled.div`
  border-radius: 12px;
  overflow: hidden;
  background: #f7f7f7;
  margin-bottom: 4px;
  img {
    width: 100%;
    display: block;
  }
`;
const AltText = styled.div`
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
`;
const Connections = styled.div`
  margin-top: 18px;
  border-top: 1px solid #eee;
  padding-top: 12px;
`;
const ConnRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 15px;
  color: #232323;
`;
const DateRow = styled.div`
  font-size: 13px;
  color: #888;
  margin-top: 8px;
`;
const EditBar = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 18px;
`;
const Input = styled.input`
  width: 100%;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
  border: none;
  border-bottom: 1px solid #eee;
  background: #fff;
  color: #222;
`;
const TextArea = styled.textarea`
  width: 100%;
  font-size: 16px;
  margin-bottom: 18px;
  border: none;
  border-bottom: 1px solid #eee;
  background: #fff;
  color: #222;
  resize: none;
`;
const ActionBtn = styled.button`
  padding: 8px 18px;
  border-radius: 10px;
  border: 1px solid #232323;
  background: #232323;
  color: #fff;
  font-size: 15px;
  cursor: pointer;
  &:not(:last-child) {
    margin-right: 8px;
  }
`;

export default function MyIdeaCardEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const ideas = useIdeasStore((s) => s.ideas);
  const idea = ideas.find((i) => String(i._id) === String(id));
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(null);

  // Initialize form when idea is loaded
  React.useEffect(() => {
    if (idea) {
      setForm({
        title: idea.title,
        bodyText: idea.description,
        images: idea.images || [],
        altTexts: (idea.images || []).map(() => 'Alternative text'),
      });
    }
  }, [idea]);

  if (!idea) {
    return (
      <Page>
        <div>Idea not found.</div>
      </Page>
    );
  }

  if (!form) {
    return (
      <Page>
        <div>Loading...</div>
      </Page>
    );
  }

  const handleSave = () => {
    // For dev: just update local state, not persistent
    Object.assign(idea, {
      title: form.title,
      description: form.bodyText,
      images: form.images,
      altTexts: form.altTexts,
    });
    setEditMode(false);
  };

  return (
    <Page>
      <TopBar
        title='My Profile'
        actionLabel={editMode ? 'Cancel' : 'Edit'}
        onAction={() => setEditMode((v) => !v)}
      />
      {editMode ? (
        <EditBar>
          <ActionBtn onClick={handleSave}>Save</ActionBtn>
          <ActionBtn
            onClick={() => setEditMode(false)}
            style={{ background: '#fff', color: '#232323' }}
          >
            Cancel
          </ActionBtn>
        </EditBar>
      ) : null}
      {editMode ? (
        <Input
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        />
      ) : (
        <Title>{idea.title}</Title>
      )}

      <ImageGallery>
        {(form.images || idea.images || []).map((img, idx) => (
          <div key={img + idx}>
            <ImgWrap style={{ position: 'relative' }}>
              <img
                src={img}
                alt={form.altTexts ? form.altTexts[idx] : 'Alternative text'}
              />
              {editMode && (
                <IconButton
                  iconSrc={deleteIcon}
                  ariaLabel='Delete image'
                  title='Delete image'
                  onClick={() => {
                    setForm((f) => {
                      const images = [...f.images];
                      const altTexts = [...f.altTexts];
                      images.splice(idx, 1);
                      altTexts.splice(idx, 1);
                      return { ...f, images, altTexts };
                    });
                  }}
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    width: 28,
                    height: 28,
                    background: 'rgba(255,255,255,0.85)',
                    borderRadius: '50%',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    zIndex: 2,
                  }}
                />
              )}
            </ImgWrap>
          </div>
        ))}
        {editMode && (
          <div style={{ marginTop: 8 }}>
            <label
              style={{
                display: 'inline-block',
                cursor: 'pointer',
                color: '#3a7afe',
                fontWeight: 500,
              }}
            >
              + Add image
              <input
                type='file'
                accept='image/*'
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new window.FileReader();
                    reader.onload = (ev) => {
                      setForm((f) => ({
                        ...f,
                        images: [...f.images, ev.target.result],
                        altTexts: [...f.altTexts, 'Alternative text'],
                      }));
                    };
                    reader.readAsDataURL(file);
                  }
                  e.target.value = '';
                }}
              />
            </label>
          </div>
        )}
      </ImageGallery>

      {editMode ? (
        <TextArea
          rows={3}
          value={form.bodyText}
          onChange={(e) => setForm((f) => ({ ...f, bodyText: e.target.value }))}
        />
      ) : (
        <BodyText>{idea.description}</BodyText>
      )}

      {idea.connectedBy && idea.connectedBy.length > 0 && (
        <Connections>
          {idea.connectedBy.map((connection, index) => (
            <ConnRow key={connection._id || index}>
              <span
                role='img'
                aria-label='connected'
                style={{ color: '#3a7afe', fontSize: 18 }}
              >
                @
              </span>
              {connection.user?.fullName ||
                connection.user?.firstName ||
                'Unknown User'}{' '}
              connected{' '}
              <span style={{ marginLeft: 'auto', color: '#888', fontSize: 13 }}>
                {new Date(connection.connectedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </ConnRow>
          ))}
        </Connections>
      )}
      <DateRow>
        {new Date(idea.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
      </DateRow>
    </Page>
  );
}
