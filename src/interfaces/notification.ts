import {BaseModel} from './base.interface';
import {User} from './user';

export enum NotificationType {
  FRIEND_REQUEST = 'friend_request',
  FRIEND_ACCEPT = 'friend_accept',
  POST_COMMENT = 'post_comment',
  REPORT_POST = 'report_post',
  REPORT_USER = 'report_user',
}

export type NotificationProps = {
  referenceId?: string;
  type: NotificationType;
  read: boolean;
  from: string;
  to: string;
  message: string;
};

export interface Notification extends NotificationProps, BaseModel {
  fromUserId: User;
  toUserId: User;
}
export interface TotalNewNotification {
  count: number;
}
