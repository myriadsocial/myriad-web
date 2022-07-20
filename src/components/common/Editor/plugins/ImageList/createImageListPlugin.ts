import {createPluginFactory} from '@udecode/plate-core';

import {ImageListElement} from '../../render/Element/ImageList/ImageList';
import {ImageListPlugin} from './type';

export const ELEMENT_IMAGE_LIST = 'img-list';

/**
 * Enables support for images.
 */
export const createImageListPlugin = createPluginFactory<ImageListPlugin>({
  key: ELEMENT_IMAGE_LIST,
  isElement: true,
  isVoid: true,
  component: ImageListElement,
});
