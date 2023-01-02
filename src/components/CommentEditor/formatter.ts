import {ELEMENT_MENTION} from '@udecode/plate';

import {EditorValue} from 'components/common/Editor/Editor.interface';
import {CommentProps} from 'src/interfaces/comment';

export type CommentSerializedProps = Pick<CommentProps, 'text' | 'mentions'>;

export const serialize = (nodes: EditorValue): CommentSerializedProps => {
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
