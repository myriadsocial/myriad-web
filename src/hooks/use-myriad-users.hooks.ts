import { useState } from 'react';

import { useSearch as baseUseSearch, SearchActionType } from 'src/components/search/search.context';
import * as UserAPI from 'src/lib/api/user';

export const useMyriadUser = () => {
  const { state, dispatch } = baseUseSearch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = () => {
    dispatch({
      type: SearchActionType.RESET_STATE
    });
  };

  const search = async (query: string) => {
    setLoading(true);

    try {
      const users = await UserAPI.search(query);

      dispatch({
        type: SearchActionType.LOAD_USER,
        payload: users
      });

      console.log('called');
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const backToTimeline = () => {
    dispatch({
      type: SearchActionType.ABORT_SEARCH
    });
  };

  return {
    load,
    error,
    loading,
    users: state.users,
    search,
    searching: state.isSearching,
    backToTimeline
  };
};
