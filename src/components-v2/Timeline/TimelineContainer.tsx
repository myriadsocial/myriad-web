import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {useRouter} from 'next/router';

import {Button} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import {Timeline as TimelineComponent} from '.';
import {PostVisibilityContainer} from '../PostVisibility';
import {ReportContainer} from '../Report';
import {SendTipContainer} from '../SendTip';
import {TimelineFilterContainer} from '../TimelineFilter';
import {TipHistoryContainer} from '../TipHistory';
import {Modal} from '../atoms/Modal';
import {PromptComponent} from '../atoms/Prompt/prompt.component';
import {useTimelineFilter} from './hooks/use-timeline-filter.hook';
import {useTimelineHook} from './hooks/use-timeline.hook';

import ShowIf from 'src/components-v2/common/show-if.component';
import {useTipHistory} from 'src/hooks/tip-history.hook';
import {useQueryParams} from 'src/hooks/use-query-params.hooks';
import {useToasterSnackHook} from 'src/hooks/use-toaster-snack.hook';
import {Comment} from 'src/interfaces/comment';
import {Post} from 'src/interfaces/post';
import {TimelineFilter, TimelineType} from 'src/interfaces/timeline';
import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';
import {upvote, setDownvoting, deletePost, removeVote} from 'src/reducers/timeline/actions';
import {setIsTipSent} from 'src/reducers/wallet/actions';
import {WalletState} from 'src/reducers/wallet/reducer';

type TimelineContainerProps = {
  filters?: TimelineFilter;
  enableFilter?: boolean;
  sortType?: 'metric' | 'filter';
  anonymous?: boolean;
};

export const TimelineContainer: React.FC<TimelineContainerProps> = props => {
  const {filters, enableFilter = true} = props;

  const router = useRouter();

  const dispatch = useDispatch();
  const {posts, hasMore, nextPage, getTippedUserId} = useTimelineHook();
  const {filterTimeline} = useTimelineFilter(filters);
  const {query} = useQueryParams();
  const {isTipSent} = useSelector<RootState, WalletState>(state => state.walletState);
  const {openTipHistory} = useTipHistory();
  const {openToasterSnack} = useToasterSnackHook();

  const user = useSelector<RootState, User | undefined>(state => state.userState.user);
  const anonymous = useSelector<RootState, boolean>(state => state.userState.anonymous);
  const [tippedPost, setTippedPost] = useState<Post | null>(null);
  const [tippedContentForHistory, setTippedContentForHistory] = useState<Post | null>(null);
  const [reported, setReported] = useState<Post | null>(null);
  const [visibility, setVisibility] = useState<Post | null>(null);
  const [removing, setRemoving] = useState(false);
  const [postToRemove, setPostToRemove] = useState<Post | null>(null);
  const [openSuccessPrompt, setOpenSuccessPrompt] = useState(false);
  const sendTipOpened = Boolean(tippedPost);

  useEffect(() => {
    filterTimeline(query);
  }, [query]);

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
    }
  };

  const closeSendTip = () => {
    if (isTipSent && tippedPost) {
      setOpenSuccessPrompt(true);
      setTippedContentForHistory(tippedPost);
    } else {
      console.log('no post tipped');
    }

    dispatch(setIsTipSent(false));

    setTippedPost(null);
  };

  const handleReportPost = (post: Post) => {
    setReported(post);
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

  const handleOpenTipHistory = (): void => {
    if (tippedContentForHistory) {
      openTipHistory(tippedContentForHistory);
      setOpenSuccessPrompt(false);
    }
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
    <>
      <ShowIf condition={enableFilter}>
        <TimelineFilterContainer {...props} />
      </ShowIf>

      <div style={{marginTop: router.pathname === '/home' ? 30 : 0}}>
        <TimelineComponent
          timelineType={query.type as TimelineType}
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
        />
      </div>

      <Modal
        gutter="none"
        open={sendTipOpened}
        onClose={closeSendTip}
        title="Send Tip"
        subtitle="Finding this post is insightful? Send a tip!">
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
            <Box fontWeight={700} display="inline">
              {tippedContentForHistory?.importers && tippedContentForHistory?.importers.length > 0
                ? tippedContentForHistory?.people?.name
                : tippedContentForHistory?.user.name ?? 'Unknown Myrian'}
            </Box>{' '}
            sent successfully
          </Typography>
        }>
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
            onClick={handleOpenTipHistory}>
            See tip history
          </Button>
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
    </>
  );
};
