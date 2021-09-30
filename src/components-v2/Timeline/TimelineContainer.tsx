import React, {useEffect, useState} from 'react';

import {Timeline as TimelineComponent} from '.';
import {useQueryParams} from '../../hooks/use-query-params.hooks';
import {TimelineFilter, TimelineSortMethod, TimelineType} from '../../interfaces/timeline';
import {parseQueryToFilter} from './helper';
import {useTimelineFilter} from './hooks/use-timeline-filter.hook';
import {useTimelineHook} from './hooks/use-timeline.hook';

import {ParsedUrlQuery} from 'querystring';

type TimelineContainerProps = {
  filter?: TimelineFilter;
  anonymous?: boolean;
};

export const TimelineContainer: React.FC<TimelineContainerProps> = props => {
  const {anonymous = false} = props;

  const {posts, hasMore, nextPage} = useTimelineHook();
  const {filterTimeline} = useTimelineFilter();
  const {push, query} = useQueryParams();
  const [timelineType, setTimelineType] = useState<TimelineType>(TimelineType.ALL);
  const [timelineSort, setTimelineSort] = useState<TimelineSortMethod>('created');

  useEffect(() => {
    filterTimeline(query);
    parseFilter(query);
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
    push('type', type);
  };

  return (
    <TimelineComponent
      type={timelineType}
      sort={timelineSort}
      posts={posts}
      anonymous={anonymous}
      loadNextPage={nextPage}
      hasMore={hasMore}
      sortTimeline={handleSortTimeline}
      filterTimeline={handleFilterTimeline}
    />
  );
};
