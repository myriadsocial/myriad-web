import {getPluginType, PlateEditor, Value, wrapNodes} from '@udecode/plate-core';

import {ELEMENT_HASHTAG} from '../createHashtagPlugin';
import {THashtagElement} from '../type';

import {Location} from 'slate';

export const wrapHashtag = <V extends Value>(
  editor: PlateEditor<V>,
  {at, hashtag}: {hashtag: string; at?: Location},
) => {
  wrapNodes<THashtagElement>(
    editor,
    {
      type: getPluginType(editor, ELEMENT_HASHTAG),
      hashtag: hashtag.replace('#', ''),
      children: [{text: ' '}],
    },
    {at, split: true},
  );
};
