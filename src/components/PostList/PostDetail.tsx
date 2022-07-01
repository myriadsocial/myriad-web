import React, {useCallback, useRef, useState} from 'react';

import dynamic from 'next/dynamic';

import Paper from '@material-ui/core/Paper';

import {PostDetailProps} from './PostDetail.interface';
import {useStyles} from './PostDetail.styles';
import {PostFooter} from './render/Footer';
import {PostHeader} from './render/Header';

import ShowIf from 'components/common/show-if.component';
import {PostRender} from 'src/components/PostEditor/PostRender';
import {LinkPreview} from 'src/components/atoms/LinkPreview';
import {NSFW} from 'src/components/atoms/NSFW/NSFW.component';
import {SendTipButton} from 'src/components/common/SendTipButton/SendTipButton';
import {ReferenceType} from 'src/interfaces/interaction';

const Reddit = dynamic(() => import('../PostDetail/render/Reddit'), {ssr: false});
const Twitter = dynamic(() => import('../PostDetail/render/Twitter'), {ssr: false});
const Gallery = dynamic(() => import('src/components/atoms/Gallery/Gallery'), {ssr: false});
const Video = dynamic(() => import('src/components/atoms/Video/Video'), {ssr: false});

export const PostDetail: React.FC<PostDetailProps> = React.memo(props => {
  const {user, post, votes, ...restProps} = props;
  const {onRemoveVote, onToggleDownvote, onUpvote, onShare, onShowComment} = restProps;

  const styles = useStyles();
  const ref = useRef<HTMLDivElement>(null);
  const mobile = false;

  const [contentHidden, setContentHidden] = useState(post.isNSFW);
  console.log('votes', votes);
  //TODO: tidier?
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

  const showContent = (): void => {
    setContentHidden(false);
  };

  //TODO: change this to link
  const handleHashtagClicked = useCallback(() => {
    // code
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

  const handleSharePost = useCallback(() => {
    onShare(post);
  }, []);

  return (
    <Paper square className={styles.root} ref={ref}>
      <PostHeader user={user} owned={owned} post={post} {...restProps} />

      <div className={styles.content}>
        <ShowIf condition={contentHidden}>
          <NSFW viewContent={showContent} />
        </ShowIf>

        <ShowIf condition={!contentHidden}>
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
          postId={post.id}
          metrics={post.metric}
          downvoted={downvoted}
          upvoted={upvoted}
          onDownVote={handleDownVote}
          onUpvote={handleUpvote}
          onShare={handleSharePost}
          onShowComments={onShowComment}
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
    </Paper>
  );
});

PostDetail.displayName = 'PostDetail';
