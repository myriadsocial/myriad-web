import {
  collapseSelection,
  getLeafNode,
  getPluginType,
  insertNodes,
  isCollapsed,
  PlateEditor,
  select,
  unwrapNodes,
  Value,
} from '@udecode/plate-core';

import {ELEMENT_HASHTAG} from '../createHashtagPlugin';
import {THashtagElement} from '../type';
import {wrapHashtag} from './wrapHashtag';

export const upsertHashtagAtSelection = <V extends Value>(
  editor: PlateEditor<V>,
  {
    hashtag,
    wrap,
  }: {
    hashtag: string;
    /**
     * If true, wrap the link at the location (default: selection) even if the selection is collapsed.
     */
    wrap?: boolean;
  },
) => {
  if (!editor.selection) return;

  const type = getPluginType(editor, ELEMENT_HASHTAG);

  if (!wrap && isCollapsed(editor.selection)) {
    return insertNodes<THashtagElement>(editor, {
      type,
      hashtag: hashtag.replace('#', ''),
      children: [{text: ' '}],
    });
  }

  // if our cursor is inside an existing link, but don't have the text selected, select it now
  if (wrap && isCollapsed(editor.selection)) {
    const linkLeaf = getLeafNode(editor, editor.selection);
    const [, inlinePath] = linkLeaf;
    select(editor, inlinePath);
  }

  unwrapNodes(editor, {at: editor.selection, match: {type}});

  wrapHashtag(editor, {at: editor.selection, hashtag});

  collapseSelection(editor, {edge: 'end'});
};
