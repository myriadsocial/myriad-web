import {
  isCollapsed,
  getRangeBefore,
  getText,
  wrapNodes,
  getQueryOptions,
} from '@udecode/plate-common';
import {getPlatePluginType, SPEditor, WithOverride, TElement} from '@udecode/plate-core';

import {ELEMENT_HASHTAG} from './default';

import {Range, Transforms, Editor} from 'slate';
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
  const hashtag = {
    type: getPlatePluginType(editor, ELEMENT_HASHTAG),
    children: [{text: ''}],
    hashtag: value,
  };

  wrapNodes<TElement>(editor, hashtag, {
    at,
    split: true,
  });

  Transforms.insertText(editor, ' ');
  Transforms.move(editor);
};

export const withHashtag = (): WithOverride<ReactEditor & SPEditor> => editor => {
  const {insertText} = editor;

  editor.insertText = (text: string) => {
    const selection = editor.selection as Range;

    if (!isCollapsed(selection)) {
      return insertText(text);
    }

    // allowed character on hashtag
    const match = text.match(/(?:\s|^)[A-Za-z0-9\-._]+(?:\s|$)/);

    if (match && isCollapsed(editor.selection)) {
      const beforeWordRange = getRangeBefore(editor, selection, {
        matchString: '#',
        skipInvalid: false,
        afterMatch: false,
        multiPaths: false,
      });

      if (beforeWordRange) {
        const beforeWordText = getText(editor, beforeWordRange);
        const currentText = beforeWordText + text;

        if (isHashTag(currentText)) {
          insertHashtag(editor, currentText.replace('#', ''), beforeWordRange);
        }
      } else {
        const beforeWordRange = getRangeBefore(editor, selection, {
          matchString: ' ',
          skipInvalid: true,
          afterMatch: false,
          multiPaths: false,
        });

        if (!beforeWordRange) {
          const prevNode = Editor.previous<any>(
            editor,
            getQueryOptions<TElement>(editor, {
              at: selection,
              match: {
                type: getPlatePluginType(editor, ELEMENT_HASHTAG),
              },
            }),
          );

          if (prevNode) {
            const [child, path] = prevNode;
            const current = child.hashtag + text;

            Transforms.removeNodes(editor, {at: path});

            const hashtag = {
              type: getPlatePluginType(editor, ELEMENT_HASHTAG),
              children: [{text: ''}],
              hashtag: current,
            };

            Transforms.insertNodes(editor, hashtag, {at: path});
            Transforms.select(editor, selection);
          } else {
            insertText(text);
          }
        } else {
          insertText(text);
        }
      }
    } else {
      insertText(text);
    }
  };

  return editor;
};
