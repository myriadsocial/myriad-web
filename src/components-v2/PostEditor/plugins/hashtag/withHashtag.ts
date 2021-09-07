import {isCollapsed, getRangeBefore, getText, unwrapNodes, wrapNodes} from '@udecode/plate-common';
import {insertNodes} from '@udecode/plate-common';
import {getPlatePluginType, SPEditor, WithOverride, TElement} from '@udecode/plate-core';

import {ELEMENT_HASHTAG} from './default';

import {Range} from 'slate';
import {ReactEditor} from 'slate-react';

const isHashTag = (string: string): boolean => {
  if (typeof string !== 'string') {
    return false;
  }

  const match = string.match(/(?:\s|^)#[A-Za-z0-9\-._]+(?:\s|$)/);
  if (!match) {
    return false;
  }

  return true;
};

export const insertHashtag = (editor: SPEditor, value: string | ArrayBuffer, at: Range) => {
  const newSelection = editor.selection as Range;

  unwrapNodes(editor, {
    at,
    match: {type: getPlatePluginType(editor, ELEMENT_HASHTAG)},
  });

  const text = {text: ''};
  const hashtag = {
    type: getPlatePluginType(editor, ELEMENT_HASHTAG),
    children: [text],
    hashtag: value,
  };
  wrapNodes<TElement>(editor, hashtag, {
    at: {
      ...at,
      focus: newSelection.focus,
    },
  });

  insertNodes(editor, text);
};

export const withHashtag = (): WithOverride<ReactEditor & SPEditor> => editor => {
  const {insertText} = editor;

  editor.insertText = (text: string) => {
    const selection = editor.selection as Range;

    if (!isCollapsed(selection)) return insertText(text);

    if (text === ' ' && isCollapsed(editor.selection)) {
      const beforeWordRange = getRangeBefore(editor, selection, {
        matchString: ' ',
        skipInvalid: true,
        afterMatch: true,
        multiPaths: true,
      });

      if (beforeWordRange) {
        const beforeWordText = getText(editor, beforeWordRange);

        if (isHashTag(beforeWordText)) {
          insertHashtag(editor, beforeWordText.replace('#', ''), beforeWordRange);
        }
      }
    }

    insertText(text);
  };

  return editor;
};
