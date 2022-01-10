import {LayoutType} from './experience';

export enum TimelineType {
  ALL = 'all',
  EXPERIENCE = 'experience',
  TRENDING = 'trending',
  FRIEND = 'friend',
}

export type PostOrigin = 'facebook' | 'twitter' | 'reddit' | 'myriad';

export type TimelineSortMethod = 'created' | 'like' | 'comment' | 'trending';

export type TimelineSortOrder = 'latest' | 'oldest';

export type TimelineFilter = {
  tags?: string[];
  people?: string[];
  layout?: LayoutType;
  platform?: PostOrigin[];
  owner?: string;
  importer?: string;
};
