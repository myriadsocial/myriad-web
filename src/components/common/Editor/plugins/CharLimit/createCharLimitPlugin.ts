import {createPluginFactory} from '@udecode/plate-core';

import {CharLimitPlugin} from './type';
import {withCharLimit} from './withCharLimit';

export const ELEMENT_CHAR_LIMIT = 'char-limit';

/**
 * Enables support for show more element.
 */
export const createCharLimitPlugin = createPluginFactory<CharLimitPlugin>({
  key: ELEMENT_CHAR_LIMIT,
  isElement: false,
  isInline: false,
  isVoid: true,
  withOverrides: withCharLimit,
  options: {
    max: 5000,
  },
});
