import {getPluginType, PlateEditor, unwrapNodes, Value} from '@udecode/plate';

import {ELEMENT_HASHTAG} from '../createHashtagPlugin';
import {wrapHashtag} from './wrapHashtag';

import {Range} from 'slate';

export const upsertHashtag = <V extends Value>(
  editor: PlateEditor<V>,
  {
    hashtag,
    at,
  }: {
    hashtag: string;
    at: Range;
  },
) => {
  unwrapNodes(editor, {
    at,
    match: {type: getPluginType(editor, ELEMENT_HASHTAG)},
  });

  const newSelection = editor.selection as Range;

  wrapHashtag(editor, {
    at: {
      ...at,
      focus: newSelection.focus,
    },
    hashtag,
  });
};
