import { User } from './user';

export type PostOrigin = 'facebook' | 'twitter' | 'reddit';

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
  textId: string;
  link: string;
  platform: PostOrigin;
  tags: string[];
  comments: Comment[];
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
