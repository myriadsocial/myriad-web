import {useState} from 'react';
import {useSelector} from 'react-redux';

import {useNotif, NotifActionType} from 'src/context/notif.context';
import * as NotificationAPI from 'src/lib/api/notification';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

export const useNotifHook = () => {
  const {dispatch} = useNotif();
  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadNotifications = async () => {
    setLoading(true);

    try {
      if (!user) {
        throw new Error('');
      }

      const {data} = await NotificationAPI.getNotification(user.id);

      dispatch({
        type: NotifActionType.LOAD_NOTIF,
        payload: data,
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
    loadNotifications,
  };
};
