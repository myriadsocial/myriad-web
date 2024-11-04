import React from 'react';
import { YouTubeEmbed } from 'src/components/atoms/Embed/YouTube/YoutubeEmbed';
import LinkifyComponent from 'src/components/common/Linkify.component';

type RenderYouTubeProps = {
  text: string;
  onHashtagClicked: (hashtag: string) => void;
  videoId: string;
};

export const RenderYouTube: React.FC<RenderYouTubeProps> = ({
  text,
  onHashtagClicked,
  videoId,
}) => {
  return (
    <div style={{ paddingBottom: 6 }}>
      <YouTubeEmbed videoId={videoId} placeholder={<p>Loading video...</p>} />
      <LinkifyComponent
        text={text}
        handleClick={onHashtagClicked}
        variant="body1"
        color="textPrimary"
        gutterBottom
      />
    </div>
  );
};

export default RenderYouTube;