import {useCallback} from 'react';
import {useSelector, useDispatch, shallowEqual} from 'react-redux';

import {ParsedUrlQuery} from 'querystring';
import {People} from 'src/interfaces/people';
import {
  TimelineType,
  TimelineFilter,
  TimelineOrderType,
  PostOriginType,
} from 'src/interfaces/timeline';
import {User} from 'src/interfaces/user';
import * as ExperienceAPI from 'src/lib/api/experience';
import {SortType} from 'src/lib/api/interfaces/pagination-params.interface';
import {RootState} from 'src/reducers';
import {loadTimeline, clearTimeline} from 'src/reducers/timeline/actions';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useTimelineFilter = (filters?: TimelineFilter) => {
  const dispatch = useDispatch();

  const filter = useSelector<RootState, TimelineFilter>(
    state => state.timelineState.filter,
    shallowEqual,
  );
  const people = useSelector<RootState, User>(state => state.profileState.detail, shallowEqual);
  const anonymous = useSelector<RootState, boolean>(
    state => state.userState.anonymous,
    shallowEqual,
  );

  const originType: PostOriginType = filter?.platform
    ? filter.platform.includes.length === 1 && filter.platform.includes('myriad')
      ? 'myriad'
      : 'imported'
    : 'all';

  const filterTimeline = useCallback(async (query: ParsedUrlQuery) => {
    let timelineType = TimelineType.ALL;
    let timelineOrder = TimelineOrderType.LATEST;
    let tags: string[] = filter?.tags || [];

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

    if (query.order) {
      const order = Array.isArray(query.order) ? query.order[0] : query.order;

      if (Object.values(TimelineOrderType).includes(order as TimelineOrderType)) {
        timelineOrder = order as TimelineOrderType;
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

    if (anonymous) {
      // TODO: anonymous user should only see trending posts
    }

    if (query.type === TimelineType.EXPERIENCE && query.id) {
      const experience = await ExperienceAPI.getExperienceDetail(query.id as string);

      const expFilter: TimelineFilter = {
        ...filter,
        tags: experience.allowedTags ? (experience.allowedTags as string[]) : [],
        people: experience.people
          .filter((person: People) => !person.hide)
          .map((person: People) => person.id),
        experienceId: experience.id,
      };

      dispatch(loadTimeline(1, timelineOrder, expFilter, timelineType));
    } else {
      dispatch(loadTimeline(1, timelineOrder, newFilter, timelineType));
    }
  }, []);

  const filterByOrigin = useCallback((origin: PostOriginType) => {
    const timelineSort = TimelineOrderType.LATEST;

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
  }, []);

  const sortTimeline = useCallback((sort: SortType) => {
    const timelineOrder = TimelineOrderType.LATEST;

    dispatch(clearTimeline());
    dispatch(loadTimeline(1, timelineOrder, filters, TimelineType.ALL, sort));
  }, []);

  return {
    originType,
    filterTimeline,
    filterByOrigin,
    sortTimeline,
  };
};
