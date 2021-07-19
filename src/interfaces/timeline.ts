import { LayoutType } from './experience';

export enum TimelineType {
  DEFAULT = 'DEFAULT',
  ANONYMOUS = 'ANONYMOUS',
  TRENDING = 'TRENDING'
}

export type PostOrigin = 'facebook' | 'twitter' | 'reddit' | 'myriad';

export type TimelineSortMethod = 'created' | 'like' | 'comment' | 'trending';

export type TimelineFilter = {
  tags?: string[];
  people?: string[];
  layout?: LayoutType;
  platform?: PostOrigin[];
};
