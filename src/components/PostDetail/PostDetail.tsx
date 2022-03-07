import {CurrencyDollarIcon} from '@heroicons/react/outline';

import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';

import {IconButton, Grid} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import SvgIcon from '@material-ui/core/SvgIcon';

import {PostRender} from '../PostEditor/PostRender';
import {Button, ButtonVariant, ButtonColor, ButtonSize} from '../atoms/Button';
import {NSFW} from '../atoms/NSFW/NSFW.component';
import {PostActionComponent} from '../atoms/PostAction';
import {HeaderComponent} from '../atoms/PostHeader';
import {TabsComponent} from '../atoms/Tabs';
import {Video} from '../atoms/Video';
import {useStyles} from './PostDetail.styles';
import {useCommentTabs} from './hooks/use-comment-tabs';

import {PromptComponent} from 'src/components/Mobile/PromptDrawer/Prompt';
import {LinkPreview} from 'src/components/atoms/LinkPreview';
import ShowIf from 'src/components/common/show-if.component';
import {Comment} from 'src/interfaces/comment';
import {SectionType} from 'src/interfaces/interaction';
import {Post} from 'src/interfaces/post';
import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';
import {BalanceState} from 'src/reducers/balance/reducer';
import {setTippedContent} from 'src/reducers/timeline/actions';

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
  onSendTip: (post: Post) => void;
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
    anonymous,
    onUpvote,
    onRemoveVote,
    onSendTip,
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
  const dispatch = useDispatch();
  const {
    selected: selectedCommentTab,
    setSelected: setSelectedCommentTab,
    tabs,
  } = useCommentTabs(post);

  const {balanceDetails} = useSelector<RootState, BalanceState>(state => state.balanceState);
  const [openPromptDrawer, setOpenPromptDrawer] = useState(false);
  const [shoWcomment, setShowComment] = useState(expanded);
  const [maxLength, setMaxLength] = useState<number | undefined>(250);
  const [viewContent, setViewContent] = useState(!post.isNSFW);

  const isPostOwner = post.createdBy === user?.id;
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
      setSelectedCommentTab(SectionType.DEBATE);
    } else {
      onRemoveVote(post);
    }
  };

  const handleChangeTab = (tab: string) => {
    setSelectedCommentTab(tab as SectionType);

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
    if (anonymous) {
      setOpenPromptDrawer(true);
    } else {
      onSendTip(post);
      const contentType = 'post';
      const referenceId = post.id;

      let isOtherTippingCurrencyDisabled = false;

      if (!('userSocialMedia' in post)) isOtherTippingCurrencyDisabled = true;

      dispatch(setTippedContent(contentType, referenceId, isOtherTippingCurrencyDisabled));
    }
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

  const urlLink = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return '';
  };

  const handleCancel = () => {
    setOpenPromptDrawer(false);
  };

  return (
    <Paper square className={styles.root}>
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
          <ShowIf condition={post.platform === 'myriad'}>
            <PostRender post={post} max={maxLength} onShowAll={() => setMaxLength(undefined)} />
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
              onShowMore={() => setMaxLength(undefined)}
            />
          </ShowIf>

          {post.asset?.images && post.asset?.images.length > 0 && (
            <Gallery images={post.asset?.images} variant="vertical" />
          )}

          {post.asset?.videos && post.asset.videos.length > 0 && (
            <Video url={post.asset.videos[0]} />
          )}
        </ShowIf>

        {post.asset?.images.length === 0 &&
          post.asset.videos.length === 0 &&
          post.embeddedURL &&
          !post.deletedAt && <LinkPreview embed={post.embeddedURL} />}
      </div>

      <Grid
        container
        wrap="nowrap"
        justifyContent="space-between"
        alignItems="center"
        className={styles.action}>
        <Grid item xs={9}>
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
        </Grid>

        <ShowIf condition={isImportedPost && !isOwnSocialPost && type !== 'share'}>
          <Grid item xs={3}>
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
            <IconButton onClick={handleSendTip} className={styles.icon} color="primary">
              <SvgIcon
                classes={{root: styles.fill}}
                color="inherit"
                component={CurrencyDollarIcon}
                viewBox="0 0 24 24"
              />
            </IconButton>
          </Grid>
          <PromptComponent
            title={'Send Tips'}
            subtitle={'Appreciate others posts by sending tips with stable cryptocurrency'}
            open={openPromptDrawer}
            onCancel={handleCancel}
          />
        </ShowIf>
      </Grid>

      <ShowIf condition={shoWcomment}>
        <TabsComponent tabs={tabs} active={selectedCommentTab} onChangeTab={handleChangeTab} />
      </ShowIf>
    </Paper>
  );
};
