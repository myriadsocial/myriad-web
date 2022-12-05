import {
  KeyboardHandlerReturnType,
  PlateEditor,
  Value,
} from '@udecode/plate-core';
import { formatToString } from 'components/common/NodeViewer/formatter';
import { EditorValue } from '../../Editor.interface';

export const getOnKeydownLimit = <
V extends Value = Value,
E extends PlateEditor<V> = PlateEditor<V>
>(
editor: E,
plugin,
): KeyboardHandlerReturnType => (event) => {
  const children = editor.children as EditorValue;
  const currentRawString = children
    .map(element => formatToString(element))
    .join('. ')
    .trim();

  if (event.key !== 'Backspace' && currentRawString.length >= plugin.options.max) {
    event.preventDefault();
  }
};
