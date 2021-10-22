import {useState} from 'react';

import {useSearch as baseUseSearch, SearchActionType} from 'src/components/search/search.context';
import * as UserAPI from 'src/lib/api/user';

export const useMyriadUser = () => {
  //TODO: is this file still used?
  const {state, dispatch} = baseUseSearch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = () => {
    dispatch({
      type: SearchActionType.RESET_STATE,
    });
  };

  const search = async (query: string) => {
    setLoading(true);

    if (query.length === 0) return null;

    if (query.length > 0) {
      try {
        const {data: users} = await UserAPI.searchUsers(query);

        dispatch({
          type: SearchActionType.LOAD_USER,
          payload: users,
        });
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
      return;
    }
    return;
  };

  const backToTimeline = () => {
    dispatch({
      type: SearchActionType.ABORT_SEARCH,
    });
  };

  return {
    load,
    error,
    loading,
    users: state.users,
    search,
    searching: state.isSearching,
    backToTimeline,
  };
};
