import {useSelector, useDispatch} from 'react-redux';

import {useEnqueueSnackbar} from 'components/common/Snackbar/useEnqueueSnackbar.hook';
import {SocialsEnum} from 'src/interfaces';
import {Network} from 'src/interfaces/network';
import {User, UserWallet} from 'src/interfaces/user';
import {firebaseCloudMessaging} from 'src/lib/firebase';
import {RootState} from 'src/reducers';
import {updateUser, deleteSocial} from 'src/reducers/user/actions';
import {UserState} from 'src/reducers/user/reducer';

type UserHookProps = {
  user: User;
  anonymous: boolean;
  alias: string;
  networks: Network[];
  currentWallet?: UserWallet;
  wallets: UserWallet[];
  disconnectSocial: (social: SocialsEnum) => void;
  updateUserFcmToken: () => void;
  updateUser: (values: Partial<User>) => void;
  userWalletAddress: null | string;
};

export const useUserHook = (): UserHookProps => {
  const dispatch = useDispatch();

  const enqueueSnackbar = useEnqueueSnackbar();

  const {user, anonymous, alias, socials, networks, currentWallet, wallets, userWalletAddress} =
    useSelector<RootState, UserState>(state => state.userState);

  const disconnectSocial = async (social: SocialsEnum): Promise<void> => {
    if (!user) return;

    if (socials.length > 0) {
      const match = socials.find(item => item.platform === social);

      if (match) {
        dispatch(deleteSocial(match.id));
      }
    }
  };

  const updateUserDetail = async (values: Partial<User>, disableUpdateAlert = false) => {
    if (!user) return;

    dispatch(updateUser(values));

    if (!disableUpdateAlert) {
      enqueueSnackbar({
        message: 'Success update profile',
        variant: 'success',
      });
    }
  };

  const updateUserFcmToken = async () => {
    const token = await firebaseCloudMessaging.getToken();
    const disableUpdateAlert = true;

    if (token && user && user.fcmTokens && !user.fcmTokens.includes(token)) {
      updateUserDetail({fcmTokens: [token as string]}, disableUpdateAlert);
    }
  };

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
