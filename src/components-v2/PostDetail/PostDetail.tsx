import React, {useState} from 'react';
import {FacebookProvider, EmbeddedPost} from 'react-facebook';
import ReactMarkdown from 'react-markdown';
import {useSelector, useDispatch} from 'react-redux';

import {useRouter} from 'next/router';

import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';

import {PostRender} from '../PostEditor/PostRender';
import {ShowMore} from '../PostEditor/Render/ShowMore';
import {Button, ButtonVariant, ButtonColor, ButtonSize} from '../atoms/Button';
import {Gallery} from '../atoms/Gallery';
import {NSFW} from '../atoms/NSFW/NSFW.component';
import {PostActionComponent} from '../atoms/PostAction';
import {HeaderComponent} from '../atoms/PostHeader';
import {TabsComponent} from '../atoms/Tabs';
import {Video} from '../atoms/Video';
import {useStyles} from './PostDetail.styles';
import {useCommentTabs, CommentTabs} from './hooks/use-comment-tabs';

import remarkGFM from 'remark-gfm';
import remarkHTML from 'remark-html';
import {LinkPreview} from 'src/components-v2/atoms/LinkPreview';
import LinkifyComponent from 'src/components/common/Linkify.component';
import ShowIf from 'src/components/common/show-if.component';
import {Comment} from 'src/interfaces/comment';
import {Post} from 'src/interfaces/post';
import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';
import {BalanceState} from 'src/reducers/balance/reducer';
import {setTippedContent} from 'src/reducers/timeline/actions';

type PostDetailProps = {
  user?: User;
  post: Post;
  anonymous: boolean;
  toggleDownvoting: (reference: Post | Comment | null) => void;
  onUpvote: (reference: Post | Comment) => void;
  onRemoveVote: (reference: Post | Comment) => void;
  onSendTip: (post: Post) => void;
  onOpenTipHistory: (post: Post) => void;
  onDelete?: (post: Post) => void;
  onReport: (post: Post) => void;
  onShared: (post: Post, type: 'link' | 'post') => void;
  expanded?: boolean;
  type?: 'share' | 'default';
};

export const PostDetail: React.FC<PostDetailProps> = props => {
  const {
    user,
    post,
    onUpvote,
    onRemoveVote,
    onSendTip,
    toggleDownvoting,
    onOpenTipHistory,
    onDelete,
    onReport,
    onShared,
    expanded = false,
    type = 'default',
  } = props;

  const styles = useStyles();
  const router = useRouter();
  const dispatch = useDispatch();
  const {activeTab, setActiveTab, tabs} = useCommentTabs(post);

  const {balanceDetails} = useSelector<RootState, BalanceState>(state => state.balanceState);
  const [shoWcomment, setShowComment] = useState(expanded);
  const [maxLength, setMaxLength] = useState<number | undefined>(250);
  const [viewContent, setViewContent] = useState(!post.isNSFW);
  const owner = post.createdBy === user?.id;
  const isOwnSocialPost = user?.people?.find(person => person.id === post.peopleId) ? true : false;

  const isImportedPost = post.platform !== 'myriad' || post.createdBy !== user?.id ? true : false;

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
      setActiveTab('debate');
    } else {
      onRemoveVote(post);
    }
  };

  const handleChangeTab = (tab: string) => {
    setActiveTab(tab as CommentTabs);

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

  const handleSendTip = () => {
    onSendTip(post);
    const contentType = 'post';
    const referenceId = post.id;
    dispatch(setTippedContent(contentType, referenceId));
  };

  const handleDeletePost = () => {
    if (onDelete) {
      onDelete(post);
    }
  };

  const handleReportPost = () => {
    onReport(post);
  };

  const handleShareLink = () => {
    onShared(post, 'link');
  };

  const handleOpenTipHistory = () => {
    onOpenTipHistory(post);
  };

  const urlLink = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return '';
  };

  return (
    <Paper square className={styles.root}>
      <HeaderComponent
        owner={owner}
        post={post}
        onOpenTipHistory={handleOpenTipHistory}
        onDelete={handleDeletePost}
        onReport={handleReportPost}
        disableAction={type === 'share'}
      />

      <div className={styles.content}>
        <ShowIf condition={!viewContent}>
          <NSFW viewContent={handleViewContent} />
        </ShowIf>

        <ShowIf condition={viewContent}>
          <ShowIf condition={post.platform === 'myriad'}>
            <PostRender post={post} max={maxLength} onShowAll={() => setMaxLength(undefined)} />
          </ShowIf>

          <ShowIf condition={['twitter'].includes(post.platform)}>
            <LinkifyComponent
              text={post.text}
              handleClick={onHashtagClicked}
              variant="body1"
              color="textPrimary"
            />
          </ShowIf>

          <ShowIf condition={['reddit'].includes(post.platform)}>
            {post.title && (
              <LinkifyComponent
                text={post.title}
                handleClick={onHashtagClicked}
                variant="h4"
                color="textPrimary"
              />
            )}
            <ReactMarkdown skipHtml remarkPlugins={[remarkGFM, remarkHTML]}>
              {post.text.slice(0, maxLength)}
            </ReactMarkdown>

            <ShowIf condition={!!maxLength && post.text.length > maxLength}>
              <ShowMore onClick={() => setMaxLength(undefined)} />
            </ShowIf>
          </ShowIf>

          <ShowIf condition={post.platform === 'facebook'}>
            <FacebookProvider appId={'1349208398779551'}>
              <EmbeddedPost href={post.url} width="700" />
            </FacebookProvider>
          </ShowIf>

          {post.asset?.images && post.asset?.images.length > 0 && (
            <Gallery images={post.asset?.images} cloudName="dsget80gs" variant="vertical" />
          )}

          {post.asset?.videos && post.asset.videos.length > 0 && (
            <Video url={post.asset.videos[0]} />
          )}
        </ShowIf>

        {post.embeddedURL && !post.deletedAt && <LinkPreview embed={post.embeddedURL} />}
      </div>

      <div className={styles.action}>
        <PostActionComponent
          metrics={post.metric}
          upvoted={post.isUpvoted}
          downvoted={post.isDownVoted}
          onUpvote={handleUpvote}
          onDownVote={handleDownVote}
          onShowComments={toggleShowComments}
          shareUrl={`${urlLink()}/post/${post.id}`}
          onShared={handleShareLink}
          disableAction={type === 'share'}
        />

        <ShowIf condition={isImportedPost && !isOwnSocialPost && type !== 'share'}>
          <Button
            isDisabled={balanceDetails.length === 0}
            onClick={handleSendTip}
            variant={ButtonVariant.OUTLINED}
            color={ButtonColor.SECONDARY}
            size={ButtonSize.SMALL}
            className={styles.sendTips}>
            {balanceDetails.length === 0 ? (
              <CircularProgress size={14} color="primary" />
            ) : (
              'Send tip'
            )}
          </Button>
        </ShowIf>
      </div>

      <ShowIf condition={shoWcomment}>
        <TabsComponent tabs={tabs} active={activeTab} onChangeTab={handleChangeTab} />
      </ShowIf>
    </Paper>
  );
};
