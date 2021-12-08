import {useSelector, useDispatch} from 'react-redux';

import {RootState} from '../reducers';
import {loadUsers, searchUsers} from '../reducers/search/actions';
import {SearchState} from '../reducers/search/reducer';
import {UserState} from '../reducers/user/reducer';

export const useSearchHook = () => {
  const dispatch = useDispatch();

  const searchState = useSelector<RootState, SearchState>(state => state.searchState);
  const {user} = useSelector<RootState, UserState>(state => state.userState);

  const findUsers = (query: string) => {
    dispatch(searchUsers(query, user?.id));
  };

  const nextPage = async () => {
    const page = searchState.meta.currentPage + 1;

    dispatch(loadUsers(page));
  };

  return {
    searchUsers: findUsers,
    users: searchState.searchedUsers,
    hasMore: searchState.hasMore,
    nextPage,
  };
};
