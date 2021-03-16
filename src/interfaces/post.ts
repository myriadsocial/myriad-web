import { User } from './user';

export type PostOrigin = 'facebook' | 'twitter' | 'reddit';

export type PostReaction = {
  name: string;
  total: number;
};

export type ImageData = {
  src: string;
  title: string;
  width: number;
  height: number;
};

export type Post = {
  text: string;
  user: User;
  origin: PostOrigin;
  reactions?: PostReaction[];
  images?: ImageData[];
  videos?: string[];
  replies?: Replies[];
};

export type Replies = {
  text: string;
  user: User;
};
