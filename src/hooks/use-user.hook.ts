import {useSelector, useDispatch} from 'react-redux';

import {useToasterSnackHook} from 'src/hooks/use-toaster-snack.hook';
import {SocialsEnum} from 'src/interfaces';
import {User} from 'src/interfaces/user';
import {firebaseCloudMessaging} from 'src/lib/firebase';
import {RootState} from 'src/reducers';
import {updateUser, deleteSocial} from 'src/reducers/user/actions';
import {UserState} from 'src/reducers/user/reducer';

type UserHookProps = {
  disconnectSocial: (social: SocialsEnum) => void;
  updateUserFcmToken: () => void;
  updateUser: (values: Partial<User>) => void;
  userWalletAddress: null | string;
};

export const useUserHook = (): UserHookProps => {
  const dispatch = useDispatch();

  const {openToasterSnack} = useToasterSnackHook();

  const {user, socials, userWalletAddress} = useSelector<RootState, UserState>(
    state => state.userState,
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

  const updateUserDetail = async (values: Partial<User>, disableUpdateAlert = false) => {
    if (!user) return;

    dispatch(updateUser(values));

    if (!disableUpdateAlert) {
      openToasterSnack({
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
    disconnectSocial,
    updateUserFcmToken,
    updateUser: updateUserDetail,
    userWalletAddress,
  };
};
