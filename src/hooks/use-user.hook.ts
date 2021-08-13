import {useSelector, useDispatch} from 'react-redux';

import {SocialsEnum} from 'src/interfaces';
import {User} from 'src/interfaces/user';
import {firebaseCloudMessaging} from 'src/lib/firebase';
import {RootState} from 'src/reducers';
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

  const updateUserDetail = async (values: Partial<User>) => {
    if (!user) return;

    dispatch(updateUser(values));
  };

  const loadFcmToken = async () => {
    const token = await firebaseCloudMessaging.getToken();

    if (token) {
      updateUserDetail({
        fcmTokens: [token as string],
      });
    }
  };

  return {
    disconnectSocial,
    loadFcmToken,
    updateUser: updateUserDetail,
  };
};
