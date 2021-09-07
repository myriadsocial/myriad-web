import {TNode} from '@udecode/plate-core';
import {ELEMENT_PARAGRAPH} from '@udecode/plate-paragraph';

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
