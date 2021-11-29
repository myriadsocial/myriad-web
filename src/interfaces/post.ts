import {BaseModel} from './base.interface';
import {Comment} from './comment';
import {Like, Vote} from './interaction';
import {People} from './people';
import {PostOrigin} from './timeline';
import {User} from './user';

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

export type PostAsset = {
  images: string[];
  videos: string[];
};

export type PostMetric = {
  upvotes: number;
  downvotes: number;
  discussions: number;
  debates: number;
  shares: number;
  likes: number;
  dislikes: number;
  comments: number;
};

export enum PostVisibility {
  PUBLIC = 'public',
  FRIEND = 'friend',
  PRIVATE = 'private',
}

export type PostProps = {
  asset?: PostAsset;
  createdBy: string;
  metric: PostMetric;
  originCreatedAt: Date;
  originPostId: string;
  peopleId: string;
  platform: PostOrigin;
  tags: string[];
  text: string;
  title?: string;
  url: string;
  embeddedURL?: PostEmbedProps;
  isNSFW?: boolean;
  NSFWTag?: string;
  visibility: PostVisibility;
  deletedAt?: Date;
};

export type ImportPostProps = {
  url: string;
  importer: string;
  tags?: string[];
};

export type MentionUserProps = {
  id: string;
  name: string;
  username: string;
};

export type EmbedMediaProps = {
  url: string;
  width?: number;
  height?: number;
};

export type PostEmbedProps = {
  url: string;
  title: string;
  siteName: string;
  description: string;
  image?: EmbedMediaProps;
  video?: EmbedMediaProps;
};
export interface Post extends PostProps, BaseModel {
  user: User;
  people?: People;
  likes?: Like[];
  comments?: Comment[];
  //TODO: change this on migrating new schema of transaction
  transactions?: any[];
  walletAddress?: string;
  votes?: Vote[];
  mentions?: MentionUserProps[];
  importers?: User[];
  isUpvoted?: boolean;
  isDownVoted?: boolean;
}

export type UpoadedFile = {
  file: File;
  preview: string;
};
