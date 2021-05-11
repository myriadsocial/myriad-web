import { useState } from 'react';

import { User } from 'next-auth';

import { WithAdditionalParams } from 'next-auth/_utils';
import { useUser, UserActionType } from 'src/components/user/user.context';
import { SocialsEnum } from 'src/interfaces';
import { ExtendedUser } from 'src/interfaces/user';
import * as UserAPI from 'src/lib/api/user';

export const useUserHook = (user: WithAdditionalParams<User>) => {
  const { state: userState, dispatch } = useUser();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);

    try {
      let detail: ExtendedUser = await UserAPI.getUserDetail(user.address as string);

      if (!detail.userCredentials) {
        detail.userCredentials = [];
      }

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

  const disconnectSocial = async (social: SocialsEnum) => {
    const credential = userState.user?.userCredentials.find(credential => credential.people.platform === social);

    if (credential) {
      await UserAPI.disconnectSocial(credential.id);

      load();
    }
  };

  return {
    error,
    loading,
    getUserDetail: load,
    disconnectSocial
  };
};
