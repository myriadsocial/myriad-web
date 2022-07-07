import React, {useState, useEffect, useCallback} from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';

import {parseQueryToFilter} from '../Timeline/helper';
import {TimelineFilter as TimelineFilterComponent} from './TimelineFilter';

import {useTimelineFilter} from 'components/PostList/hooks/use-timeline-filter.hook';
import {ParsedUrlQuery} from 'querystring';
import {useQueryParams} from 'src/hooks/use-query-params.hooks';
import {WrappedExperience} from 'src/interfaces/experience';
import {TimelineFilterFields, TimelineOrderType, TimelineType} from 'src/interfaces/timeline';
import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';
import {clearTimeline} from 'src/reducers/timeline/actions';

type TimelineFilterContainerProps = {
  filters?: TimelineFilterFields;
  filterType?: 'origin' | 'type';
  selectionType?: 'order' | 'sort';
  anonymous?: boolean;
};

export const TimelineFilterContainer: React.FC<TimelineFilterContainerProps> = props => {
  const {filters} = props;

  const dispatch = useDispatch();
  const {originType, filterByOrigin, sortTimeline} = useTimelineFilter(filters);
  const {query, push, replace} = useQueryParams();

  const user = useSelector<RootState, User | undefined>(
    state => state.userState.user,
    shallowEqual,
  );
  const experiences = useSelector<RootState, WrappedExperience[]>(
    state => state.userState.experiences,
    shallowEqual,
  );
  const [timelineType, setTimelineType] = useState<TimelineType>(TimelineType.ALL);
  const [timelineOrder, setTimelineOrder] = useState<TimelineOrderType>(TimelineOrderType.LATEST);

  useEffect(() => {
    parseFilter(query);
  }, [query]);

  const parseFilter = (query: ParsedUrlQuery) => {
    const filter = parseQueryToFilter(query);

    setTimelineType(filter.type);
    setTimelineOrder(filter.order);
  };

  const handleOrderTimeline = useCallback(
    (order: TimelineOrderType) => {
      push('order', order);
    },
    [query],
  );

  const handleFilterTimeline = useCallback(
    (type: TimelineType) => {
      dispatch(clearTimeline());

      // automatically select first experience as timeline filter
      if (type === TimelineType.EXPERIENCE && experiences.length > 0) {
        replace({
          path: 'home',
          query: {
            type,
            id: experiences[0].experience.id,
          },
        });
      } else {
        push('type', type, true);
      }
    },
    [query],
  );

  return (
    <>
      <TimelineFilterComponent
        user={user}
        type={timelineType}
        order={timelineOrder}
        originType={originType}
        sortTimeline={sortTimeline}
        orderTimeline={handleOrderTimeline}
        filterTimeline={handleFilterTimeline}
        filterOrigin={filterByOrigin}
        {...props}
      />
    </>
  );
};
