import { useState } from 'react';

import { useNotif, NotifActionType } from './notif.context';

import { ExtendedNotification } from 'src/interfaces/notification';
import { User } from 'src/interfaces/user';
import * as NotifAPI from 'src/lib/api/notification';

export const useNotifHook = (user: User) => {
  const { dispatch } = useNotif();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data: ExtendedNotification[] = await NotifAPI.getMyNotification(user.id);

      dispatch({
        type: NotifActionType.LOAD_NOTIF,
        payload: data
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
    loadNotifications
  };
};
