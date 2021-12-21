import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {Notifications} from './Notifications';

import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';
import {
  fetchNotification,
  countNewNotification,
  readNotification,
  readAllNotifications,
} from 'src/reducers/notification/actions';
import {NotificationState} from 'src/reducers/notification/reducer';

type NotificationsContainerProps = {
  user?: User;
  infinite: boolean;
  gutter?: number;
  size?: 'small' | 'medium';
};

export const NotificationsContainer: React.FC<NotificationsContainerProps> = props => {
  const {infinite, gutter, size} = props;
  const dispatch = useDispatch();

  const {
    total,
    notifications,
    meta: {totalItemCount: totalNotifications, currentPage, totalPageCount},
  } = useSelector<RootState, NotificationState>(state => state.notificationState);
  const hasMore = notifications.length < totalNotifications;

  useEffect(() => {
    dispatch(fetchNotification());
    dispatch(countNewNotification());
  }, []);

  const loadNextPage = () => {
    if (infinite && currentPage < totalPageCount) {
      dispatch(fetchNotification(currentPage + 1));
    }
  };

  const markAllAsRead = () => {
    dispatch(readAllNotifications());
  };

  const markItemAsRead = (notificationId: string, callback: () => void) => {
    dispatch(readNotification(notificationId, callback));
  };

  return (
    <Notifications
      notifications={notifications}
      unread={total}
      hasMore={hasMore}
      infinite={infinite}
      gutter={gutter}
      size={size}
      onLoadNextPage={loadNextPage}
      onMarkAllAsRead={markAllAsRead}
      onMarkItemAsRead={markItemAsRead}
    />
  );
};
