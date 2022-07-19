import {ELEMENT_PARAGRAPH} from '@udecode/plate';
import {
  getEditorString,
  getPluginType,
  getRangeBefore,
  getRangeFromBlockStart,
  isCollapsed,
  mockPlugin,
  moveSelection,
  PlateEditor,
  Value,
  WithPlatePlugin,
  getBlockAbove,
  TElement,
  removeNodes,
  getLeafNode,
  insertNodes,
  isSelectionAtBlockEnd,
} from '@udecode/plate-core';
import {withRemoveEmptyNodes} from '@udecode/plate-normalizers';

import {ELEMENT_HASHTAG} from './createHashtagPlugin';
import {upsertHashtag} from './transforms/upsertHashtag';
import {upsertHashtagAtSelection} from './transforms/upsertHashtagAtSelection';
import {HashtagPlugin} from './type';

import {Range} from 'slate';

const BLANK_SPACE = ' ';
const hasHashTag = (string: string): boolean => {
  if (typeof string !== 'string') {
    return false;
  }

  // eslint-disable-next-line no-control-regex
  const match = string.match(/(?:\s|^)#([^\u0000-\u007F]|\w)+(?:\s|$)/g);
  if (!match) {
    return false;
  }

  return true;
};

const isHashTag = (string: string): boolean => {
  const match = string.match(/^([#|＃]+([^\u0000-\u007F]|[a-zA-Z]|(_))+$)/g);

  return match ? true : false;
};

const upsertHashtagIfValid = <V extends Value>(editor: PlateEditor<V>) => {
  const rangeFromBlockStart = getRangeFromBlockStart(editor);
  const textFromBlockStart = getEditorString(editor, rangeFromBlockStart);

  if (rangeFromBlockStart && isHashTag(textFromBlockStart)) {
    upsertHashtag(editor, {
      hashtag: textFromBlockStart,
      at: rangeFromBlockStart,
    });
    return true;
  }
};

export const withHashtag = <V extends Value = Value, E extends PlateEditor<V> = PlateEditor<V>>(
  editor: E,
  {type, options: {rangeBeforeOptions}}: WithPlatePlugin<HashtagPlugin, V, E>,
) => {
  const {insertData, insertText, deleteBackward} = editor;

  editor.insertText = text => {
    if (text === BLANK_SPACE && isCollapsed(editor.selection)) {
      const selection = editor.selection as Range;

      // handle hashtag if # exist in block start
      if (upsertHashtagIfValid(editor)) {
        moveSelection(editor, {unit: 'offset'});
        return insertText(text);
      }

      // whitespace but previous char not a hashtag
      const beforeWordRange = getRangeBefore(editor, selection, rangeBeforeOptions);

      if (beforeWordRange) {
        const beforeWordText = getEditorString(editor, beforeWordRange);

        if (beforeWordText && isHashTag(beforeWordText)) {
          upsertHashtag(editor, {
            hashtag: beforeWordText,
            at: beforeWordRange,
          });
          moveSelection(editor, {unit: 'offset'});
        }
      }
    }

    if (text === '#' && !isSelectionAtBlockEnd(editor)) {
      const selection = editor.selection as Range;

      const before = getRangeFromBlockStart(editor, {at: selection});
      const beforeText = getEditorString(editor, before);
      const [currentLeaf] = getLeafNode(editor, selection);
      let remainingText = currentLeaf.text.slice();

      for (const word of beforeText.replace(/ +(?= )/g, '').split(' ')) {
        remainingText = remainingText.slice().replace(word, '');
      }

      const arrRemaining = remainingText.split(' ').filter(item => item.length > 0);

      if (arrRemaining.length > 0) {
        const hashtag = arrRemaining.shift();

        const range: Range = {
          anchor: selection.anchor,
          focus: {
            offset: beforeText.length + 1,
            path: selection.focus.path,
          },
        };

        upsertHashtag(editor, {
          hashtag: hashtag,
          at: range,
        });
        moveSelection(editor, {unit: 'offset'});
        insertText(' ');
        moveSelection(editor, {unit: 'offset'});
        if (arrRemaining.length > 0) {
          insertText(arrRemaining.join(' '));
          insertText(' ');
        }

        // inserted text will be ignored if selection hashtag
        return;
      }
    }

    insertText(text);
  };

  editor.insertData = (data: DataTransfer) => {
    const text = data.getData('text/plain');

    if (text) {
      if (isHashTag(text)) {
        return upsertHashtagAtSelection(editor, {hashtag: text});
      }

      if (hasHashTag(text)) {
        const selection = editor.selection as Range;
        // eslint-disable-next-line no-control-regex
        const hashtagRule = /([#|＃]+(?:[^\u0000-\u007F]|\w)+)/g;
        const [node, path] = getBlockAbove(editor, {at: selection, block: true});

        const children = text.split(hashtagRule).map(slice => {
          if (slice.match(hashtagRule)) {
            return {
              type: getPluginType(editor, ELEMENT_HASHTAG),
              children: [{text: ' '}],
              hashtag: slice.replace('#', ''),
            };
          } else {
            return {
              text: slice,
            };
          }
        });

        if (node?.type === ELEMENT_PARAGRAPH) {
          removeNodes(editor, {at: path});
          insertNodes<TElement>(
            editor,
            {
              type: getPluginType(editor, ELEMENT_PARAGRAPH),
              children: [...node.children, ...children],
            },
            {at: path},
          );
        } else {
          insertNodes<TElement>(
            editor,
            {
              type: getPluginType(editor, ELEMENT_PARAGRAPH),
              children: children,
            },
            {at: path},
          );
        }
      }
    }

    insertData(data);
  };

  editor.deleteBackward = text => {
    deleteBackward(text);
  };

  editor = withRemoveEmptyNodes<V, E>(
    editor,
    mockPlugin<{}, V, E>({
      options: {types: type},
    }),
  );

  return editor;
};
