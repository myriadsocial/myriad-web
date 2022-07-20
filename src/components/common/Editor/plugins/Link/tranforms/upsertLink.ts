import {ELEMENT_LINK, upsertLinkAtSelection} from '@udecode/plate';
import {
  getAboveNode,
  getPluginType,
  isCollapsed,
  PlateEditor,
  unwrapNodes,
  Value,
} from '@udecode/plate-core';

export const upsertLink = async <V extends Value>(editor: PlateEditor<V>, url: string | null) => {
  const type = getPluginType(editor, ELEMENT_LINK);

  const linkNode = getAboveNode(editor, {
    match: {type},
  });

  if (!url) {
    linkNode &&
      editor.selection &&
      unwrapNodes(editor, {
        at: editor.selection,
        match: {type: getPluginType(editor, ELEMENT_LINK)},
      });

    return;
  }

  // If our cursor is in middle of a link, then we don't want to insert it inline
  const shouldWrap: boolean = linkNode !== undefined && isCollapsed(editor.selection);
  upsertLinkAtSelection(editor, {url, wrap: shouldWrap});
};
