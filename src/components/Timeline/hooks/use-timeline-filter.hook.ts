import {useSelector, useDispatch} from 'react-redux';

import {ParsedUrlQuery} from 'querystring';
import {People} from 'src/interfaces/people';
import {
  TimelineType,
  TimelineFilter,
  TimelineOrderType,
  PostOriginType,
} from 'src/interfaces/timeline';
import * as ExperienceAPI from 'src/lib/api/experience';
import {SortType} from 'src/lib/api/interfaces/pagination-params.interface';
import {RootState} from 'src/reducers';
import {ProfileState} from 'src/reducers/profile/reducer';
import {loadTimeline, clearTimeline} from 'src/reducers/timeline/actions';
import {TimelineState} from 'src/reducers/timeline/reducer';
import {UserState} from 'src/reducers/user/reducer';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useTimelineFilter = (filters?: TimelineFilter) => {
  const dispatch = useDispatch();

  const {filter} = useSelector<RootState, TimelineState>(state => state.timelineState);
  const {detail: people} = useSelector<RootState, ProfileState>(state => state.profileState);
  const {anonymous} = useSelector<RootState, UserState>(state => state.userState);

  const originType: PostOriginType = filter?.platform
    ? filter.platform.includes.length === 1 && filter.platform.includes('myriad')
      ? 'myriad'
      : 'imported'
    : 'all';

  const filterTimeline = async (query: ParsedUrlQuery) => {
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
      const userExperience = await ExperienceAPI.getUserExperienceDetail(query.id as string);

      const expFilter: TimelineFilter = {
        ...filter,
        tags: userExperience.experience.tags ? (userExperience.experience.tags as string[]) : [],
        people: userExperience.experience.people
          .filter((person: People) => !person.hide)
          .map((person: People) => person.id),
        experienceId: userExperience.experience.id,
      };

      dispatch(loadTimeline(1, timelineOrder, expFilter, timelineType));
    } else {
      dispatch(loadTimeline(1, timelineOrder, newFilter, timelineType));
    }
  };

  const filterByOrigin = async (origin: PostOriginType) => {
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
  };

  const sortTimeline = async (sort: SortType) => {
    const timelineOrder = TimelineOrderType.LATEST;

    dispatch(clearTimeline());
    dispatch(loadTimeline(1, timelineOrder, filters, TimelineType.ALL, sort));
  };

  return {
    originType,
    filterTimeline,
    filterByOrigin,
    sortTimeline,
  };
};
