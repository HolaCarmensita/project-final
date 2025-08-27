import React from 'react';
import { useIdeasStore } from '../../../store/useIdeasStore';
import { useUserStore } from '../../../store/useUserStore';
import { useInteractionsStore } from '../../../store/useInteractionsStore';
import SectionHeader from '../../../components/SectionHeader';
import StackedIdeaCards from '../../../components/StackedIdeaCards';
import ColorIdeaCard from '../../../components/ColorIdeaCard';
import UnstackToggleButton from '../../../components/UnstackToggleButton';
import CardActions from '../../../components/CardActions';
import IconButton from '../../../components/IconButton';
import OpenIdeaButton from '../../../components/OpenIdeaButton';
import heartBrokenIcon from '../../../assets/icons/heart_broken.svg';

export default function LikedIdeasSection() {
  const ideas = useIdeasStore((store) => store.ideas);
  const user = useUserStore((store) => store.user);
  const unlikeIdea = useInteractionsStore((store) => store.unlikeIdea);

  const likedIdeas = React.useMemo(() => {
    if (!user?.likedIdeas || !ideas.length) return [];

    // Get the liked idea IDs from user data - handle both strings and objects
    const likedIds = user.likedIdeas.map((id) =>
      typeof id === 'string' ? id : id._id || id
    );

    // Filter ideas to only show the ones the user has liked
    return ideas.filter((idea) => likedIds.includes(idea._id));
  }, [ideas, user?.likedIdeas]);

  const [unstacked, setUnstacked] = React.useState(false);

  return (
    <section>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: 8,
        }}
      >
        <SectionHeader title='Liked ideas' count={likedIdeas.length} />
        <UnstackToggleButton
          unstacked={unstacked}
          onClick={() => setUnstacked((v) => !v)}
        />
      </div>
      <StackedIdeaCards
        ideas={likedIdeas}
        renderContent={(idea) => (
          <ColorIdeaCard
            idea={idea}
            actions={
              <CardActions>
                <IconButton
                  aria-label='Remove like'
                  title='Remove like'
                  iconSrc={heartBrokenIcon}
                  onClick={(e) => {
                    e.stopPropagation();
                    unlikeIdea(idea._id);
                  }}
                />
              </CardActions>
            }
            openButton={
              <OpenIdeaButton
                ideaId={idea._id}
                to={`/ideas/${idea._id}`}
                title={idea.title}
              />
            }
            showDate={true}
          />
        )}
        unstacked={unstacked}
      />
    </section>
  );
}
