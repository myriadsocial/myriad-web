import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import dynamic from 'next/dynamic';

import {Button, Grid} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import {PostVisibilityContainer} from '../PostVisibility';
import {TimelineFilterContainer} from '../TimelineFilter';
import {Modal} from '../atoms/Modal';
import {PromptComponent} from '../atoms/Prompt/prompt.component';
import {useStyles} from './Timeline.styles';
import {useTimelineFilter} from './hooks/use-timeline-filter.hook';
import {useTimelineHook} from './hooks/use-timeline.hook';

import {useTipHistory} from 'src/hooks/tip-history.hook';
import {useQueryParams} from 'src/hooks/use-query-params.hooks';
import {useToasterSnackHook} from 'src/hooks/use-toaster-snack.hook';
import {Comment} from 'src/interfaces/comment';
import {Post} from 'src/interfaces/post';
import {TimelineFilter, TimelineType} from 'src/interfaces/timeline';
import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';
import {removeImporter} from 'src/reducers/importers/actions';
import {setTippedContent} from 'src/reducers/timeline/actions';
import {upvote, setDownvoting, deletePost, removeVote} from 'src/reducers/timeline/actions';
import {setTippedUser, setTippedUserId} from 'src/reducers/wallet/actions';
import {setIsTipSent} from 'src/reducers/wallet/actions';
import {WalletState} from 'src/reducers/wallet/reducer';

type TimelineContainerProps = {
  filters?: TimelineFilter;
  fetchInitial?: boolean;
  filterType?: 'origin' | 'type';
  selectionType?: 'order' | 'sort';
  anonymous?: boolean;
};

const SendTipContainer = dynamic(() => import('src/components/SendTip/SendTipContainer'), {
  ssr: false,
});
const TimelineComponent = dynamic(() => import('./Timeline'), {ssr: false});
const ReportContainer = dynamic(() => import('../Report/Report.container'), {ssr: false});
const TipHistoryContainer = dynamic(() => import('../TipHistory/TipHistory.container'), {
  ssr: false,
});
const PostImporterContainer = dynamic(() => import('../PostImporterList/PostImporter.container'), {
  ssr: false,
});

