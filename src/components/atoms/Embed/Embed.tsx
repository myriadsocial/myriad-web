import React from 'react';

import { useStyles } from './Embed.styles';
import { RedditEmbed } from './Reddit/RedditEmbed';
import { TweetEmbed } from './Twitter/TweetEmbed';
import { YouTubeEmbed } from './YouTube/YoutubeEmbed';

import { Loading } from 'src/components/atoms/Loading';
import ShowIf from 'src/components/common/show-if.component';
import { SocialsEnum } from 'src/interfaces/social';
import { extractYouTubeVideoId } from 'src/helpers/url';

type EmbedProps = {
  social: SocialsEnum;
  url: string;
  postId: string;
  showError?: boolean;
  onError?: () => void;
  onLoad?: () => void;
  onClick?: () => void;
};

export const Embed: React.FC<EmbedProps> = ({
  social,
  url,
  postId,
  onClick,
  onError,
  onLoad,
}) => {
  const styles = useStyles();

  const handleClick = (): void => {
    if (onClick) onClick();
  };

  // Extract YouTube Video ID
  const youtubeVideoId = social === SocialsEnum.YOUTUBE ? extractYouTubeVideoId(url) : null;
  
  return (
    <div className={styles.root} onClick={handleClick}>
      <ShowIf condition={social === SocialsEnum.TWITTER}>
        <div className={styles.embed}>
          <TweetEmbed
            tweetId={postId}
            options={{ height: 560 }}
            placeholder={<Loading />}
            onLoad={onLoad}
            onError={onError}
          />
        </div>
      </ShowIf>

      <ShowIf condition={social === SocialsEnum.REDDIT}>
        <RedditEmbed
          url={url}
          placeholder={<Loading />}
          onLoad={onLoad}
          onError={onError}
        />
      </ShowIf>

      <ShowIf condition={social === SocialsEnum.YOUTUBE && !!youtubeVideoId}>
        <YouTubeEmbed
          videoId={youtubeVideoId}
          placeholder={<Loading />}
          onLoad={onLoad}
          onError={onError}
        />
      </ShowIf>
    </div>
  );
};
