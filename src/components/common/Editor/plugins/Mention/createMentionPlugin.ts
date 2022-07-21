import {
  ELEMENT_MENTION,
  ELEMENT_MENTION_INPUT,
  isSelectionInMentionInput,
  mentionOnKeyDownHandler,
  MentionPlugin,
} from '@udecode/plate';
import {createPluginFactory} from '@udecode/plate-core';

import {withMention} from './withMention';

/**
 * Enables support for autocompleting @mentions.
 */
export const createMentionPlugin = createPluginFactory<MentionPlugin>({
  key: ELEMENT_MENTION,
  isElement: true,
  isInline: true,
  isVoid: true,
  handlers: {
    onKeyDown: mentionOnKeyDownHandler({query: isSelectionInMentionInput}),
  },
  withOverrides: withMention,
  options: {
    trigger: '@',
    createMentionNode: item => ({value: item.text}),
  },
  plugins: [
    {
      key: ELEMENT_MENTION_INPUT,
      isElement: true,
      isInline: true,
    },
  ],
  then: (editor, {key}) => ({
    options: {
      id: key,
    },
  }),
});
