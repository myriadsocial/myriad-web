import {ELEMENT_PARAGRAPH} from '@udecode/plate';
import {TNode} from '@udecode/plate-core';

export const formatStringToNode = (string: string): TNode => {
  return {
    type: ELEMENT_PARAGRAPH,
    children: [
      {
        text: string,
      },
    ],
  };
};
