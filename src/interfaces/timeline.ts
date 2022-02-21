import {LayoutType} from './experience';

export enum TimelineType {
  ALL = 'all',
  EXPERIENCE = 'experience',
  TRENDING = 'trending',
  FRIEND = 'friend',
}

export type PostOrigin = 'facebook' | 'twitter' | 'reddit' | 'myriad';

export enum TimelineOrderType {
  UPVOTE = 'upvote',
  COMMENT = 'comment',
  COUNT = 'count',
  POPULAR = 'popular',
  LATEST = 'latest',
  UPDATEDATE = 'updatedAt',
  TIP = 'tip',
}

export type TimelineSortType = 'ASC' | 'DESC';

export type TimelineFilter = {
  tags?: string[];
  people?: string[];
  layout?: LayoutType;
  platform?: PostOrigin[];
  owner?: string;
  importer?: string;
  experienceId?: string;
};
