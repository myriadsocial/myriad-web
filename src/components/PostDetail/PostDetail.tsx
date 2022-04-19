import React, {useState, useRef} from 'react';

import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';

import {useMediaQuery, useTheme} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';

import {PostRender} from '../PostEditor/PostRender';
import {NSFW} from '../atoms/NSFW/NSFW.component';
import {PostActionComponent} from '../atoms/PostAction';
import {HeaderComponent} from '../atoms/PostHeader';
import {TabsComponent} from '../atoms/Tabs';
import {Video} from '../atoms/Video';
import {SendTipButton} from '../common/SendTipButton/SendTipButton';
import {useStyles} from './PostDetail.styles';
import {useCommentTabs} from './hooks/use-comment-tabs';

import {LinkPreview} from 'src/components/atoms/LinkPreview';
import ShowIf from 'src/components/common/show-if.component';
import {Comment} from 'src/interfaces/comment';
import {ReferenceType, SectionType} from 'src/interfaces/interaction';
import {Post} from 'src/interfaces/post';
import {User} from 'src/interfaces/user';

const Gallery = dynamic(() => import('../atoms/Gallery/Gallery'), {ssr: false});
const Reddit = dynamic(() => import('./render/Reddit'), {ssr: false});
const Twitter = dynamic(() => import('./render/Twitter'), {ssr: false});

type PostDetailProps = {
  user?: User;
  post: Post;
  anonymous: boolean;
  toggleDownvoting: (reference: Post | Comment | null) => void;
  onUpvote: (reference: Post | Comment) => void;
  onRemoveVote: (reference: Post | Comment) => void;
  onOpenTipHistory: (post: Post) => void;
  onDelete?: (post: Post) => void;
  onReport: (post: Post) => void;
  onVisibility: (post: Post) => void;
  onShared: (post: Post, type: 'link' | 'post') => void;
  onImporters: (post: Post) => void;
  expanded?: boolean;
  type?: 'share' | 'default';
};

export const PostDetail: React.FC<PostDetailProps> = props => {
  const {
    user,
    post,
    onUpvote,
    onRemoveVote,
    toggleDownvoting,
    onOpenTipHistory,
    onImporters,
    onDelete,
    onReport,
    onVisibility,
    onShared,
    expanded = false,
    type = 'default',
  } = props;

  const styles = useStyles();
  const router = useRouter();
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('xs'));
  const ref = useRef<HTMLDivElement>(null);

  const {
    selected: selectedCommentTab,
    setSelected: setSelectedCommentTab,
    tabs,
  } = useCommentTabs(post, ref);

  const [shoWcomment, setShowComment] = useState(expanded);
  const [maxLength, setMaxLength] = useState<number | undefined>(250);
  const [viewContent, setViewContent] = useState(!post.isNSFW);

  const isPostOwner = post.createdBy === user?.id;
  const isOwnSocialPost = user?.people?.find(person => person.id === post.peopleId) ? true : false;
  const isImportedPost = post.platform !== 'myriad' || post.createdBy !== user?.id ? true : false;
  const showTipButton = isImportedPost && !isOwnSocialPost && type !== 'share';

  const onHashtagClicked = async (hashtag: string) => {
    await router.push(`/topic/hashtag?tag=${hashtag.replace('#', '')}`, undefined, {
      shallow: true,
    });
  };

  const handleUpvote = async () => {
    if (type === 'share') return;

    if (!post.isUpvoted) {
      onUpvote(post);
    } else {
      onRemoveVote(post);
    }
  };

  const handleDownVote = async () => {
    if (type === 'share') return;

    if (!post.isDownVoted) {
      toggleDownvoting(post);

      setShowComment(true);
      setSelectedCommentTab(SectionType.DEBATE);
    } else {
      onRemoveVote(post);
    }
  };

  const handleChangeTab = (tab: SectionType) => {
    setSelectedCommentTab(tab);

    toggleDownvoting(null);
  };

  const handleViewContent = () => {
    setViewContent(true);
  };

  const toggleShowComments = () => {
    if (type === 'share') return;

    setShowComment(prev => !prev);

    toggleDownvoting(null);
  };

  const handleDeletePost = () => {
    if (onDelete) {
      onDelete(post);
    }
  };

  const handleReportPost = () => {
    onReport(post);
  };

  const handleImporters = () => {
    onImporters(post);
  };

  const handlePostVisibility = () => {
    onVisibility(post);
  };

  const handleShareLink = () => {
    onShared(post, 'link');
  };

  const handleOpenTipHistory = () => {
    onOpenTipHistory(post);
  };

  const showAll = () => {
    setMaxLength(undefined);
  };

  const urlLink = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return '';
  };

  return (
    <Paper square className={styles.root} ref={ref}>
      <HeaderComponent
        user={user}
        owner={isPostOwner}
        post={post}
        onOpenTipHistory={handleOpenTipHistory}
        onDelete={handleDeletePost}
        onReport={handleReportPost}
        onImporters={handleImporters}
        onVisibility={handlePostVisibility}
        disableAction={type === 'share'}
      />

      <div className={styles.content}>
        <ShowIf condition={!viewContent}>
          <NSFW viewContent={handleViewContent} />
        </ShowIf>

        <ShowIf condition={viewContent}>
          <ShowIf condition={['myriad'].includes(post.platform)}>
            <PostRender post={post} max={maxLength} onShowAll={showAll} />
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

      <div className={styles.action}>
        <PostActionComponent
          metrics={post.metric}
          upvoted={post.isUpvoted}
          downvoted={post.isDownVoted}
          onUpvote={handleUpvote}
          onDownVote={handleDownVote}
          onShowComments={toggleShowComments}
          embedUrl={`${urlLink()}/embed?id=${post.id}&type=post`}
          postUrl={`${urlLink()}/post/${post.id}`}
          onShared={handleShareLink}
          disableAction={type === 'share'}
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

      <ShowIf condition={shoWcomment}>
        <TabsComponent<SectionType>
          tabs={tabs}
          selected={selectedCommentTab}
          onChangeTab={handleChangeTab}
        />
      </ShowIf>
    </Paper>
  );
};
