import {useSelector, useDispatch} from 'react-redux';

import {useRouter} from 'next/router';

import {TimelineFilter, TimelineSortMethod} from 'src/interfaces/timeline';
import {RootState} from 'src/reducers';
import {loadTimeline} from 'src/reducers/timeline/actions';
import {TimelineState} from 'src/reducers/timeline/reducer';

export const useTimelineHook = () => {
  const timelineState = useSelector<RootState, TimelineState>(state => state.timelineState);
  const dispatch = useDispatch();
  const router = useRouter();

  const initTimeline = async (page = 1, sort?: TimelineSortMethod, filter?: TimelineFilter) => {
    dispatch(loadTimeline(page, sort, filter));
  };

  const nextPage = async () => {
    const page = timelineState.meta.currentPage + 1;

    dispatch(loadTimeline(page));
  };

  const sortTimeline = async (sort: TimelineSortMethod) => {
    // shallow push, without rerender page
    router.push(`?sort=${sort}`, undefined, {shallow: true});
  };

  return {
    error: timelineState.error,
    loading: timelineState.loading,
    hasMore: timelineState.hasMore,
    sort: timelineState.sort,
    posts: timelineState.posts,
    initTimeline,
    nextPage,
    sortTimeline,
  };
};
