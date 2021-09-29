import React, {useEffect} from 'react';

import {Timeline as TimelineComponent} from '.';
import {useQueryParams} from '../../hooks/use-query-params.hooks';
import {TimelineFilter, TimelineSortMethod, TimelineType} from '../../interfaces/timeline';
import {useTimelineFilter} from './hooks/use-timeline-filter.hook';
import {useTimelineHook} from './hooks/use-timeline.hook';

type TimelineContainerProps = {
  filter?: TimelineFilter;
  anonymous?: boolean;
};

export const TimelineContainer: React.FC<TimelineContainerProps> = props => {
  const {anonymous = false} = props;

  const {posts, hasMore, nextPage} = useTimelineHook();
  const {filterTimeline} = useTimelineFilter();
  const {push, query} = useQueryParams();

  useEffect(() => {
    filterTimeline(query);
  }, [query]);

  const handleSortTimeline = (sort: TimelineSortMethod) => {
    push('sort', sort);
    // push(`?sort=${sort}`, undefined, {shallow: true});
  };

  const handleFilterTimeline = (type: TimelineType) => {
    push('type', type);
    // push(`?type=${type}`, undefined, {shallow: true});
  };

  return (
    <TimelineComponent
      posts={posts}
      anonymous={anonymous}
      loadNextPage={nextPage}
      hasMore={hasMore}
      sortTimeline={handleSortTimeline}
      filterTimeline={handleFilterTimeline}
    />
  );
};
