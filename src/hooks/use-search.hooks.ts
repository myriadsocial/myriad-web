import {useSelector, useDispatch} from 'react-redux';

import {RootState} from '../reducers';
import {loadSearchedUsers, searchUsers} from '../reducers/search/actions';
import {SearchState} from '../reducers/search/reducer';

export const useSearchHook = () => {
  const dispatch = useDispatch();

  const searchState = useSelector<RootState, SearchState>(state => state.searchState);

  const initSearchUsers = async (page = 1) => {
    dispatch(loadSearchedUsers(page));
  };

  const findUsers = async (query: string, page = 1) => {
    dispatch(searchUsers(query, page));
  };

  return {
    initSearchUsers,
    searchUsers: findUsers,
    users: searchState.searchedUsers,
    hasMore: searchState.hasMore,
    page: searchState.meta.currentPage,
  };
};