export const TimelineContainer: React.FC<TimelineContainerProps> = props => {
  const {filters, fetchInitial = true} = props;

  const style = useStyles();
  const dispatch = useDispatch();

  const {posts, hasMore, loading, nextPage, getTippedUserId} = useTimelineHook();
  const {filterTimeline} = useTimelineFilter(filters);
  const {query} = useQueryParams();
  const {openTipHistory} = useTipHistory();
  const {openToasterSnack} = useToasterSnackHook();

  const {isTipSent, explorerURL} = useSelector<RootState, WalletState>(state => state.walletState);
  const user = useSelector<RootState, User | undefined>(state => state.userState.user);
  const anonymous = useSelector<RootState, boolean>(state => state.userState.anonymous);
  const [tippedPost, setTippedPost] = useState<Post | null>(null);
  const [tippedComment, setTippedComment] = useState<Comment | null>(null);
  const [tippedContentForHistory, setTippedContentForHistory] = useState<Post | Comment | null>(
    null,
  );
  const [reported, setReported] = useState<Post | null>(null);
  const [importedPost, setImportedPost] = useState<Post | null>(null);
  const [visibility, setVisibility] = useState<Post | null>(null);
  const [removing, setRemoving] = useState(false);
  const [postToRemove, setPostToRemove] = useState<Post | null>(null);
  const [openSuccessPrompt, setOpenSuccessPrompt] = useState(false);
  const sendTipOpened = Boolean(tippedPost) || Boolean(tippedComment);

  useEffect(() => {
    fetchInitial && filterTimeline(query);
  }, [query, fetchInitial]);

  useEffect(() => {
    if (isTipSent) {
      closeSendTip();
    }
  }, [isTipSent]);

  const handleUpvote = (reference: Post | Comment) => {
    dispatch(upvote(reference));
  };

  const handleToggleDownvoting = (reference: Post | Comment | null) => {
    dispatch(setDownvoting(reference));
  };

  const handleSendTip = (reference?: Post | Comment) => {
    // type guard to check if reference is a Post object
    if (reference && 'platform' in reference) {
      setTippedPost(reference);
      getTippedUserId(reference.id);

      const contentType = 'post';

      let isOtherTippingCurrencyDisabled = false;

      if (!('userSocialMedia' in reference)) isOtherTippingCurrencyDisabled = true;

      dispatch(setTippedContent(contentType, reference.id, isOtherTippingCurrencyDisabled));
    }

    if (reference && 'section' in reference) {
      setTippedComment(reference);

      dispatch(setTippedUserId(reference.userId));
      dispatch(setTippedUser(reference.user.name, reference.user.profilePictureURL ?? ''));

      const contentType = 'comment';

      const isOtherTippingCurrencyDisabled = false;

      dispatch(setTippedContent(contentType, reference.id, isOtherTippingCurrencyDisabled));
    }
  };

  const closeSendTip = () => {
    if (isTipSent && tippedPost) {
      setOpenSuccessPrompt(true);
      setTippedContentForHistory(tippedPost);
    } else if (isTipSent && tippedComment) {
      setOpenSuccessPrompt(true);
      setTippedContentForHistory(tippedComment);
    } else {
      console.log('no comment tipped');
    }

    dispatch(setIsTipSent(false));

    setTippedPost(null);
    setTippedComment(null);
  };

  const handleReportPost = (post: Post) => {
    setReported(post);
  };

  const handleImporters = (post: Post) => {
    dispatch(removeImporter());
    setImportedPost(post);
  };

  const closeImportedPost = () => {
    setImportedPost(null);
  };

  const closeReportPost = () => {
    setReported(null);
  };

  const handlePostVisibility = (post: Post) => {
    setVisibility(post);
  };

  const closePostVisibility = () => {
    setVisibility(null);
  };

  const handleDeletePost = (post: Post) => {
    setRemoving(true);
    setPostToRemove(post);
  };

  const handleSharePost = (post: Post, type: 'link' | 'post') => {
    if (type === 'post') {
      openToasterSnack({
        message: 'This post successfully share to your timeline',
        variant: 'success',
      });
    }
  };

  const handleClosePrompt = (): void => {
    setRemoving(false);
    setPostToRemove(null);
  };

  const handleCloseSuccessPrompt = (): void => {
    setOpenSuccessPrompt(false);
  };

  const confirmDeletePost = (): void => {
    if (postToRemove) {
      dispatch(deletePost(postToRemove.id));
    }

    handleClosePrompt();
  };

  const handleRemoveVote = (reference: Post | Comment) => {
    dispatch(removeVote(reference));
  };

  return (
    <div className={style.box}>
      <Grid container justifyContent="space-between" alignItems="center">
        <TimelineFilterContainer {...props} />
      </Grid>

      <TimelineComponent
        timelineType={query.type as TimelineType}
        loading={loading}
        user={user}
        posts={posts}
        anonymous={anonymous}
        loadNextPage={nextPage}
        hasMore={hasMore}
        upvote={handleUpvote}
        onSendTip={handleSendTip}
        onOpenTipHistory={openTipHistory}
        onDelete={handleDeletePost}
        onReport={handleReportPost}
        onVisibility={handlePostVisibility}
        toggleDownvoting={handleToggleDownvoting}
        onShared={handleSharePost}
        onRemoveVote={handleRemoveVote}
        onImporters={handleImporters}
      />

      <Modal
        gutter="none"
        open={sendTipOpened}
        onClose={closeSendTip}
        title="Send Tip"
        subtitle="Find this user insightful? Send a tip!">
        <SendTipContainer />
      </Modal>

      <PromptComponent
        icon={'success'}
        open={openSuccessPrompt}
        onCancel={handleCloseSuccessPrompt}
        title={'Success'}
        subtitle={
          <Typography component="div">
            Tip to{' '}
            {tippedContentForHistory &&
              ('platform' in tippedContentForHistory ? (
                <Box fontWeight={400} display="inline">
                  {tippedContentForHistory?.platform === 'myriad'
                    ? tippedContentForHistory?.user.name
                    : tippedContentForHistory?.people?.name ?? 'Unknown Myrian'}
                </Box>
              ) : (
                <Box fontWeight={400} display="inline">
                  {tippedContentForHistory.user.name ?? 'Unknown Myrian'}
                </Box>
              ))}{' '}
            sent successfully
          </Typography>
        }>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}>
          <a
            target="_blank"
            style={{textDecoration: 'none'}}
            href={explorerURL ?? 'https://myriad.social'}
            rel="noopener noreferrer">
            <Button style={{marginRight: '12px'}} size="small" variant="outlined" color="secondary">
              Transaction details
            </Button>
          </a>
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={handleCloseSuccessPrompt}>
            Return
          </Button>
        </div>
      </PromptComponent>

      <TipHistoryContainer onSendTip={handleSendTip} />

      <ReportContainer reference={reported} onClose={closeReportPost} />
      <PostImporterContainer post={importedPost} onClose={closeImportedPost} />
      <PostVisibilityContainer reference={visibility} onClose={closePostVisibility} />

      <PromptComponent
        title={'Remove Post'}
        subtitle={`Are you sure to remove this post?`}
        open={removing}
        icon="danger"
        onCancel={handleClosePrompt}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}>
          <Button
            style={{marginRight: '12px'}}
            size="small"
            variant="outlined"
            color="secondary"
            onClick={handleClosePrompt}>
            No, let me rethink
          </Button>
          <Button size="small" variant="contained" color="primary" onClick={confirmDeletePost}>
            Yes, proceed to delete
          </Button>
        </div>
      </PromptComponent>
    </div>
  );
};
