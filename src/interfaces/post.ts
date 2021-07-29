import {PostOrigin} from './timeline';
import {User} from './user';

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

export interface TipsReceived {
  tokenId: string;
  totalTips: number;
}

export interface Post {
  id: string;
  tags: string[];
  platformUser: {
    name?: string;
    username: string;
    platform_account_id: string;
    profile_image_url: string;
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
  importBy?: string[];
  importer?: User;
  tipsReceived?: TipsReceived[];
}

export interface Comment {
  id: string;
  text: string;
  postId: string;
  userId: string;
  createdAt: Date;
  user?: User;
}

export type CreateCommentProps = Omit<Comment, 'id'>;

export type UserReplies = Comment & {
  id: string;
  user: User;
};

export type ImportPost = {
  url: string;
  importer: string;
};

export type Like = {
  id: string;
  status: boolean;
  postId: string;
  userId: string;
};

export type Dislike = {
  id: string;
  status: boolean;
  postId: string;
  userId: string;
};
