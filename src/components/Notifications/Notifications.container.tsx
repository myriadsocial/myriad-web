import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {Notifications} from './Notifications';

import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';
import {
  fetchNotification,
  countNewNotification,
  readAllNotifications,
} from 'src/reducers/notification/actions';
import {NotificationState} from 'src/reducers/notification/reducer';

type NotificationsContainerProps = {
  user?: User;
};

export const NotificationsContainer: React.FC<NotificationsContainerProps> = props => {
  const dispatch = useDispatch();

  const {
    notifications,
    meta: {totalItemCount: totalNotifications, currentPage, totalPageCount},
  } = useSelector<RootState, NotificationState>(state => state.notificationState);
  const hasMore = notifications.length < totalNotifications;

  useEffect(() => {
    dispatch(fetchNotification());
    dispatch(countNewNotification());
  }, []);

  const loadNextPage = () => {
    if (currentPage < totalPageCount) {
      dispatch(fetchNotification(currentPage + 1));
    }
  };

  const markAllAsRead = () => {
    dispatch(readAllNotifications());
  };

  return (
    <Notifications
      notifications={notifications}
      total={totalNotifications}
      hasMore={hasMore}
      onLoadNextPage={loadNextPage}
      onMarkAllAsRead={markAllAsRead}
    />
  );
};
