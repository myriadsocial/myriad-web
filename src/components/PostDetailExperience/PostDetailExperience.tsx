import React, {useState, useRef} from 'react';

import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';

import Paper from '@material-ui/core/Paper';

import {NSFW} from '../atoms/NSFW/NSFW.component';
import {Video} from '../atoms/Video';
import {useStyles} from './PostDetailExperience.styles';
import {HeaderComponentExperience} from './PostDetailExperienceHeader';

import {NodeViewer} from 'components/common/NodeViewer';
import {LinkPreview} from 'src/components/atoms/LinkPreview';
import ShowIf from 'src/components/common/show-if.component';
import {Post} from 'src/interfaces/post';
import {User} from 'src/interfaces/user';

const Gallery = dynamic(() => import('../atoms/Gallery/Gallery'), {ssr: false});
const Reddit = dynamic(() => import('../PostDetail/render/Reddit'), {ssr: false});
const Twitter = dynamic(() => import('../PostDetail/render/Twitter'), {ssr: false});

type PostDetailProps = {
  user?: User;
  post: Post;
  anonymous: boolean;
  onImporters: (post: Post) => void;
  onRemoveFromExperience?: () => void;
  expanded?: boolean;
  type?: 'preview' | 'default';
};

export const PostDetailExperience: React.FC<PostDetailProps> = props => {
  const {post, onImporters, onRemoveFromExperience, type = 'default', expanded} = props;

  const styles = useStyles();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  const [maxLength, setMaxLength] = useState<number | undefined>(250);
  const [viewContent, setViewContent] = useState(!post.isNSFW);

  const onHashtagClicked = async (hashtag: string) => {
    await router.push(`/topic/hashtag?tag=${hashtag.replace('#', '')}`, undefined, {
      shallow: true,
    });
  };

  const handleViewContent = () => {
    setViewContent(true);
  };

  const handleImporters = () => {
    onImporters(post);
  };

  const showAll = () => {
    setMaxLength(undefined);
  };

  return (
    <Paper square className={styles.root} ref={ref}>
      <HeaderComponentExperience
        post={post}
        onImporters={handleImporters}
        onRemoveFromExperience={onRemoveFromExperience}
        disableAction={type === 'preview'}
      />

      <div className={styles.content}>
        <ShowIf condition={!viewContent}>
          <NSFW viewContent={handleViewContent} />
        </ShowIf>

        <ShowIf condition={viewContent}>
          <ShowIf condition={['myriad'].includes(post.platform)}>
            <NodeViewer id={`${post.id}-${type}`} text={post.text} expand={expanded} />
          </ShowIf>

          <ShowIf condition={['twitter'].includes(post.platform)}>
            <Twitter text={post.text} onHashtagClicked={onHashtagClicked} />
          </ShowIf>

          <ShowIf condition={['reddit'].includes(post.platform)}>
            <Reddit
              title={post.title}
              text={post.text}
              maxLength={maxLength}
              onHashtagClicked={onHashtagClicked}
              onShowMore={showAll}
            />
          </ShowIf>

          {post.asset?.images && post.asset?.images.length > 0 && (
            <Gallery images={post.asset?.images} variant="vertical" />
          )}

          {post.asset?.videos && post.asset.videos.length > 0 && (
            <Video url={post.asset.videos[0]} width={560} />
          )}
        </ShowIf>

        {post.asset?.images.length === 0 &&
          post.asset.videos.length === 0 &&
          post.embeddedURL &&
          !post.deletedAt && <LinkPreview embed={post.embeddedURL} />}
      </div>
    </Paper>
  );
};
