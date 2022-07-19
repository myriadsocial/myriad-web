import {getNode, PlateEditor, unwrapNodes, Value, withoutNormalizing} from '@udecode/plate-core';

import {THashtagElement} from '../type';

import {Path} from 'slate';

export const removeHashtag = <V extends Value>(editor: PlateEditor<V>, path: Path) =>
  withoutNormalizing(editor, () => {
    const node = getNode<THashtagElement>(editor, path);
    if (!node) return;

    unwrapNodes(editor, {
      at: path,
    });
  });
