import {BaseModel} from './base.interface';
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

export interface PostOriginUser {
  name: string;
  username: string;
  platform_account_id: string;
  profile_image_url: string;
}

export interface PostAsset {
  images: string[];
  videos: string[];
}

export interface PostMetric {
  likes: number;
  dislikes: number;
  comments: number;
}

export interface PostProps {
  asset?: PostAsset;
  createdBy: string;
  importers: string[];
  metric: PostMetric;
  originCreatedAt: Date;
  originPostId: string;
  peopleId: string;
  platform: PostOrigin;
  tags: string[];
  text: string;
  title?: string;
  url: string;
}

export interface Post extends PostProps, BaseModel {}

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

export type UpoadedFile = {
  file: File;
  preview: string;
};
