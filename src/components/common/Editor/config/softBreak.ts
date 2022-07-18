import {
  ELEMENT_BLOCKQUOTE,
  ELEMENT_CODE_BLOCK,
  ELEMENT_IMAGE,
  ELEMENT_MEDIA_EMBED,
  SoftBreakPlugin,
} from '@udecode/plate';

import {MyPlatePlugin} from '../Editor.interface';

export const softBreakPlugin: Partial<MyPlatePlugin<SoftBreakPlugin>> = {
  options: {
    rules: [
      {
        hotkey: 'shift+enter',
      },
      {
        hotkey: 'enter',
        query: {
          allow: [ELEMENT_CODE_BLOCK, ELEMENT_BLOCKQUOTE, ELEMENT_IMAGE, ELEMENT_MEDIA_EMBED],
        },
      },
    ],
  },
};
