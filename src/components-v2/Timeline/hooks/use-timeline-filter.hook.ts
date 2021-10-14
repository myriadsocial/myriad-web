import {useSelector, useDispatch} from 'react-redux';

import {TimelineType, TimelineFilter, TimelineSortMethod} from '../../../interfaces/timeline';
import {RootState} from '../../../reducers';
import {ProfileState} from '../../../reducers/profile/reducer';
import {loadTimeline, clearTimeline} from '../../../reducers/timeline/actions';
import {TimelineState} from '../../../reducers/timeline/reducer';

import {ParsedUrlQuery} from 'querystring';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useTimelineFilter = (filters?: TimelineFilter) => {
  const {filter} = useSelector<RootState, TimelineState>(state => state.timelineState);
  const {detail: people} = useSelector<RootState, ProfileState>(state => state.profileState);
  const dispatch = useDispatch();

  const filterTimeline = async (query: ParsedUrlQuery) => {
    let timelineType = TimelineType.ALL;
    let timelineSort: TimelineSortMethod = 'created';
    let tags: string[] = [];

    if (query.type) {
      const type = Array.isArray(query.type) ? query.type[0] : query.type;

      if (
        (
          [
            TimelineType.ALL,
            TimelineType.EXPERIENCE,
            TimelineType.FRIEND,
            TimelineType.TRENDING,
          ] as string[]
        ).includes(type)
      ) {
        timelineType = type as TimelineType;
      }
    }

    if (query.tag) {
      tags = Array.isArray(query.tag) ? query.tag : [query.tag];
    }

    if (query.sort) {
      const sort = Array.isArray(query.sort) ? query.sort[0] : query.sort;

      if (['created', 'like', 'comment', 'trending'].includes(sort)) {
        timelineSort = sort as TimelineSortMethod;
      }
    }

    if (query.q) {
      tags = Array.isArray(query.q) ? query.q : [query.q];
    }

    const newFilter: TimelineFilter = {
      ...filter,
      ...filters,
      tags,
    };

    dispatch(loadTimeline(1, timelineSort, newFilter, timelineType));
  };

  const filterByOrigin = async (origin: string) => {
    const timelineSort: TimelineSortMethod = 'created';

    if (!people || !filters) return;

    switch (origin) {
      case 'myriad':
        filters.platform = ['myriad'];
        filters.owner = people.id;
        break;
      case 'imported':
        filters.platform = ['facebook', 'reddit', 'twitter'];
        filters.owner = people.id;
        break;

      default:
        filters.owner = people.id;
        filters.platform = undefined;
        break;
    }

    dispatch(clearTimeline());
    dispatch(loadTimeline(1, timelineSort, filters, TimelineType.ALL));
  };

  return {
    filterTimeline,
    filterByOrigin,
  };
};
