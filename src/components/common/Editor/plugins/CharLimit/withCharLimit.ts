import {PlateEditor, Value, WithPlatePlugin} from '@udecode/plate-core';

import {EditorValue} from '../../Editor.interface';
import {CharLimitPlugin} from './type';

import {formatToString} from 'components/common/NodeViewer/formatter';

export const withCharLimit = <V extends Value = Value, E extends PlateEditor<V> = PlateEditor<V>>(
  editor: E,
  {type, options}: WithPlatePlugin<CharLimitPlugin, V, E>,
) => {
  const {insertText, insertData} = editor;

  editor.insertText = (text: string) => {
    const children = editor.children as EditorValue;
    const currentRawString = children
      .map(element => formatToString(element))
      .join('. ')
      .trim();

    if (currentRawString.length < options.max) {
      if (text.includes('@')) {
        insertText(text.trim());
      } else {
        insertText(text);
      }
    }
  };

  editor.insertData = (data: DataTransfer) => {
    const text = data.getData('text/plain');
    const children = editor.children as EditorValue;
    const currentRawString = children
      .map(element => formatToString(element))
      .join('. ')
      .trim();

    if (currentRawString.length < options.max) {
      return insertText(text.slice(0, options.max - currentRawString.length));
    }

    insertData(data);
  };

  return editor;
};
