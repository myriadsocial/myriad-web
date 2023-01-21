import React, {useCallback, useState} from 'react';

import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';

import {Typography, useMediaQuery, useTheme} from '@material-ui/core';

import {PostDetailProps} from './PostDetail.interface';
import {useStyles} from './PostDetail.styles';
import {PostFooter} from './render/Footer';
import {PostHeader} from './render/Header';

import ButtonPayment from 'components/ExclusiveContentCreate/Payment/ButtonPayment';
import Reveal from 'components/ExclusiveContentCreate/Reveal/Reveal';
import {NodeViewer} from 'components/common/NodeViewer';
import {ExclusiveContent} from 'components/common/Tipping/Tipping.interface';
import ShowIf from 'components/common/show-if.component';
import {LinkPreview} from 'src/components/atoms/LinkPreview';
import {NSFW} from 'src/components/atoms/NSFW/NSFW.component';
import {SendTipButton} from 'src/components/common/SendTipButton/SendTipButton';
import {isJson} from 'src/helpers/string';
import {useToggle} from 'src/hooks/use-toggle.hook';
import {InfoIconYellow} from 'src/images/Icons';
import {ReferenceType} from 'src/interfaces/interaction';
import i18n from 'src/locale';

const Reddit = dynamic(() => import('./render/Reddit'), {ssr: false});
const Twitter = dynamic(() => import('./render/Twitter'), {ssr: false});
const Gallery = dynamic(() => import('src/components/atoms/Gallery/Gallery'), {ssr: false});
const Video = dynamic(() => import('src/components/atoms/Video/Video'), {ssr: false});

export const PostDetail: React.FC<PostDetailProps> = props => {
  const {user, post, type, expand, preview, ...restProps} = props;
  const {onRemoveVote, onToggleDownvote, onUpvote, onToggleShowComment} = restProps;
  const router = useRouter();
  const styles = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const [hiddenContent, toggleHiddenContent] = useToggle(post.isNSFW);

  const [exclusiveContent, setExclusiveContent] = useState<ExclusiveContent>();

  const downvoted = post.votes
    ? post.votes.filter(vote => vote.userId === user?.id && !vote.state).length > 0
    : false;
  const upvoted = post.votes
    ? post.votes.filter(vote => vote.userId === user?.id && vote.state).length > 0
    : false;

  const isPostCreator = post.createdBy === user?.id;
  const isInternalPost = post.platform === 'myriad';
  const isExternalPost = post.platform !== 'myriad';
  const isOriginOwner = post?.people?.userSocialMedia?.userId === user?.id;
  const showTipButton = (isInternalPost && !isPostCreator) || (isExternalPost && !isOriginOwner);
  const isPostOwner = isInternalPost ? isPostCreator : isOriginOwner;
  const isAssetImageExist = post?.asset?.images && post?.asset?.images?.length > 0;
  const isAssetVideoExist = post?.asset?.videos && post?.asset?.videos?.length > 0;
  const showEmbedded =
    post?.asset?.images?.length === 0 &&
    post?.asset?.videos?.length === 0 &&
    post.embeddedURL &&
    post.deletedAt;
  const isHtmlPost = isInternalPost && !isJson(post.text);

  const handleHashtagClicked = useCallback((hashtag: string) => {
    router.push(`/topic/hashtag?tag=${hashtag.replace('#', '')}`, undefined, {
      shallow: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpvote = useCallback(() => {
    if (upvoted) {
      onRemoveVote(post);
    } else {
      onUpvote(post);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [upvoted]);

  const handleDownVote = useCallback(() => {
    if (downvoted || upvoted) {
      onRemoveVote(post);
    } else {
      onToggleDownvote(post);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downvoted, upvoted]);

  return (
    <div className={styles.wrapper}>
      <PostHeader user={user} owned={isPostCreator} post={post} {...restProps} />

      <div className={styles.content}>
        <ShowIf condition={hiddenContent}>
          <NSFW viewContent={toggleHiddenContent} />
        </ShowIf>

        <ShowIf condition={!hiddenContent}>
          <ShowIf condition={post.visibility === 'selected_user'}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: 16,
                backgroundColor: '#FFC85733',
                padding: '6px 10px',
                columnGap: '10px',
              }}>
              <InfoIconYellow />
              <Typography style={{fontSize: 12, color: '#404040'}}>
                {i18n.t('Visibilities.PostVisibilities')}
              </Typography>
            </div>
          </ShowIf>

          <ShowIf condition={['myriad'].includes(post.platform) && !isHtmlPost}>
            <NodeViewer
              id={`${post.id}-${preview ? 'preview' : ''}`}
              text={post.text}
              expand={expand}
            />
          </ShowIf>

          <ShowIf condition={['myriad'].includes(post.platform) && isHtmlPost}>
            <div dangerouslySetInnerHTML={{__html: post.text}} />
          </ShowIf>

          <ShowIf condition={['twitter'].includes(post.platform) && post.text.length > 0}>
            <Twitter text={post.text} onHashtagClicked={handleHashtagClicked} />
          </ShowIf>

          <ShowIf condition={['reddit'].includes(post.platform)}>
            <Reddit title={post.title} text={post.text} onHashtagClicked={handleHashtagClicked} />
          </ShowIf>

          {post.asset?.exclusiveContents &&
            post.asset?.exclusiveContents.length > 0 &&
            !exclusiveContent && (
              <ButtonPayment
                id={post.asset?.exclusiveContents[0]}
                contentId={post?.id}
                setExclusive={setExclusiveContent}
              />
            )}

          {exclusiveContent && <Reveal content={exclusiveContent} />}

          {isAssetImageExist && <Gallery images={post.asset?.images} variant="vertical" />}

          {isAssetVideoExist && <Video url={post.asset.videos[0]} height={308} width={560} />}

          {showEmbedded && <LinkPreview embed={post.embeddedURL} />}
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
            owned={isPostOwner}
            showIcon={isMobile}
            mobile={isMobile}
            variant="outlined"
            color="secondary"
            size="small"
          />
        </ShowIf>
      </div>
    </div>
  );
};
