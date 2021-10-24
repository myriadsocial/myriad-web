import {
  ELEMENT_IMAGE,
  ELEMENT_MEDIA_EMBED,
  ELEMENT_MENTION,
  ELEMENT_PARAGRAPH,
} from '@udecode/plate';
import {TNode} from '@udecode/plate-core';

import {ELEMENT_SHOW_MORE} from './Render/ShowMore';
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

const formatShowMore = (value: string, maxLength?: number): TNode[] => {
  const showMore = maxLength && value.length > maxLength;
  const text = maxLength && showMore ? value.slice(0, maxLength) : value;
  const nodes: TNode[] = [formatStringToNode(text)];

  if (showMore) {
    nodes.push({
      type: ELEMENT_SHOW_MORE,
      children: [
        {
          text: '',
        },
      ],
    });
  }

  return nodes;
};

export const hasMedia = (nodes: TNode[]): boolean => {
  const match = nodes.filter(node => [ELEMENT_MEDIA_EMBED, ELEMENT_IMAGE].includes(node.type));

  return match.length > 0;
};

export const formatToString = (node: TNode): string => {
  if (node.text) {
    return node.text.trim();
  }

  return node.children ? node.children.map((element: TNode) => formatToString(element)) : '';
};

export const deserialize = (post: Post, maxLength?: number): TNode[] => {
  try {
    const nodes = JSON.parse(post.text) as TNode[];
    const text = nodes.map(formatToString).join('');

    if (Array.isArray(nodes)) {
      if (maxLength && text.length > maxLength) {
        return [
          formatStringToNode(text.slice(0, maxLength)),
          {
            type: ELEMENT_SHOW_MORE,
            children: [
              {
                text: '',
              },
            ],
          },
        ];
      } else {
        return nodes;
      }
    } else {
      return formatShowMore(post.text, maxLength);
    }
  } catch (e) {
    console.log(e);
    return formatShowMore(post.text, maxLength);
  }
};

export const serialize = (nodes: TNode[]): Partial<Post> => {
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
        post.tags?.push(children.hashtag);
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
