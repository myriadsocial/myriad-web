import React, {useCallback} from 'react';

import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';

import {PostDetailProps} from './PostDetail.interface';
import {useStyles} from './PostDetail.styles';
import {PostFooter} from './render/Footer';
import {PostHeader} from './render/Header';

import ShowIf from 'components/common/show-if.component';
import {PostRender} from 'src/components/PostEditor/PostRender';
import {LinkPreview} from 'src/components/atoms/LinkPreview';
import {NSFW} from 'src/components/atoms/NSFW/NSFW.component';
import {SendTipButton} from 'src/components/common/SendTipButton/SendTipButton';
import {useToggle} from 'src/hooks/use-toggle.hook';
import {ReferenceType} from 'src/interfaces/interaction';

const Reddit = dynamic(() => import('./render/Reddit'), {ssr: false});
const Twitter = dynamic(() => import('./render/Twitter'), {ssr: false});
const Gallery = dynamic(() => import('src/components/atoms/Gallery/Gallery'), {ssr: false});
const Video = dynamic(() => import('src/components/atoms/Video/Video'), {ssr: false});

export const PostDetail: React.FC<PostDetailProps> = React.memo(props => {
  const {user, post, type, ...restProps} = props;
  const {onRemoveVote, onToggleDownvote, onUpvote, onToggleShowComment} = restProps;

  const router = useRouter();
  const styles = useStyles();
  const mobile = false;

  const [hiddenContent, toggleHiddenContent] = useToggle(post.isNSFW);

  const owned = post.createdBy === user?.id;
  const downvoted = post.votes
    ? post.votes.filter(vote => vote.userId === user.id && !vote.state).length > 0
    : false;
  const upvoted = post.votes
    ? post.votes.filter(vote => vote.userId === user.id && vote.state).length > 0
    : false;
  const isOwnSocialPost = user?.people?.find(person => person.id === post.peopleId) ? true : false;
  const isImportedPost = post.platform !== 'myriad' || post.createdBy !== user?.id ? true : false;
  const showTipButton = isImportedPost && !isOwnSocialPost;

  const handleHashtagClicked = useCallback((hashtag: string) => {
    router.push(`/topic/hashtag?tag=${hashtag.replace('#', '')}`, undefined, {
      shallow: true,
    });
  }, []);

  const handleUpvote = useCallback(() => {
    if (upvoted) {
      onRemoveVote(post);
    } else {
      onUpvote(post);
    }
  }, []);

  const handleDownVote = useCallback(() => {
    if (downvoted || upvoted) {
      onRemoveVote(post);
    } else {
      onToggleDownvote(post);
    }
  }, []);

  return (
    <>
      <PostHeader user={user} owned={owned} post={post} {...restProps} />

      <div className={styles.content}>
        <ShowIf condition={hiddenContent}>
          <NSFW viewContent={toggleHiddenContent} />
        </ShowIf>

        <ShowIf condition={!hiddenContent}>
          <ShowIf condition={['myriad'].includes(post.platform)}>
            <PostRender post={post} />
          </ShowIf>

          <ShowIf condition={['twitter'].includes(post.platform)}>
            <Twitter text={post.text} onHashtagClicked={handleHashtagClicked} />
          </ShowIf>

          <ShowIf condition={['reddit'].includes(post.platform)}>
            <Reddit title={post.title} text={post.text} onHashtagClicked={handleHashtagClicked} />
          </ShowIf>

          {post.asset?.images && post.asset?.images.length > 0 && (
            <Gallery images={post.asset?.images} variant="vertical" />
          )}

          {post.asset?.videos && post.asset.videos.length > 0 && (
            <Video url={post.asset.videos[0]} height={308} width={560} />
          )}

          {post.asset?.images.length === 0 &&
            post.asset.videos.length === 0 &&
            post.embeddedURL &&
            !post.deletedAt && <LinkPreview embed={post.embeddedURL} />}
        </ShowIf>
      </div>

      <div className={styles.action}>
        <PostFooter
          type={type}
          postId={post.id}
          metrics={post.metric}
          downvoted={downvoted}
          upvoted={upvoted}
          onDownVote={handleDownVote}
          onUpvote={handleUpvote}
          onShowComments={onToggleShowComment}
        />

        <ShowIf condition={showTipButton}>
          <SendTipButton
            reference={post}
            referenceType={ReferenceType.POST}
            showIcon={mobile}
            mobile={mobile}
            variant="outlined"
            color="secondary"
            size="small"
          />
        </ShowIf>
      </div>
    </>
  );
});

PostDetail.displayName = 'PostDetail';
