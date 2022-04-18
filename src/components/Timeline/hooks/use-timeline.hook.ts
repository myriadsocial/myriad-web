import {useSelector, useDispatch} from 'react-redux';

import {useRouter} from 'next/router';

import {TimelineFilter, TimelineOrderType} from 'src/interfaces/timeline';
import {RootState} from 'src/reducers';
import {
  loadTimeline,
  getDedicatedPost,
  fetchSearchedPosts,
  clearTimeline,
} from 'src/reducers/timeline/actions';
import {TimelineState} from 'src/reducers/timeline/reducer';

export const useTimelineHook = () => {
  const timelineState = useSelector<RootState, TimelineState>(state => state.timelineState);
  const dispatch = useDispatch();
  const router = useRouter();

  const initTimeline = async (page = 1, sort?: TimelineOrderType, filter?: TimelineFilter) => {
    dispatch(loadTimeline(page, sort, filter));
  };

  const nextPage = async () => {
    const page = timelineState.meta.currentPage + 1;

    dispatch(loadTimeline(page));
  };

  const orderTimeline = async (sort: TimelineOrderType) => {
    // shallow push, without rerender page
    router.push(`?order=${sort}`, undefined, {shallow: true});
  };

  const getPostDetail = (postId: string | string[]) => {
    const id = postId as string;
    dispatch(getDedicatedPost(id));
  };

  const searchPosts = async (query: string, page = 1) => {
    dispatch(fetchSearchedPosts(query, page));
  };

  const clear = () => {
    dispatch(clearTimeline());
  };

  return {
    error: timelineState.error,
    loading: timelineState.loading,
    hasMore: timelineState.hasMore,
    sort: timelineState.sort,
    posts: timelineState.posts,
    order: timelineState.order,
    searchPosts,
    initTimeline,
    nextPage,
    orderTimeline,
    getPostDetail,
    clearPosts: clear,
    post: timelineState.post,
    page: timelineState.meta.currentPage,
  };
};
