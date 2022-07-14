import {useCallback} from 'react';
import {useSelector, useDispatch, shallowEqual} from 'react-redux';

import {ParsedUrlQuery} from 'querystring';
import {People} from 'src/interfaces/people';
import {Post} from 'src/interfaces/post';
import {
  TimelineType,
  TimelineOrderType,
  PostOriginType,
  TimelineFilterFields,
} from 'src/interfaces/timeline';
import {User} from 'src/interfaces/user';
import * as ExperienceAPI from 'src/lib/api/experience';
import {SortType} from 'src/lib/api/interfaces/pagination-params.interface';
import {RootState} from 'src/reducers';
import {loadTimeline, clearTimeline} from 'src/reducers/timeline/actions';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useTimelineFilter = (filters?: TimelineFilterFields) => {
  const dispatch = useDispatch();

  const filterFields = useSelector<RootState, TimelineFilterFields>(
    state => state.timelineState.filters.fields,
    shallowEqual,
  );
  const people = useSelector<RootState, User>(state => state.profileState.detail, shallowEqual);
  const anonymous = useSelector<RootState, boolean>(
    state => state.userState.anonymous,
    shallowEqual,
  );
  const {posts, empty, loading, hasMore} = useSelector<
    RootState,
    {posts: Post[]; empty: boolean; loading: boolean; hasMore: boolean}
  >(
    state => ({
      posts: state.timelineState.posts,
      empty: state.timelineState.meta.totalItemCount === 0 && !state.timelineState.loading,
      loading: state.timelineState.meta.totalItemCount === 0 && state.timelineState.loading,
      hasMore: state.timelineState.meta.totalPageCount > state.timelineState.meta.currentPage,
    }),
    shallowEqual,
  );
  const currentPage = useSelector<RootState, number>(
    state => state.timelineState.meta.currentPage,
    shallowEqual,
  );
  const originType: PostOriginType = filterFields?.platform
    ? filterFields.platform.includes.length === 1 && filterFields.platform.includes('myriad')
      ? 'myriad'
      : 'imported'
    : 'all';

  const filterTimeline = useCallback(
    async (query?: ParsedUrlQuery) => {
      let timelineType = TimelineType.ALL;
      let timelineOrder = TimelineOrderType.LATEST;
      let tags: string[] = [];
      let search: string;

      if (query?.type) {
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

      if (query?.tag) {
        tags = Array.isArray(query.tag) ? query.tag : [query.tag];
      }

      if (query?.order) {
        const order = Array.isArray(query.order) ? query.order[0] : query.order;

        if (Object.values(TimelineOrderType).includes(order as TimelineOrderType)) {
          timelineOrder = order as TimelineOrderType;
        }
      }

      if (query?.q) {
        search = query.q as string;
      }

      const newFilterFields: TimelineFilterFields = {
        ...filterFields,
        ...filters,
        tags,
      };

      if (anonymous) {
        // TODO: anonymous user should only see trending posts
      }

      if (query?.type === TimelineType.EXPERIENCE && query?.id) {
        const experience = await ExperienceAPI.getExperienceDetail(query.id as string);

        const expFilterFields: TimelineFilterFields = {
          ...filterFields,
          tags: experience.allowedTags ? (experience.allowedTags as string[]) : [],
          people: experience.people
            .filter((person: People) => !person.hide)
            .map((person: People) => person.id),
          experienceId: experience.id,
        };

        dispatch(
          loadTimeline(
            1,
            {
              fields: expFilterFields,
              order: timelineOrder,
              query: search,
            },
            timelineType,
          ),
        );
      } else {
        dispatch(
          loadTimeline(
            1,
            {
              fields: newFilterFields,
              order: timelineOrder,
              query: search,
            },
            timelineType,
          ),
        );
      }
    },
    [filterFields],
  );

  const filterByOrigin = useCallback(
    (origin: PostOriginType) => {
      const timelineOrder = TimelineOrderType.LATEST;

      if (!people || !filters) return;

      switch (origin) {
        case 'myriad':
          filterFields.platform = ['myriad'];
          filterFields.owner = people.id;
          break;
        case 'imported':
          filterFields.platform = ['facebook', 'reddit', 'twitter'];
          filterFields.owner = people.id;
          break;

        default:
          filterFields.owner = people.id;
          filterFields.platform = undefined;
          break;
      }

      const newFilterFields: TimelineFilterFields = {
        ...filterFields,
        ...filters,
      };

      dispatch(
        loadTimeline(
          1,
          {
            fields: newFilterFields,
            order: timelineOrder,
          },
          TimelineType.ALL,
        ),
      );
    },
    [filterFields],
  );

  const sortTimeline = useCallback(
    (sort: SortType) => {
      const newFilterFields: TimelineFilterFields = {
        ...filterFields,
        ...filters,
      };
      const timelineOrder = TimelineOrderType.LATEST;

      dispatch(
        loadTimeline(
          1,
          {
            fields: newFilterFields,
            order: timelineOrder,
            sort,
          },
          TimelineType.ALL,
        ),
      );
    },
    [filterFields, filters],
  );

  const nextPage = useCallback(() => {
    const page = currentPage + 1;

    dispatch(loadTimeline(page));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const clear = useCallback(() => {
    dispatch(clearTimeline());
  }, []);

  return {
    empty,
    loading,
    hasMore,
    posts,
    originType,
    filterTimeline,
    filterByOrigin,
    sortTimeline,
    nextPage,
    clear,
  };
};
