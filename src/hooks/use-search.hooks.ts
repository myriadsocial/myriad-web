import {useSelector, useDispatch} from 'react-redux';

import {RootState} from '../reducers';
import {searchUsers, clearUsers} from '../reducers/search/actions';
import {SearchState} from '../reducers/search/reducer';

export const useSearchHook = () => {
  const dispatch = useDispatch();

  const searchState = useSelector<RootState, SearchState>(state => state.searchState);

  const initSearchUsers = async (page = 1) => {
    dispatch(searchUsers(page));
  };

  const findUsers = async (query: string, page = 1) => {
    dispatch(searchUsers(query, page));
  };

  const clear = () => {
    dispatch(clearUsers());
  };

  return {
    initSearchUsers,
    searchUsers: findUsers,
    clearUsers: clear,
    users: searchState.searchedUsers,
    hasMore: searchState.hasMore,
    page: searchState.meta.currentPage,
    loading: searchState.loading,
    isSearching: searchState.isSearching,
  };
};
