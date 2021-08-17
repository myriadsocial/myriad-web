import {LayoutType} from './experience';

export enum TimelineType {
  FRIEND = 'friend',
  EXPERIENCE = 'experience',
  TRENDING = 'trending',
}

export type PostOrigin = 'facebook' | 'twitter' | 'reddit' | 'myriad';

export type TimelineSortMethod = 'created' | 'like' | 'comment' | 'trending';

export type TimelineFilter = {
  tags?: string[];
  people?: string[];
  layout?: LayoutType;
  platform?: PostOrigin[];
  owner?: string;
  importer?: string;
};
