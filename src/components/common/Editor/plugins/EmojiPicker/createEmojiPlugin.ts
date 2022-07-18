import {createPluginFactory} from '@udecode/plate-core';

import {EmojiElement} from '../../render/Element/Emoji';
import {EmojiPlugin} from './type';

export const ELEMENT_EMOJI = 'emoji';

/**
 * Enables support for hashtag.
 */
export const createEmojiPlugin = createPluginFactory<EmojiPlugin>({
  key: ELEMENT_EMOJI,
  isElement: true,
  isInline: true,
  isVoid: true,
  component: EmojiElement,
  then: (editor, {key}) => ({
    options: {
      id: key,
    },
  }),
});
