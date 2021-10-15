import {BaseModel} from './base.interface';
import {User} from './user';

export enum NotificationType {
  FRIEND_REQUEST = 'friend_request',
  FRIEND_ACCEPT = 'friend_accept',
  POST_COMMENT = 'post_comment',
  REPORT_POST = 'report_post',
  REPORT_USER = 'report_user',
  COMMENT_COMMENT = 'comment_comment',
  POST_VOTE = 'post_vote',
  COMMENT_VOTE = 'comment_vote',
  POST_MENTION = 'post_mention',
  USER_TIPS = 'user_tips',
  POST_TIPS = 'post_tips',
  COMMENT_TIPS = 'comment_tips',
  USER_REWARD = 'user_reward',
  USER_INITIAL_TIPS = 'user_initial_tips',
  USER_CLAIM_TIPS = 'user_claim_tips',
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
