import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {useRouter} from 'next/router';

import {Button} from '@material-ui/core';

import {ReportContainer} from 'src/components-v2/Report';
import {SendTipContainer} from 'src/components-v2/SendTip';
import {Timeline as TimelineComponent} from 'src/components-v2/Timeline';
import {useTimelineFilter} from 'src/components-v2/Timeline/hooks/use-timeline-filter.hook';
import {useTimelineHook} from 'src/components-v2/Timeline/hooks/use-timeline.hook';
import {TimelineFilterContainer} from 'src/components-v2/TimelineFilter';
import {TipHistoryContainer} from 'src/components-v2/TipHistory';
import {Empty} from 'src/components-v2/atoms/Empty';
import {Modal} from 'src/components-v2/atoms/Modal';
import {PromptComponent} from 'src/components-v2/atoms/Prompt/prompt.component';
import {useTipHistory} from 'src/hooks/tip-history.hook';
import {useQueryParams} from 'src/hooks/use-query-params.hooks';
import {useToasterHook} from 'src/hooks/use-toaster.hook';
import {Comment} from 'src/interfaces/comment';
import {Post} from 'src/interfaces/post';
import {TimelineFilter} from 'src/interfaces/timeline';
import {Status} from 'src/interfaces/toaster';
import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';
import {upvote, setDownvoting, deletePost, removeVote} from 'src/reducers/timeline/actions';

type TimelineContainerProps = {
  filters?: TimelineFilter;
  enableFilter?: boolean;
  sortType?: 'metric' | 'filter';
  anonymous?: boolean;
};

export const PostTabPanel: React.FC<TimelineContainerProps> = props => {
  const {anonymous = false, filters} = props;
  const router = useRouter();

  const dispatch = useDispatch();
  const {posts, hasMore, nextPage, getTippedUserId} = useTimelineHook();
  const {filterTimeline} = useTimelineFilter(filters);
  const {query} = useQueryParams();
  const {openTipHistory} = useTipHistory();
  const {openToaster} = useToasterHook();

  const user = useSelector<RootState, User | undefined>(state => state.userState.user);
  const [tippedPost, setTippedPost] = useState<Post | null>(null);
  const [reported, setReported] = useState<Post | null>(null);
  const [removing, setRemoving] = useState(false);
  const [postToRemove, setPostToRemove] = useState<Post | null>(null);
  const sendTipOpened = Boolean(tippedPost);

  useEffect(() => {
    filterTimeline(query);
  }, [query]);

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
    setTippedPost(null);
  };

  const handleReportPost = (post: Post) => {
    setReported(post);
  };

  const closeReportPost = () => {
    setReported(null);
  };

  const handleDeletePost = (post: Post) => {
    setRemoving(true);
    setPostToRemove(post);
  };

  const handleSharePost = (post: Post, type: 'link' | 'post') => {
    if (type === 'post') {
      openToaster({
        message: 'This post successfully share to your timeline',
        toasterStatus: Status.SUCCESS,
      });
    }
  };

  const handleClosePrompt = (): void => {
    setRemoving(false);
    setPostToRemove(null);
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

  const handleGoHome = () => {
    router.push('/home');
  };

  if (!posts.length && filters?.owner === user?.id) {
    return (
      <Empty title="Looks like you haven’t posted yet">
        <Button onClick={handleGoHome} variant="contained" size="small" color="primary">
          Create my first post
        </Button>
      </Empty>
    );
  }

  if (!posts.length) {
    return <Empty title="No post yet" subtitle="This user hasn’t posted anything" />;
  }

  return (
    <>
      <TimelineFilterContainer {...props} />

      <TimelineComponent
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
        toggleDownvoting={handleToggleDownvoting}
        onShared={handleSharePost}
        onRemoveVote={handleRemoveVote}
      />

      <Modal
        gutter="none"
        open={sendTipOpened}
        onClose={closeSendTip}
        title="Send Tip"
        subtitle="Finding this post is insightful? Send a tip!">
        <SendTipContainer />
      </Modal>

      <TipHistoryContainer onSendTip={handleSendTip} />

      <ReportContainer reference={reported} onClose={closeReportPost} />

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
            style={{marginRight: '24px'}}
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
