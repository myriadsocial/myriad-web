import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';

import {Timeline as TimelineComponent} from '.';
import {useQueryParams} from '../../hooks/use-query-params.hooks';
import {TimelineFilter, TimelineSortMethod, TimelineType} from '../../interfaces/timeline';
import {upvote, clearTimeline} from '../../reducers/timeline/actions';
import {SendTip} from '../SendTip/SendTip';
import {Modal} from '../atoms/Modal';
import {parseQueryToFilter} from './helper';
import {useTimelineFilter} from './hooks/use-timeline-filter.hook';
import {useTimelineHook} from './hooks/use-timeline.hook';

import {ParsedUrlQuery} from 'querystring';
import {Post} from 'src/interfaces/post';

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
  const [timelineType, setTimelineType] = useState<TimelineType>(TimelineType.ALL);
  const [timelineSort, setTimelineSort] = useState<TimelineSortMethod>('created');
  const [tippedPost, setTippedPost] = useState<Post | null>(null);
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

  const handleSendTip = (post: Post) => {
    setTippedPost(post);
  };

  const closeSendTip = () => {
    setTippedPost(null);
  };

  return (
    <>
      <TimelineComponent
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
      />

      <Modal
        open={sendTipOpened}
        onClose={closeSendTip}
        title="Send Tip"
        subtitle="Finding this post is insightful? Send a tip!">
        <SendTip currencies={[]} />
      </Modal>
    </>
  );
};
