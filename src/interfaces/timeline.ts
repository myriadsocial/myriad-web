import { LayoutType } from './experience';

export enum TimelineType {
  ALL = 'all',
  EXPERIENCE = 'experience',
  TRENDING = 'trending',
  FRIEND = 'friend',
}

export type PostOrigin = 'facebook' | 'twitter' | 'reddit' | 'myriad';

export type PostOriginType = 'all' | 'myriad' | 'imported';

export enum TimelineOrderType {
  UPVOTE = 'upvote',
  COMMENT = 'comment',
  COUNT = 'count',
  POPULAR = 'popular',
  LATEST = 'latest',
  UPDATEDATE = 'updatedAt',
  TIP = 'tip',
}

export type TimelineFilterFields = {
  tags?: string[];
  people?: string[];
  layout?: LayoutType;
  platform?: PostOrigin[];
  owner?: string;
  importer?: string;
  experienceId?: string;
};

export enum TimelineFilterCreated {
  ME = 'me',
  OTHERS = 'others',
}
export enum AdvanceFilter {
  FOLLOWED = 'followed',
  NAME_ASC = 'name_asc',
  NAME_DESC = 'name_desc',
  DATE_ASC = 'date_asc',
  DATE_DESC = 'date_desc',
}
