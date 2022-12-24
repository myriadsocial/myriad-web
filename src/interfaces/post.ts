import {Sizes} from './assets';
import {BaseModel} from './base.interface';
import {Comment} from './comment';
import {Vote} from './interaction';
import {PeopleWithSocialMedaia} from './people';
import {PostOrigin} from './timeline';
import {User} from './user';

import {Experience} from 'src/interfaces/experience';

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
  images: string[] | Sizes[];
  videos: string[];
  exclusiveContents?: string[];
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
  CUSTOM = 'selected_user',
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
  rawText?: string;
  title?: string;
  url: string;
  embeddedURL?: PostEmbedProps;
  isNSFW?: boolean;
  NSFWTag?: string;
  visibility: PostVisibility;
  deletedAt?: Date;
  totalImporter: number;
  totalExperience: number;
  experiences?: Experience[];
  selectedUserIds?: Array<string>;
};

// props not parsed from BE, percalculate for display purpose
export type PostCustomProps = {
  isUpvoted: boolean;
  isDownVoted: boolean;
  totalComment: number;
};

export type ImportPostProps = {
  url: string;
  importer: string;
  NSFWTag?: string;
  visibility: PostVisibility;
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

export interface Post extends PostProps, PostCustomProps, BaseModel {
  user: User;
  people?: PeopleWithSocialMedaia;
  comments?: Comment[];
  //TODO: change this on migrating new schema of transaction
  transactions?: any[];
  walletAddress?: string;
  votes?: Vote[];
  mentions?: MentionUserProps[];
  importers?: User[];
}

export type UpoadedFile = {
  file: File;
  preview: string;
};

export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}
