import {findNode, FindNodeOptions, getPluginType, PlateEditor, Value} from '@udecode/plate-core';

import {THashtagElement} from '..';
import {ELEMENT_HASHTAG} from '../createHashtagPlugin';

export const findHashtag = <V extends Value>(
  editor: PlateEditor<V>,
  options?: Omit<FindNodeOptions<V>, 'match'>,
) =>
  findNode<THashtagElement>(editor, {
    ...options,
    match: {type: getPluginType(editor, ELEMENT_HASHTAG)},
  });
