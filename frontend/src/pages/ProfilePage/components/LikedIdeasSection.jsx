import React from 'react';
import { useIdeasStore } from '../../../store/useIdeasStore';
import SectionHeader from '../../../components/SectionHeader';
import StackedIdeaCards from '../../../components/StackedIdeaCards';
import ColorIdeaCard from '../../../components/ColorIdeaCard';
import UnstackToggleButton from '../../../components/UnstackToggleButton';
import CardActions from '../../../components/CardActions';
import IconButton from '../../../components/IconButton';
import OpenIdeaButton from '../../../components/OpenIdeaButton';
import heartBrokenIcon from '../../../assets/icons/heart_broken.svg';

export default function LikedIdeasSection() {
  const ideas = useIdeasStore((s) => s.ideas);
  const likedIds = useIdeasStore((s) => s.likedIds);
  const unlikeIdea = useIdeasStore((s) => s.unlikeIdea);
  const likedIdeas = React.useMemo(() => ideas.filter((i) => likedIds.includes(i.id)), [ideas, likedIds]);
  const [unstacked, setUnstacked] = React.useState(false);

  return (
    <section style={{ marginBottom: 60 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
        <SectionHeader
          title="Liked ideas"
          count={likedIdeas.length}
        />
        <UnstackToggleButton unstacked={unstacked} onClick={() => setUnstacked((v) => !v)} />
      </div>
      <StackedIdeaCards
        ideas={likedIdeas}
        renderContent={(idea) => (
          <ColorIdeaCard
            idea={idea}
            actions={
              <CardActions>
                <IconButton
                  aria-label="Remove like"
                  title="Remove like"
                  iconSrc={heartBrokenIcon}
                  onClick={(e) => { e.stopPropagation(); unlikeIdea(idea.id); }}
                />
              </CardActions>
            }
            openButton={
              <OpenIdeaButton ideaId={idea.id} to={`/ideas/${idea.id}`} title={idea.title} />
            }
            showDate={true}
          />
        )}
        unstacked={unstacked}
      />
    </section>
  );
}
