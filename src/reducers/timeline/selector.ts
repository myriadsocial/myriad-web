import {RootState} from '..';

import {Post} from 'src/interfaces/post';
import {TimelineFilter, TimelineOrderType} from 'src/interfaces/timeline';
import {SortType} from 'src/lib/api/interfaces/pagination-params.interface';

type PostList = {
  posts: Post[];
  post?: Post;
};

type PostPagination = {
  currentPage: number;
  loading: boolean;
  hasMore: boolean;
  order: TimelineOrderType;
  sort: SortType;
  filter?: TimelineFilter;
};

export const getPostList = (state: RootState): PostList => {
  return {
    posts: state.timelineState.posts,
    post: state.timelineState.post,
  };
};

export const getPostPagination = (state: RootState): PostPagination => {
  return {
    order: state.timelineState.order,
    sort: state.timelineState.sort,
    currentPage: state.timelineState.meta.currentPage,
    loading: state.timelineState.loading,
    hasMore: state.timelineState.meta.currentPage < state.timelineState.meta.totalPageCount,
  };
};
