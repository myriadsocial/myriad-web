import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {Button} from '@material-ui/core';

import {Timeline as TimelineComponent} from '.';
import {useQueryParams} from '../../hooks/use-query-params.hooks';
import {TimelineFilter, TimelineSortMethod, TimelineType} from '../../interfaces/timeline';
import {upvote, clearTimeline, setDownvoting, deletePost} from '../../reducers/timeline/actions';
import {SendTip} from '../SendTip/SendTip';
import {TipHistory} from '../TipHistory';
import {Modal} from '../atoms/Modal';
import {PromptComponent} from '../atoms/Prompt/prompt.component';
import {parseQueryToFilter} from './helper';
import {useTimelineFilter} from './hooks/use-timeline-filter.hook';
import {useTimelineHook} from './hooks/use-timeline.hook';

import {ParsedUrlQuery} from 'querystring';
import {useTipHistory} from 'src/hooks/tip-history.hook';
import {useToasterHook} from 'src/hooks/use-toaster.hook';
import {Comment} from 'src/interfaces/comment';
import {Post} from 'src/interfaces/post';
import {Status} from 'src/interfaces/toaster';
import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';

type TimelineContainerProps = {
  filters?: TimelineFilter;
  enableFilter?: boolean;
  sortType?: 'metric' | 'filter';
  anonymous?: boolean;
};

export const TimelineContainer: React.FC<TimelineContainerProps> = props => {
  const {anonymous = false, enableFilter, sortType, filters} = props;

  const dispatch = useDispatch();
  const {posts, hasMore, nextPage} = useTimelineHook();
  const {filterTimeline, filterByOrigin} = useTimelineFilter(filters);
  const {push, query} = useQueryParams();
  const {
    isTipHistoryOpen,
    tipHistoryReference,
    currencies,
    transactions,
    closeTipHistory,
    handleFilterTransaction,
    handleSortTransaction,
    openTipHistory,
  } = useTipHistory();
  const {openToaster} = useToasterHook();

  const user = useSelector<RootState, User | undefined>(state => state.userState.user);
  const [timelineType, setTimelineType] = useState<TimelineType>(TimelineType.ALL);
  const [timelineSort, setTimelineSort] = useState<TimelineSortMethod>('created');
  const [tippedPost, setTippedPost] = useState<Post | null>(null);
  const [removing, setRemoving] = useState(false);
  const [postToRemove, setPostToRemove] = useState<Post | null>(null);
  const sendTipOpened = Boolean(tippedPost);

  useEffect(() => {
    parseFilter(query);

    filterTimeline(query);
  }, [query]);

  const parseFilter = (query: ParsedUrlQuery) => {
    const filter = parseQueryToFilter(query);

    setTimelineType(filter.type);
    setTimelineSort(filter.sort);
  };

  const handleSortTimeline = (sort: TimelineSortMethod) => {
    push('sort', sort);
  };

  const handleFilterTimeline = (type: TimelineType) => {
    dispatch(clearTimeline());

    push('type', type, true);
  };

  const handleUpvote = (reference: Post | Comment) => {
    dispatch(upvote(reference));
  };

  const handleToggleDownvoting = (reference: Post | Comment | null) => {
    dispatch(setDownvoting(reference));
  };

  const handleSendTip = (post?: Post) => {
    if (post) {
      setTippedPost(post);
    }

    if (tipHistoryReference) {
      setTippedPost(tipHistoryReference as Post);
    }
  };

  const closeSendTip = () => {
    setTippedPost(null);
  };

  const handleReportPost = (post: Post) => {
    // code
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

  return (
    <>
      <TimelineComponent
        user={user}
        type={timelineType}
        sort={timelineSort}
        sortType={sortType}
        enableFilter={enableFilter}
        posts={posts}
        anonymous={anonymous}
        loadNextPage={nextPage}
        hasMore={hasMore}
        upvote={handleUpvote}
        sortTimeline={handleSortTimeline}
        filterTimeline={handleFilterTimeline}
        filterOrigin={filterByOrigin}
        onSendTip={handleSendTip}
        onOpenTipHistory={openTipHistory}
        onDelete={handleDeletePost}
        onReport={handleReportPost}
        toggleDownvoting={handleToggleDownvoting}
        onShared={handleSharePost}
      />

      <Modal
        gutter="none"
        open={sendTipOpened}
        onClose={closeSendTip}
        title="Send Tip"
        subtitle="Finding this post is insightful? Send a tip!">
        <SendTip currencies={[]} />
      </Modal>

      <TipHistory
        open={isTipHistoryOpen}
        currencies={currencies}
        tips={transactions}
        sendTip={handleSendTip}
        onClose={closeTipHistory}
        onSort={handleSortTransaction}
        onFilter={handleFilterTransaction}
      />

      <PromptComponent
        title={'Remove Post'}
        subtitle={`Are you sure to remove this post?`}
        open={removing}
        icon="danger"
        onCancel={handleClosePrompt}>
        <div>
          <Button size="small" variant="outlined" color="secondary" onClick={handleClosePrompt}>
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
