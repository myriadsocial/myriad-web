import {RootState} from '..';

import {User} from 'src/interfaces/user';

type AuthInfo = {
  user: User;
  anonymous: boolean;
  banned: boolean;
};

export const getAuthInfo = (state: RootState): AuthInfo => {
  return {
    user: state.userState.user,
    anonymous: state.userState.anonymous,
    banned: Boolean(state.userState.user?.createdAt),
  };
};
