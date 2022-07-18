import {createPluginFactory} from '@udecode/plate-core';

import {ShowMoreElement} from '../../render/Element/ShowMore';
import {ShowMorePlugin} from './type';

export const ELEMENT_SHOW_MORE = 'show-more';

/**
 * Enables support for show more element.
 */
export const createShowMorePlugin = createPluginFactory<ShowMorePlugin>({
  key: ELEMENT_SHOW_MORE,
  isElement: true,
  isInline: true,
  isLeaf: true,
  isVoid: true,
  component: ShowMoreElement,
});
