import { LayoutType } from './experience';
import { SocialsEnum } from './index';
import { User } from './user';

export type PostOrigin = 'facebook' | 'twitter' | 'reddit' | 'myriad';

export type PostSortMethod = 'created' | 'like' | 'comment' | 'trending';

export type PostFilter = {
  tags: string[];
  people: string[];
  layout: LayoutType;
  platform: SocialsEnum[];
};

export type PostReaction = {
  name: string;
  total: number;
};

export type ImageData = {
  src: string;
  width: number;
  height: number;
};

export type SocialMetric = {
  like: number;
  retweet: number;
};

export interface Post {
  id: string;
  tags: string[];
  platformUser?: {
    username: string;
    platform_account_id: string;
    profilePictureURL?: string;
  };
  platform: PostOrigin;
  title?: string;
  text?: string;
  textId?: string;
  hasMedia: boolean;
  link?: string;
  assets?: string[];
  platformCreatedAt: Date;
  createdAt: Date;
  walletAddress?: string;
  comments: Comment[];
  publicMetric?: {
    liked: number;
    disliked: number;
    comment: number;
  };
}

export interface Comment {
  text: string;
  postId: string;
  userId: string;
  createdAt: Date;
  user?: User;
}

export type UserReplies = Comment & {
  id: string;
  user: User;
};

export type ImportPost = {
  url: string;
  importer?: string;
};
