import {SPEditor, TNode, WithOverride} from '@udecode/plate-core';

import {formatToString} from '../../formatter';

import {ReactEditor} from 'slate-react';

export type WordLimitOptions = {
  max: number;
};

export const withCharLimit =
  (options: WordLimitOptions): WithOverride<ReactEditor & SPEditor> =>
  editor => {
    const {insertText} = editor;

    editor.insertText = (text: string) => {
      const children = editor.children as TNode[];
      const currentRawString = children.map(formatToString).join('');

      if (currentRawString.length < options.max) {
        return insertText(text.slice(0, options.max - currentRawString.length));
      }
    };

    return editor;
  };
