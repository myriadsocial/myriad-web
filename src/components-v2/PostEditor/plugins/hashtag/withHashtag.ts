<<<<<<< HEAD
import {isCollapsed, getRangeBefore, getText, unwrapNodes, wrapNodes} from '@udecode/plate-common';
=======
import {
  someNode,
  isCollapsed,
  getRangeBefore,
  getText,
  unwrapNodes,
  wrapNodes,
} from '@udecode/plate-common';
import {insertNodes} from '@udecode/plate-common';
>>>>>>> 2181b09b (MYR-717: init editor)
import {getPlatePluginType, SPEditor, WithOverride, TElement} from '@udecode/plate-core';

import {ELEMENT_HASHTAG} from './default';

<<<<<<< HEAD
import {Range, Transforms} from 'slate';
=======
import {Range} from 'slate';
>>>>>>> 2181b09b (MYR-717: init editor)
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
<<<<<<< HEAD
=======
  const newSelection = editor.selection as Range;

>>>>>>> 2181b09b (MYR-717: init editor)
  unwrapNodes(editor, {
    at,
    match: {type: getPlatePluginType(editor, ELEMENT_HASHTAG)},
  });

<<<<<<< HEAD
  const newSelection = editor.selection as Range;

  const hashtag = {
    type: getPlatePluginType(editor, ELEMENT_HASHTAG),
    children: [{text: ''}],
    hashtag: value,
  };

  console.log('selection', newSelection);

  wrapNodes<TElement>(editor, hashtag, {
    at,
    split: true,
  });

  Transforms.insertText(editor, ' ');
  Transforms.move(editor);
};

export const withHashtag = (): WithOverride<ReactEditor & SPEditor> => editor => {
  const {insertText} = editor;
=======
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
};

export const withHashtag = (): WithOverride<ReactEditor & SPEditor> => editor => {
  const {insertData, insertText} = editor;
  const type = getPlatePluginType(editor, ELEMENT_HASHTAG);
  console.log('withHashtag');
>>>>>>> 2181b09b (MYR-717: init editor)

  editor.insertText = (text: string) => {
    const selection = editor.selection as Range;

<<<<<<< HEAD
    if (!isCollapsed(selection)) {
      return insertText(text);
    }
=======
    if (!isCollapsed(selection)) return insertText(text);
>>>>>>> 2181b09b (MYR-717: init editor)

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

<<<<<<< HEAD
=======
  editor.insertData = (data: DataTransfer) => {
    const text = data.getData('text/plain');
    console.log('insertData', text);
    if (text) {
      if (someNode(editor, {match: {type}})) {
        return insertText(text);
      }

      // if (isUrl(text)) {
      //   return upsertLinkAtSelection(editor, {url: text});
      // }
    }

    insertData(data);
  };

>>>>>>> 2181b09b (MYR-717: init editor)
  return editor;
};
