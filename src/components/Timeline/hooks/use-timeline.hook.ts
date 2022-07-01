import {useCallback} from 'react';
import {useSelector, useDispatch, shallowEqual} from 'react-redux';

import {useRouter} from 'next/router';

import {TimelineFilter, TimelineOrderType} from 'src/interfaces/timeline';
import {
  loadTimeline,
  getDedicatedPost,
  fetchSearchedPosts,
  clearTimeline,
} from 'src/reducers/timeline/actions';
import {getPostPagination, getPostList} from 'src/reducers/timeline/selector';

export const useTimelineHook = () => {
  const {posts, post} = useSelector(getPostList, shallowEqual);
  const {order, currentPage, loading, hasMore} = useSelector(getPostPagination, shallowEqual);

  const dispatch = useDispatch();
  const router = useRouter();

  const initTimeline = useCallback(
    (page = 1, sort?: TimelineOrderType, filter?: TimelineFilter) => {
      dispatch(loadTimeline(page, sort, filter));
    },
    [],
  );

  const nextPage = useCallback(() => {
    const page = currentPage + 1;

    dispatch(loadTimeline(page));
  }, []);

  const orderTimeline = useCallback((sort: TimelineOrderType) => {
    // shallow push, without rerender page
    router.push(`?order=${sort}`, undefined, {shallow: true});
  }, []);

  const getPostDetail = useCallback((postId: string | string[]) => {
    const id = postId as string;
    dispatch(getDedicatedPost(id));
  }, []);

  const searchPosts = useCallback((query: string, page = 1) => {
    dispatch(fetchSearchedPosts(query, page));
  }, []);

  const clear = useCallback(() => {
    dispatch(clearTimeline());
  }, []);

  return {
    loading,
    hasMore,
    posts: posts,
    page: currentPage,
    order: order,
    post,
    searchPosts,
    initTimeline,
    nextPage,
    orderTimeline,
    getPostDetail,
    clearPosts: clear,
  };
};
