import {ELEMENT_LINK, TLinkElement} from '@udecode/plate';
import {getPluginType, PlateEditor, Value, wrapNodes} from '@udecode/plate-core';

import {Location} from 'slate';

/**
 * Wrap selected nodes with a link and collapse at the end.
 */
export const wrapLink = <V extends Value>(
  editor: PlateEditor<V>,
  {at, url}: {url: string; at?: Location},
) => {
  wrapNodes<TLinkElement>(
    editor,
    {
      type: getPluginType(editor, ELEMENT_LINK),
      url,
      children: [],
    },
    {at, split: true},
  );
};
