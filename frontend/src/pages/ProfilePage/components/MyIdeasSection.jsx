import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import editIcon from '../../../assets/icons/edit_square_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.svg';
import deleteIcon from '../../../assets/icons/delete_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.svg';
import { useIdeasStore } from '../../../store/useIdeasStore';
import { useAuthStore } from '../../../store/useAuthStore';
import SectionHeader from '../../../components/SectionHeader';
import OpenIdeaButton from '../../../components/OpenIdeaButton';
import CardActions from '../../../components/CardActions';
import IconButton from '../../../components/IconButton';
import StackedIdeaCards from '../../../components/StackedIdeaCards';
import ColorIdeaCard from '../../../components/ColorIdeaCard';
import UnstackToggleButton from '../../../components/UnstackToggleButton';

const Section = styled.section`
  margin-bottom: 60px;
`;

export default function MyIdeasSection() {
  const navigate = useNavigate();
  const ideas = useIdeasStore((store) => store.ideas);
  const deleteIdea = useIdeasStore((store) => store.deleteIdea);
  const currentUser = useAuthStore((store) => store.user);

  const myIdeas = useMemo(
    () => ideas.filter((idea) => idea.creator?._id === currentUser?._id),
    [ideas, currentUser?._id]
  );
  const [unstacked, setUnstacked] = React.useState(false);

  return (
    <Section>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: 8,
        }}
      >
        <SectionHeader title='My ideas' count={myIdeas.length} />
        <UnstackToggleButton
          unstacked={unstacked}
          onClick={() => setUnstacked((v) => !v)}
        />
      </div>
      <StackedIdeaCards
        ideas={myIdeas}
        renderContent={(idea) => (
          <ColorIdeaCard
            idea={idea}
            actions={
              <CardActions>
                <IconButton
                  aria-label='Edit idea'
                  title='Edit'
                  iconSrc={editIcon}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/profile/my-idea/${idea._id}`);
                  }}
                />
                <IconButton
                  aria-label='Delete idea'
                  title='Delete'
                  iconSrc={deleteIcon}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteIdea(idea._id);
                  }}
                />
              </CardActions>
            }
            openButton={
              <OpenIdeaButton
                ideaId={idea._id}
                to={`/profile/my-idea/${idea._id}`}
                title={idea.title}
              />
            }
            showDate={true}
          />
        )}
        unstacked={unstacked}
      />
    </Section>
  );
}
