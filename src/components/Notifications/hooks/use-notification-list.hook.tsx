import {
  CheckIcon,
  ChatAlt2Icon,
  PlusIcon,
  ExclamationCircleIcon,
  AtSymbolIcon,
  ArrowCircleLeftIcon,
} from '@heroicons/react/solid';

import React from 'react';

import getConfig from 'next/config';

import {SvgIcon} from '@material-ui/core';

import {useStyles} from '../Notifications.styles';

import {parseScientificNotatedNumber} from 'src/helpers/number';
import {Notification, NotificationType} from 'src/interfaces/notification';
import {PostOrigin} from 'src/interfaces/timeline';
import {PAGINATION_LIMIT} from 'src/lib/api/constants/pagination';

const {publicRuntimeConfig} = getConfig();

export type NotificationList = {
  id: string;
  type?: NotificationType;
  user: string;
  userId?: string;
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

const parseTipAmountContainingENumber = (message: string) => {
  const result = message.split(' ');

  let resultInString = '';

  let amount = '';

  if (result.length === 2 && result[0] === '1e-8') {
    amount = parseScientificNotatedNumber(Number(result[0])) ?? '';

    result[0] = amount;

    resultInString = result.join(' ');
  } else {
    resultInString = message;
  }

  return resultInString;
};

export const useNotificationList = (
  notifications: Notification[],
  infinite = true,
  exclude: NotificationType[] = [],
): NotificationList[] => {
  const style = useStyles({});

  const excludes = [NotificationType.POST_VOTE, NotificationType.COMMENT_VOTE].concat(exclude);

  return notifications
    .filter(notification => !excludes.includes(notification.type))
    .filter(notification => Boolean(notification.fromUserId) && Boolean(notification.toUserId))
    .slice(0, infinite ? notifications.length : PAGINATION_LIMIT)
    .map(notification => {
      switch (notification.type) {
        case NotificationType.FRIEND_ACCEPT:
          return {
            id: notification.id,
            type: NotificationType.FRIEND_ACCEPT,
            read: notification.read,
            userId: notification.fromUserId.id,
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
            userId: notification.fromUserId.id,
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
            userId: notification.fromUserId.id,
            user: notification.fromUserId.name,
            avatar: notification.fromUserId.profilePictureURL,
            description: 'Commented on your Post',
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
            href: notification.additionalReferenceId
              ? `/post/${notification.additionalReferenceId?.comment?.postId}?comment=${notification.additionalReferenceId?.comment?.id}&section=${notification.additionalReferenceId?.comment?.section}`
              : `/404`,
          };

        case NotificationType.COMMENT_COMMENT:
          return {
            id: notification.id,
            type: NotificationType.COMMENT_COMMENT,
            read: notification.read,
            userId: notification.fromUserId.id,
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
            href: notification.additionalReferenceId
              ? `/post/${notification.additionalReferenceId?.comment?.postId}?comment=${notification.additionalReferenceId?.comment?.id}&section=${notification.additionalReferenceId?.comment?.section}`
              : `/404`,
          };

        case NotificationType.POST_MENTION:
          return {
            id: notification.id,
            type: NotificationType.POST_MENTION,
            read: notification.read,
            userId: notification.fromUserId.id,
            user: notification.fromUserId.name,
            avatar: notification.fromUserId.profilePictureURL,
            description: 'Mentioned you in a post',
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

        case NotificationType.COMMENT_MENTION:
          return {
            id: notification.id,
            type: NotificationType.COMMENT_MENTION,
            read: notification.read,
            userId: notification.fromUserId.id,
            user: notification.fromUserId.name,
            avatar: notification.fromUserId.profilePictureURL,
            description: 'Mentioned you in a comment',
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
            href: notification.referenceId
              ? `/post/${notification.additionalReferenceId?.comment?.postId}?comment=${notification.additionalReferenceId?.comment?.id}&section=${notification.additionalReferenceId?.comment?.section}`
              : `/404`,
          };

        case NotificationType.POST_VOTE:
          return {
            id: notification.id,
            type: NotificationType.POST_VOTE,
            read: notification.read,
            userId: notification.fromUserId.id,
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
            userId: notification.fromUserId.id,
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
            userId: notification.fromUserId.id,
            user: 'Tips received',
            avatar: notification.fromUserId.profilePictureURL,
            description: `You received tip from ${
              notification.fromUserId.name
            } (${parseTipAmountContainingENumber(notification.message)})}`,
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
            userId: notification.fromUserId.id,
            user: 'Tips received',
            avatar: notification.fromUserId.profilePictureURL,
            description: `Your post received tip from ${
              notification.fromUserId.name
            } (${parseTipAmountContainingENumber(notification.message)})`,
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
              notification.additionalReferenceId
                ? '/post/' + notification?.additionalReferenceId?.post?.id
                : '/wallet?type=history'
            }`,
          };

        case NotificationType.COMMENT_TIPS:
          return {
            id: notification.id,
            type: NotificationType.COMMENT_TIPS,
            read: notification.read,
            userId: notification.fromUserId.id,
            user: 'Tips received',
            avatar: notification.fromUserId.profilePictureURL,
            description: `Your reply received tip from ${
              notification.fromUserId.name
            } (${parseTipAmountContainingENumber(notification.message)})`,
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
              notification.additionalReferenceId
                ? '/post/' + notification?.additionalReferenceId?.comment?.postId
                : '/wallet?type=history'
            }`,
          };

        case NotificationType.USER_CLAIM_TIPS:
          return {
            id: notification.id,
            type: NotificationType.USER_CLAIM_TIPS,
            read: notification.read,
            userId: notification.fromUserId.id,
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

        case NotificationType.USER_INITIAL_TIPS:
          return {
            id: notification.id,
            type: NotificationType.USER_INITIAL_TIPS,
            read: notification.read,
            userId: notification.fromUserId.id,
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
            userId: notification.fromUserId.id,
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
            description: notification.message.includes('approved')
              ? 'Report has been approved'
              : 'Post has been removed',
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
            href: notification.message.includes('approved')
              ? ''
              : `${publicRuntimeConfig.myriadSupportMail}?subject=Complain post take down!`,
          };

        case NotificationType.COMMENT_REMOVED:
          return {
            id: notification.id,
            type: NotificationType.COMMENT_REMOVED,
            read: notification.read,
            user: 'Comment removed',
            avatar: notification.fromUserId.profilePictureURL,
            description: notification.message.includes('approved')
              ? (notification.additionalReferenceId &&
                  notification.additionalReferenceId?.comment?.user?.name) +
                `'s comment has been removed based on your report`
              : 'Your comment has been removed due to breaking our community guideline',
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
            href: notification.additionalReferenceId
              ? `/post/${notification.additionalReferenceId?.comment?.postId}`
              : '/404',
          };

        case NotificationType.USER_BANNED:
          return {
            id: notification.id,
            type: NotificationType.USER_BANNED,
            read: notification.read,
            userId: notification.fromUserId.id,
            user: 'User reported',
            avatar: notification.fromUserId.profilePictureURL,
            description: notification.message.includes('approved')
              ? (notification.additionalReferenceId &&
                  notification.additionalReferenceId?.user?.name) +
                ' account has been banned by admin based on your report'
              : 'You have been banned due to breaking our community rule',
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
            href: '',
          };

        case NotificationType.CONNECTED_SOCIAL_MEDIA:
          return {
            id: notification.id,
            type: NotificationType.CONNECTED_SOCIAL_MEDIA,
            read: notification.read,
            userId: notification.fromUserId.id,
            user: 'Account linked',
            avatar: notification.toUserId.profilePictureURL ?? notification.toUserId.name,
            description:
              'Your ' +
              getPlatform(notification.message) +
              ' account @' +
              (notification.additionalReferenceId &&
                notification.additionalReferenceId?.people?.username) +
              ' successfully connected to Myriad',
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
            userId: notification.fromUserId.id,
            user: 'Account unlinked',
            avatar: notification.toUserId.profilePictureURL ?? notification.toUserId.name,
            description:
              'Your ' +
              getPlatform(notification.message) +
              ' account @' +
              (notification.additionalReferenceId &&
                notification.additionalReferenceId?.people?.username) +
              ' successfully disconnected from Myriad by @' +
              notification.fromUserId.username,
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
            userId: notification.fromUserId.id,
            user: notification.fromUserId.name,
            avatar: notification.fromUserId.profilePictureURL,
            description:
              notification.message === 'mentioned you'
                ? 'mentioned you in a comment'
                : notification.message,
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
            href: notification.additionalReferenceId
              ? `/post/${notification.additionalReferenceId?.comment?.postId}?comment=${notification.additionalReferenceId?.comment?.id}`
              : `/404`,
          };
      }
    });
};
