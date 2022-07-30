import {useCallback} from 'react';
import {useSelector, useDispatch, shallowEqual} from 'react-redux';

import {useEnqueueSnackbar} from 'components/common/Snackbar/useEnqueueSnackbar.hook';
import {SocialsEnum} from 'src/interfaces';
import {Network} from 'src/interfaces/network';
import {SocialMedia} from 'src/interfaces/social';
import {User, UserWallet} from 'src/interfaces/user';
import type {RootState} from 'src/reducers';
import {updateUser, deleteSocial} from 'src/reducers/user/actions';

type UserHookProps = {
  user: User;
  anonymous: boolean;
  alias: string;
  networks: Network[];
  currentWallet?: UserWallet;
  wallets: UserWallet[];
  disconnectSocial: (social: SocialsEnum) => void;
  updateUserFcmToken: (token: string) => void;
  updateUser: (values: Partial<User>) => void;
  userWalletAddress: null | string;
};

export const useUserHook = (): UserHookProps => {
  const dispatch = useDispatch();
  const enqueueSnackbar = useEnqueueSnackbar();

  const {anonymous, alias, user, socials} = useSelector<
    RootState,
    {
      anonymous: boolean;
      alias: string;
      user?: User;
      socials: SocialMedia[];
    }
  >(
    ({userState}) => ({
      anonymous: userState.anonymous,
      alias: userState.alias,
      user: userState.user,
      socials: userState.socials,
    }),
    shallowEqual,
  );
  const {networks, currentWallet, wallets, userWalletAddress} = useSelector<
    RootState,
    {
      networks: Network[];
      currentWallet?: UserWallet;
      wallets: UserWallet[];
      userWalletAddress: string;
    }
  >(
    state => ({
      networks: state.userState.networks,
      currentWallet: state.userState.currentWallet,
      wallets: state.userState.wallets,
      userWalletAddress: state.userState.userWalletAddress,
    }),
    shallowEqual,
  );

  const disconnectSocial = async (social: SocialsEnum): Promise<void> => {
    if (!user) return;

    if (socials.length > 0) {
      const match = socials.find(item => item.platform === social);

      if (match) {
        dispatch(deleteSocial(match.id));
      }
    }
  };

  const updateUserDetail = useCallback(
    (values: Partial<User>, disableUpdateAlert = false) => {
      if (!user) return;

      dispatch(updateUser(values));

      if (!disableUpdateAlert) {
        enqueueSnackbar({
          message: 'Success update profile',
          variant: 'success',
        });
      }
    },
    [user],
  );

  const updateUserFcmToken = useCallback(
    async (token: string) => {
      const disableUpdateAlert = true;

      if (token && user && user.fcmTokens && !user.fcmTokens.includes(token)) {
        updateUserDetail({fcmTokens: [token]}, disableUpdateAlert);
      }
    },
    [user],
  );

  return {
    user,
    anonymous,
    alias,
    networks,
    currentWallet,
    wallets,
    disconnectSocial,
    updateUserFcmToken,
    updateUser: updateUserDetail,
    userWalletAddress,
  };
};
