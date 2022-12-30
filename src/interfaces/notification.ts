import {BaseModel} from './base.interface';
import {SectionType} from './interaction';
import {User} from './user';

export enum NotificationType {
  FRIEND_REQUEST = 'friend_request',
  FRIEND_ACCEPT = 'friend_accept',
  POST_COMMENT = 'post_comment',
  COMMENT_COMMENT = 'comment_comment',
  POST_VOTE = 'post_vote',
  COMMENT_VOTE = 'comment_vote',
  POST_MENTION = 'post_mention',
  COMMENT_MENTION = 'comment_mention',
  USER_TIPS = 'user_tips',
  USER_TIPS_UNCLAIMED = 'user_tips_unclaimed',
  POST_TIPS = 'post_tips',
  POST_TIPS_UNCLAIMED = 'post_tips_unclaimed',
  COMMENT_TIPS = 'comment_tips',
  COMMENT_TIPS_UNCLAIMED = 'comment_tips_unclaimed',
  USER_REWARD = 'user_reward',
  USER_INITIAL_TIPS = 'user_initial_tips',
  USER_CLAIM_TIPS = 'user_claim_tips',
  CONNECTED_SOCIAL_MEDIA = 'connected_social_media',
  DISCONNECTED_SOCIAL_MEDIA = 'disconnected_social_media',
  POST_REMOVED = 'post_removed',
  COMMENT_REMOVED = 'comment_removed',
  USER_BANNED = 'user_banned',
  PAID_CONTENT = 'paid_content',
}

export type UserReference = {
  id: string;
  name: string;
  username: string;
};

export type CommentReference = {
  id: string;
  postId: string;
  user: UserReference;
  section: string;
};

export type PostReference = {
  id: string;
  user: UserReference;
};

export type SocialMediaReference = {
  name: string;
  platform: string;
  username: string;
};

export type UnlockableContentReference = {
  id: string;
  comment?: {
    id: string;
    postId: string;
    section: SectionType;
  };
  post?: {
    id: string;
  };
};

export interface AdditionalReferenceIdItem {
  comment?: CommentReference;
  user?: UserReference;
  post?: PostReference;
  people?: SocialMediaReference;
  unlockableContent?: UnlockableContentReference;
}

export type NotificationProps = {
  additionalReferenceId?: AdditionalReferenceIdItem;
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
