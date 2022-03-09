import React from 'react';
import {Tweet} from 'react-twitter-widgets';

import {useStyles} from './Embed.styles';

import ShowIf from 'src/components/common/show-if.component';
import {generateRedditEmbedUrl} from 'src/helpers/url';
import {SocialsEnum} from 'src/interfaces/social';

type EmbedProps = {
  social: SocialsEnum;
  url: string;
  postId: string;
  showError?: boolean;
  onError?: (message: string) => void;
  onClick?: () => void;
};

export const Embed: React.FC<EmbedProps> = props => {
  const {social, url, postId, onClick} = props;
  const styles = useStyles();

  const handleClick = (): void => {
    onClick && onClick();
  };

  return (
    <div className={styles.root} onClick={handleClick}>
      <ShowIf condition={social === SocialsEnum.TWITTER}>
        <div style={{margin: '0 auto', width: 560}}>
          <Tweet tweetId={postId} options={{height: 560}} />
        </div>
      </ShowIf>

      <ShowIf condition={social === SocialsEnum.REDDIT}>
        <iframe
          id="reddit-embed"
          title="Reddit preview"
          src={generateRedditEmbedUrl(url)}
          sandbox="allow-scripts allow-same-origin allow-popups"
          style={{border: 'none'}}
          width="780"
          height="560"
          scrolling="yes"
        />
      </ShowIf>

      <div id="fb-root" />
    </div>
  );
};
