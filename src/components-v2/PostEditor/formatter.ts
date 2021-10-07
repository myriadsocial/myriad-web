import {ELEMENT_MENTION, ELEMENT_PARAGRAPH} from '@udecode/plate';
import {TNode} from '@udecode/plate-core';

import {ELEMENT_HASHTAG} from './plugins/hashtag';

import {Post} from 'src/interfaces/post';

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

export const formatNodeToPost = (nodes: TNode[]): Partial<Post> => {
  const post: Partial<Post> = {
    text: JSON.stringify(nodes),
    tags: [],
    mentions: [],
  };

  const checkAttributes = (children: any) => {
    switch (children.type) {
      case ELEMENT_MENTION:
        post.mentions?.push({
          id: children.value,
          name: children.name,
          username: children.name,
        });
        break;
      case ELEMENT_HASHTAG:
        post.tags?.push(children.value);
        break;
      default:
        if (children.children) {
          for (const node of children.children) {
            checkAttributes(node);
          }
        }
        break;
    }
  };

  for (const node of nodes) {
    checkAttributes(node);
  }

  return post;
};
