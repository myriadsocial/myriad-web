import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {MiniNotifications} from './Notifications';

import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';
import {
  readAllNotifications,
  readNotification,
  fetchNotification,
  clearNotificationCount,
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
      dispatch(clearNotificationCount());
    };
  }, []);

  const markAllAsRead = () => {
    dispatch(readAllNotifications());
  };

  const markItemAsRead = (notificationId: string) => {
    dispatch(readNotification(notificationId));
  };

  return (
    <MiniNotifications
      notifications={notifications}
      onMarkAllAsRead={markAllAsRead}
      onMarkItemAsRead={markItemAsRead}
    />
  );
};
