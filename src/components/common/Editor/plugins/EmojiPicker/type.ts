import {TElement} from '@udecode/plate-core';

import {SkinTones} from 'emoji-picker-react';

export type TEmojiElement = TElement & {
  emoji: string;
  unified: string;
  activeSkinTone?: SkinTones;
};

export interface EmojiPlugin {
  id?: string;
}
