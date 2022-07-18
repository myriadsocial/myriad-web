import {TElement} from '@udecode/plate-core';

export interface TImageListElement extends TElement {
  urls: string[];
}

export interface ImageListPlugin {
  variant?: 'vertical' | 'horizontal';
}
