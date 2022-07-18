import {ELEMENT_MEDIA_EMBED} from '@udecode/plate';
import {getParentNode, insertNodes, PlateEditor, PlatePluginKey, Value} from '@udecode/plate-core';
import {TElement} from '@udecode/plate-core';

export interface TMediaEmbedElementRaw extends TElement {
  file: File;
}

export const insertMediaEmbed = <V extends Value>(
  editor: PlateEditor<V>,
  {file, key = ELEMENT_MEDIA_EMBED}: Partial<TMediaEmbedElementRaw> & PlatePluginKey,
): void => {
  if (!editor.selection) return;
  const selectionParentEntry = getParentNode(editor, editor.selection);
  if (!selectionParentEntry) return;
  const [, path] = selectionParentEntry;
  insertNodes<TMediaEmbedElementRaw>(
    editor,
    {
      type: key,
      file,
      children: [{text: ''}],
    },
    {at: path},
  );
};
