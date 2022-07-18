import {
  PlateEditor,
  Value,
  isCollapsed,
  insertNodes,
  getPluginType,
  moveSelection,
} from '@udecode/plate-core';

import {ELEMENT_EMOJI} from '../createEmojiPlugin';
import {TEmojiElement} from '../type';

import {IEmojiData} from 'emoji-picker-react';
import {Range} from 'slate';

export const insertEmoji = <V extends Value>(
  editor: PlateEditor<V>,
  {emoji, unified, activeSkinTone}: IEmojiData,
): void => {
  if (!editor.selection) return;

  if (isCollapsed(editor.selection)) {
    const selection = editor.selection as Range;
    const type = getPluginType(editor, ELEMENT_EMOJI);

    insertNodes<TEmojiElement>(
      editor,
      {
        type,
        children: [{text: ' '}],
        emoji,
        unified,
        activeSkinTone,
      },
      {at: selection},
    );

    moveSelection(editor, {unit: 'offset', distance: emoji.length});
  }
};
