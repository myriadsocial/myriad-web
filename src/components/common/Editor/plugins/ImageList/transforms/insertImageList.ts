import {getPluginType, insertNodes, PlateEditor, Value} from '@udecode/plate-core';

import {ELEMENT_IMAGE_LIST} from '../createImageListPlugin';
import {TImageListElement} from '../type';

export const insertImageList = <V extends Value>(editor: PlateEditor<V>, urls: string[]) => {
  const text = {text: ''};
  const image: TImageListElement = {
    type: getPluginType(editor, ELEMENT_IMAGE_LIST),
    urls,
    children: [text],
  };
  insertNodes<TImageListElement>(editor, image);
};
