import {
  CheckIcon,
  ChatAlt2Icon,
  PlusIcon,
  ExclamationCircleIcon,
  AtSymbolIcon,
  ArrowCircleLeftIcon,
} from '@heroicons/react/solid';

import React from 'react';

import {SvgIcon, Typography} from '@material-ui/core';

import {PostOrigin} from '../../../interfaces/timeline';
import {useStyles} from '../Notifications.styles';

import {Notification, NotificationType} from 'src/interfaces/notification';

type NotificationList = {
  id: string;
  type?: NotificationType;
  user: string;
  avatar?: string;
  description: React.ReactNode;
  badge: React.ReactNode;
  createdAt: Date;
  read: boolean;
  href: string;
  platform?: PostOrigin;
};

const getPlatform = (message: string) => {
  const result = message.split(' ');

  return result[2];
};

export const useNotificationList = (notifications: Notification[]): NotificationList[] => {
  const style = useStyles();

  return notifications
    .filter(notification => notification.type !== NotificationType.POST_VOTE)
    .filter(notification => notification.type !== NotificationType.COMMENT_VOTE)
    .filter(notification => Boolean(notification.fromUserId) && Boolean(notification.toUserId))
    .map(notification => {
      switch (notification.type) {
        case NotificationType.FRIEND_ACCEPT:
          return {
            id: notification.id,
            type: NotificationType.FRIEND_ACCEPT,
            read: notification.read,
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
            href: `/profile/${notification.fromUserId.id}`,
          };

        case NotificationType.FRIEND_REQUEST:
          return {
            id: notification.id,
            type: NotificationType.FRIEND_REQUEST,
            read: notification.read,
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
            href: `/friends?type=request`,
          };

        case NotificationType.POST_COMMENT:
          return {
            id: notification.id,
            type: NotificationType.POST_COMMENT,
            read: notification.read,
            user: notification.fromUserId.name,
            avatar: notification.fromUserId.profilePictureURL,
            description: <Typography component="span">Commented on your Post</Typography>,
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
            href:
              notification.additionalReferenceId && notification.additionalReferenceId.length > 0
                ? `/post/${notification.additionalReferenceId[0]?.postId}`
                : `/404`,
          };

        case NotificationType.COMMENT_COMMENT:
          return {
            id: notification.id,
            type: NotificationType.COMMENT_COMMENT,
            read: notification.read,
            user: notification.fromUserId.name,
            avatar: notification.fromUserId.profilePictureURL,
            description: 'Commented on your reply',
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
            //TODO: dedicated comment display not yet available
            href: `/home`,
          };

        case NotificationType.POST_MENTION:
          return {
            id: notification.id,
            type: NotificationType.POST_MENTION,
            read: notification.read,
            user: notification.fromUserId.name,
            avatar: notification.fromUserId.profilePictureURL,
            description: 'Mention you in a post',
            badge: (
              <div className={style.circle}>
                <SvgIcon
                  component={AtSymbolIcon}
                  viewBox="-4 -4 34 34"
                  style={{fill: 'currentColor', color: '#FFF'}}
                />
              </div>
            ),
            createdAt: notification.createdAt,
            href: notification.referenceId ? `/post/${notification.referenceId}` : `/404`,
          };

        case NotificationType.POST_VOTE:
          return {
            id: notification.id,
            type: NotificationType.POST_VOTE,
            read: notification.read,
            user: notification.fromUserId.name,
            avatar: notification.fromUserId.profilePictureURL,
            description: notification.message,
            badge: (
              <div className={style.circleSuccess}>
                <SvgIcon
                  component={ArrowCircleLeftIcon}
                  viewBox="2 2 20 20"
                  style={{fill: '#47B881', color: '#FFF'}}
                />
              </div>
            ),
            createdAt: notification.createdAt,
            href: `/home`,
          };

        case NotificationType.COMMENT_VOTE:
          return {
            id: notification.id,
            type: NotificationType.COMMENT_VOTE,
            read: notification.read,
            user: notification.fromUserId.name,
            avatar: notification.fromUserId.profilePictureURL,
            description: notification.message,
            badge: (
              <div className={style.circleSuccess}>
                <SvgIcon
                  component={ArrowCircleLeftIcon}
                  viewBox="2 2 20 20"
                  style={{fill: '#47B881', color: '#FFF'}}
                />
              </div>
            ),
            createdAt: notification.createdAt,
            href: `/home`,
          };

        case NotificationType.USER_TIPS:
          return {
            id: notification.id,
            type: NotificationType.USER_TIPS,
            read: notification.read,
            user: 'Tips received',
            avatar: notification.fromUserId.profilePictureURL,
            description: (
              <Typography component="span">
                You recieved tip from&nbsp;
                {notification.fromUserId.name}
                &nbsp;{`(${notification.message})`}
              </Typography>
            ),
            badge: (
              <div className={style.circleSuccess}>
                <SvgIcon
                  component={ArrowCircleLeftIcon}
                  viewBox="2 2 20 20"
                  style={{fill: '#47B881', color: '#FFF'}}
                />
              </div>
            ),
            createdAt: notification.createdAt,
            href: `/wallet?type=history`,
          };

        case NotificationType.POST_TIPS:
          return {
            id: notification.id,
            type: NotificationType.POST_TIPS,
            read: notification.read,
            user: 'Tips received',
            avatar: notification.fromUserId.profilePictureURL,
            description: (
              <Typography component="span">
                Your post recieved tip from {notification.fromUserId.name}&nbsp;
                {`(${notification.message})`}
              </Typography>
            ),
            badge: (
              <div className={style.circleSuccess}>
                <SvgIcon
                  component={ArrowCircleLeftIcon}
                  viewBox="2 2 20 20"
                  style={{fill: '#47B881', color: '#FFF'}}
                />
              </div>
            ),
            createdAt: notification.createdAt,
            href: `${
              notification.additionalReferenceId && notification.additionalReferenceId.length > 0
                ? '/post/' + notification?.additionalReferenceId[0]?.postId
                : '/wallet?type=history'
            }`,
          };

        case NotificationType.COMMENT_TIPS:
          return {
            id: notification.id,
            type: NotificationType.COMMENT_TIPS,
            read: notification.read,
            user: 'Tips received',
            avatar: notification.fromUserId.profilePictureURL,
            description: (
              <Typography component="span">
                Your reply recieved tip from&nbsp;
                {notification.fromUserId.name}
                &nbsp;{`(${notification.message})`}
              </Typography>
            ),
            badge: (
              <div className={style.circleSuccess}>
                <SvgIcon
                  component={ArrowCircleLeftIcon}
                  viewBox="2 2 20 20"
                  style={{fill: '#47B881', color: '#FFF'}}
                />
              </div>
            ),
            createdAt: notification.createdAt,
            href: `${
              notification.additionalReferenceId && notification.additionalReferenceId.length > 0
                ? '/post/' + notification?.additionalReferenceId[0]?.postId
                : '/wallet?type=history'
            }`,
          };

        case NotificationType.USER_CLAIM_TIPS:
          return {
            id: notification.id,
            type: NotificationType.USER_CLAIM_TIPS,
            read: notification.read,
            user: 'Tips claimed',
            avatar: notification.fromUserId.profilePictureURL,
            description: `${notification.message}`,
            badge: (
              <div className={style.circleSuccess}>
                <SvgIcon
                  component={ArrowCircleLeftIcon}
                  viewBox="2 2 20 20"
                  style={{fill: '#47B881', color: '#FFF'}}
                />
              </div>
            ),
            createdAt: notification.createdAt,
            href: `/wallet?type=history`,
          };

        case NotificationType.USER_REWARD:
          return {
            id: notification.id,
            type: NotificationType.USER_REWARD,
            read: notification.read,
            user: 'Tips reward',
            avatar: notification.fromUserId.profilePictureURL,
            description: `${notification.message}`,
            badge: (
              <div className={style.circleSuccess}>
                <SvgIcon
                  component={ArrowCircleLeftIcon}
                  viewBox="2 2 20 20"
                  style={{fill: '#47B881', color: '#FFF'}}
                />
              </div>
            ),
            createdAt: notification.createdAt,
            href: `/wallet?type=history`,
          };

        case NotificationType.POST_REMOVED:
          return {
            id: notification.id,
            type: NotificationType.POST_REMOVED,
            read: notification.read,
            user: 'Post removed',
            avatar: notification.fromUserId.profilePictureURL,
            description: 'Your post has been removed due to breaking our community guideline',
            badge: (
              <div className={style.circleError}>
                <SvgIcon
                  component={ExclamationCircleIcon}
                  style={{color: '#FFF', fill: 'currentColor'}}
                  viewBox="-4 -4 34 34"
                />
              </div>
            ),
            createdAt: notification.createdAt,
            href: `support@myriad.social`,
          };

        case NotificationType.COMMENT_REMOVED:
          return {
            id: notification.id,
            type: NotificationType.COMMENT_REMOVED,
            read: notification.read,
            user: 'Comment removed',
            avatar: notification.fromUserId.profilePictureURL,
            description: 'Your comment has been removed due to breaking our community guideline',
            badge: (
              <div className={style.circleError}>
                <SvgIcon
                  component={ExclamationCircleIcon}
                  style={{color: '#FFF', fill: 'currentColor'}}
                  viewBox="-4 -4 34 34"
                />
              </div>
            ),
            createdAt: notification.createdAt,
            href: `support@myriad.social`,
          };

        case NotificationType.USER_BANNED:
          return {
            id: notification.id,
            type: NotificationType.USER_BANNED,
            read: notification.read,
            user: 'User reported',
            avatar: notification.fromUserId.profilePictureURL,
            description: notification.message,
            badge: (
              <div className={style.circleError}>
                <SvgIcon
                  component={ExclamationCircleIcon}
                  style={{color: '#FFF', fill: 'currentColor'}}
                  viewBox="-4 -4 34 34"
                />
              </div>
            ),
            createdAt: notification.createdAt,
            href: `support@myriad.social`,
          };

        case NotificationType.CONNECTED_SOCIAL_MEDIA:
          return {
            id: notification.id,
            type: NotificationType.CONNECTED_SOCIAL_MEDIA,
            read: notification.read,
            user: 'Account linked',
            avatar: notification.toUserId.profilePictureURL ?? notification.toUserId.name,
            description:
              'Your ' +
              getPlatform(notification.message) +
              ` account ${notification.fromUserId.name} successfully connected to Myriad`,
            badge: (
              <div className={style.circleError}>
                <SvgIcon
                  component={ExclamationCircleIcon}
                  style={{color: '#FFF', fill: 'currentColor'}}
                  viewBox="-4 -4 34 34"
                />
              </div>
            ),
            createdAt: notification.createdAt,
            platform: getPlatform(notification.message) as PostOrigin,
            href: `/socials`,
          };

        case NotificationType.DISCONNECTED_SOCIAL_MEDIA:
          return {
            id: notification.id,
            type: NotificationType.DISCONNECTED_SOCIAL_MEDIA,
            read: notification.read,
            user: 'Account unlinked',
            avatar: notification.toUserId.profilePictureURL ?? notification.toUserId.name,
            description:
              'Your ' +
              getPlatform(notification.message) +
              ` account ${notification.fromUserId.name} successfully disconnected from Myriad`,
            badge: (
              <div className={style.circleError}>
                <SvgIcon
                  component={ExclamationCircleIcon}
                  style={{color: '#FFF', fill: 'currentColor'}}
                  viewBox="-4 -4 34 34"
                />
              </div>
            ),
            createdAt: notification.createdAt,
            platform: getPlatform(notification.message) as PostOrigin,
            href: `/socials`,
          };

        default:
          return {
            id: notification.id,
            read: notification.read,
            user: notification.fromUserId.name,
            avatar: notification.fromUserId.profilePictureURL,
            description: notification.message,
            badge: (
              <div className={style.circleSuccess}>
                <SvgIcon
                  component={ArrowCircleLeftIcon}
                  viewBox="2 2 20 20"
                  style={{fill: '#47B881', color: '#FFF'}}
                />
              </div>
            ),
            createdAt: notification.createdAt,
            href: `/home`,
          };
      }
    });
};
