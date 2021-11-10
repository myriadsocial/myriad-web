import {useSelector, useDispatch} from 'react-redux';

import {SocialsEnum} from 'src/interfaces';
import {Status} from 'src/interfaces/toaster';
import {User} from 'src/interfaces/user';
import {firebaseCloudMessaging} from 'src/lib/firebase';
import {RootState} from 'src/reducers';
import {showToaster} from 'src/reducers/toaster/actions';
import {updateUser, deleteSocial} from 'src/reducers/user/actions';
import {UserState} from 'src/reducers/user/reducer';

type UserHookProps = {
  disconnectSocial: (social: SocialsEnum) => void;
  loadFcmToken: () => void;
  updateUser: (values: Partial<User>) => void;
};

export const useUserHook = (): UserHookProps => {
  const dispatch = useDispatch();

  const {user, socials} = useSelector<RootState, UserState>(state => state.userState);

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
      dispatch(
        showToaster({
          message: 'Success update profile',
          toasterStatus: Status.SUCCESS,
        }),
      );
    }
  };

  const loadFcmToken = async () => {
    const token = await firebaseCloudMessaging.getToken();
    const disableUpdateAlert = true;

    if (token && user && user.fcmTokens && !user.fcmTokens.includes(token)) {
      updateUserDetail({fcmTokens: [token as string]}, disableUpdateAlert);
    }
  };

  return {
    disconnectSocial,
    loadFcmToken,
    updateUser: updateUserDetail,
  };
};
