import {createPluginFactory} from '@udecode/plate-core';

import {HashtagElement} from '../../render/Element/Hashtag';
import {HashtagPlugin} from './type';
import {withHashtag} from './withHashtag';

export const ELEMENT_HASHTAG = 'hashtag';

/**
 * Enables support for hashtag.
 */
export const createHashtagPlugin = createPluginFactory<HashtagPlugin>({
  key: ELEMENT_HASHTAG,
  isElement: true,
  isInline: true,
  isVoid: true,
  component: HashtagElement,
  withOverrides: withHashtag,
  options: {
    prefix: '#',
    rangeBeforeOptions: {
      matchString: '#',
      skipInvalid: true,
      afterMatch: false,
    },
  },
  then: (editor, {key}) => ({
    options: {
      id: key,
    },
  }),
});
