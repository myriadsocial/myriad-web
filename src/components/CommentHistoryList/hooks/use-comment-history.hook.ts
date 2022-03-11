import {useDispatch, useSelector} from 'react-redux';

import {Comment} from 'src/interfaces/comment';
import {User} from 'src/interfaces/user';
import {SortType} from 'src/lib/api/interfaces/pagination-params.interface';
import {RootState} from 'src/reducers';
import {fetchCommentHistory, updateCommentParams} from 'src/reducers/comment/actions';
import {CommentState} from 'src/reducers/comment/reducer';

type useCommentHistoryProps = {
  comments: Comment[];
  hasMore: boolean;
  sort: SortType;
  load: () => void;
  loadMore: () => void;
  sortBy: (sort: SortType) => void;
};

export const useCommentHistory = (user?: User): useCommentHistoryProps => {
  const dispatch = useDispatch();

  const {comments, hasMore, meta, params} = useSelector<RootState, CommentState>(
    state => state.commentState,
  );

  const load = () => {
    if (!user) return;

    dispatch(fetchCommentHistory(user));
  };

  const loadMore = () => {
    if (!user) return;

    dispatch(fetchCommentHistory(user, meta.currentPage + 1));
  };

  const sortBy = (sort: SortType) => {
    dispatch(updateCommentParams({sort}));

    load();
  };

  return {
    comments,
    hasMore,
    sort: params?.sort ?? 'DESC',
    load,
    loadMore,
    sortBy,
  };
};
