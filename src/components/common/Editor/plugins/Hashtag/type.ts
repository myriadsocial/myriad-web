import {RangeBeforeOptions, TElement} from '@udecode/plate-core';

export interface THashtagElement extends TElement {
  hashtag: string;
}

export interface HashtagPlugin {
  id?: string;
  prefix?: string;
  rangeBeforeOptions?: RangeBeforeOptions;
  maxLength?: number;
}
