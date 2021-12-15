import {ELEMENT_MENTION, TNode} from '@udecode/plate';

import {formatStringToNode, formatToString, formatShowMore} from 'src/components/PostEditor';
import {ELEMENT_SHOW_MORE} from 'src/components/PostEditor/Render/ShowMore';
import {Comment, CommentProps} from 'src/interfaces/comment';

type CommentSerializedProps = Pick<CommentProps, 'text' | 'mentions'>;

export const serialize = (nodes: TNode[]): CommentSerializedProps => {
  const comment: CommentSerializedProps = {
    text: JSON.stringify(nodes),
    mentions: [],
  };

  const checkAttributes = (children: any) => {
    switch (children.type) {
      case ELEMENT_MENTION:
        comment.mentions.push({
          id: children.value,
          name: children.name,
          username: children.name,
        });
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

  return comment;
};

export const deserialize = (comment: Comment, maxLength?: number): TNode[] => {
  let nodes: TNode[] = [];

  try {
    const originNodes = JSON.parse(comment.text) as TNode[];
    nodes = originNodes;

    if (Array.isArray(nodes)) {
      const text = nodes.map(formatToString).join(' ');

      if (maxLength && text.length > maxLength) {
        nodes = [
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
      }
    } else {
      nodes = formatShowMore(comment.text, maxLength);
    }
  } catch (e) {
    nodes = formatShowMore(comment.text, maxLength);
  }

  return nodes;
};
