import {CheckIcon, ChatAlt2Icon, PlusIcon} from '@heroicons/react/solid';

import React from 'react';

import Link from 'next/link';

import {SvgIcon, Typography} from '@material-ui/core';

import {useStyles} from '../Notifications.styles';

import {Notification, NotificationType} from 'src/interfaces/notification';

type NotificationList = {
  id: string;
  user: string;
  avatar?: string;
  description: React.ReactNode;
  badge: React.ReactNode;
  createdAt: Date;
};

export const useNotificationList = (notifications: Notification[]): NotificationList[] => {
  const style = useStyles();

  return notifications.map(notification => {
    switch (notification.type) {
      case NotificationType.FRIEND_ACCEPT:
        return {
          id: notification.id,
          user: notification.fromUserId.name,
          avatar: notification.fromUserId.profilePictureURL,
          description: 'Accepted your friend request',
          badge: (
            <div className={style.circle}>
              <SvgIcon
                component={CheckIcon}
                style={{color: '#FFF', fill: 'currentColor'}}
                viewBox="-4 -4 34 34"
              />
            </div>
          ),
          createdAt: notification.createdAt,
        };
        break;
      case NotificationType.FRIEND_REQUEST:
        return {
          id: notification.id,
          user: notification.fromUserId.name,
          avatar: notification.fromUserId.profilePictureURL,
          description: 'Wants to be your friend',
          badge: (
            <div className={style.circle}>
              <SvgIcon
                component={PlusIcon}
                viewBox="-4 -4 34 34"
                style={{color: '#FFF', fill: 'currentColor'}}
              />
            </div>
          ),
          createdAt: notification.createdAt,
        };
        break;
      case NotificationType.POST_COMMENT:
        return {
          id: notification.id,
          user: notification.fromUserId.name,
          avatar: notification.fromUserId.profilePictureURL,
          description: (
            <Typography component="span">
              Commented on your &nbsp;
              <Link href={`/post/${notification.referenceId}`}>
                <a href={`/post/${notification.referenceId}`} className={style.link}>
                  Post
                </a>
              </Link>
            </Typography>
          ),
          badge: (
            <div className={style.circle}>
              <SvgIcon
                component={ChatAlt2Icon}
                viewBox="-4 -4 34 34"
                style={{fill: 'currentColor', color: '#FFF'}}
              />
            </div>
          ),
          createdAt: notification.createdAt,
        };
        break;
      default:
        return {
          id: notification.id,
          user: notification.fromUserId.name,
          avatar: notification.fromUserId.profilePictureURL,
          description: notification.message,
          badge: (
            <SvgIcon
              component={ChatAlt2Icon}
              color="primary"
              viewBox="0 0 24 24"
              style={{fill: 'currentColor'}}
            />
          ),
          createdAt: notification.createdAt,
        };
        break;
    }
  });
};
