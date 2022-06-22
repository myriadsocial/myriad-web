import React from 'react';

import {useStyles} from './Embed.styles';
import {RedditEmbed} from './Reddit/RedditEmbed';
import {TweetEmbed} from './Twitter/TweetEmbed';

import {Loading} from 'src/components/atoms/Loading';
import ShowIf from 'src/components/common/show-if.component';
import {SocialsEnum} from 'src/interfaces/social';

type EmbedProps = {
  social: SocialsEnum;
  url: string;
  postId: string;
  showError?: boolean;
  onError?: () => void;
  onLoad?: () => void;
  onClick?: () => void;
};

export const Embed: React.FC<EmbedProps> = props => {
  const {social, url, postId, onClick, onError, onLoad} = props;
  const styles = useStyles();

  const handleClick = (): void => {
    onClick && onClick();
  };

  return (
    <div className={styles.root} onClick={handleClick}>
      <ShowIf condition={social === SocialsEnum.TWITTER}>
        <div className={styles.embed}>
          <TweetEmbed
            tweetId={postId}
            options={{height: 560}}
            placeholder={<Loading />}
            onLoad={onLoad}
            onError={onError}
          />
        </div>
      </ShowIf>

      <ShowIf condition={social === SocialsEnum.REDDIT}>
        <RedditEmbed url={url} placeholder={<Loading />} onLoad={onLoad} onError={onError} />
      </ShowIf>
    </div>
  );
};
