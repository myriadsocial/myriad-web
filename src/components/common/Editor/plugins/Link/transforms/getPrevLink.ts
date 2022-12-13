import {ELEMENT_LINK, getAboveNode, getPluginType, PlateEditor, Value} from '@udecode/plate';

export const getPrevLink = <V extends Value>(editor: PlateEditor<V>): string | null => {
  const type = getPluginType(editor, ELEMENT_LINK);

  const linkNode = getAboveNode(editor, {
    match: {type},
  });

  if (!linkNode) return null;

  return linkNode[0].url as string;
};
