import {useSelector, useDispatch} from 'react-redux';

import {SortType} from 'src/lib/api/interfaces/pagination-params.interface';
import {RootState} from 'src/reducers';
import {
  searchProfileFriend,
  fetchProfileFriend,
  updateProfileFriendParams,
} from 'src/reducers/profile/actions';

export const useProfileFriend = () => {
  const dispatch = useDispatch();
  const filter = useSelector<RootState, string | undefined>(
    state => state.profileState.friends.filter,
  );
  const currentFriendPage = useSelector<RootState, number>(
    state => state.profileState.friends.meta.currentPage,
  );
  const totalPageCount = useSelector<RootState, number>(
    state => state.profileState.friends.meta.totalPageCount,
  );

  const load = (page = 1) => {
    dispatch(fetchProfileFriend(page));
  };

  const search = (query: string, page = 1) => {
    if (query.length === 0) {
      load();

      return;
    }

    dispatch(searchProfileFriend(query, page));
  };

  const sort = (sort: SortType) => {
    dispatch(updateProfileFriendParams({sort}));

    if (filter) {
      search(filter);
    } else {
      load();
    }
  };

  const loadMore = () => {
    if (filter) {
      search(filter, currentFriendPage + 1);
    } else {
      load(currentFriendPage + 1);
    }
  };

  return {
    hasMore: currentFriendPage < totalPageCount,
    loadMore,
    search,
    sort,
  };
};
