import { useState } from 'react';

import { User } from 'next-auth';

import { WithAdditionalParams } from 'next-auth/_utils';
import { useUser, UserActionType } from 'src/components/user/user.context';
import { ExtendedUser } from 'src/interfaces/user';
import * as UserAPI from 'src/lib/api/user';

export const useUserHook = (user: WithAdditionalParams<User>) => {
  const { dispatch } = useUser();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);

    try {
      const detail: ExtendedUser = await UserAPI.getUserDetail(user.address as string);

      dispatch({
        type: UserActionType.USER_LOADED,
        payload: detail
      });
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    error,
    loading,
    getUserDetail: load
  };
};
