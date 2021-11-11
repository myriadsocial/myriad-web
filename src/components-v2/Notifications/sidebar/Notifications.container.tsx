import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {MiniNotifications} from './Notifications';

import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';
import {
  readAllNotifications,
  fetchNotification,
  countNewNotification,
} from 'src/reducers/notification/actions';
import {NotificationState} from 'src/reducers/notification/reducer';

type NotificationsContainerProps = {
  user?: User;
};

export const NotificationsContainer: React.FC<NotificationsContainerProps> = props => {
  const dispatch = useDispatch();

  const {notifications} = useSelector<RootState, NotificationState>(
    state => state.notificationState,
  );

  useEffect(() => {
    dispatch(fetchNotification());

    return () => {
      dispatch(countNewNotification());
    };
  }, []);

  const markAllAsRead = () => {
    dispatch(readAllNotifications());
  };

  return <MiniNotifications notifications={notifications} onMarkAllAsRead={markAllAsRead} />;
};
