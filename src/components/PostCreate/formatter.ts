import {ELEMENT_MENTION, getNodeString} from '@udecode/plate';

import {EditorValue, RootBlock} from 'components/common/Editor/Editor.interface';
import {ELEMENT_HASHTAG} from 'components/common/Editor/plugins';
import {deserialize, formatToString} from 'components/common/NodeViewer/formatter';
import {Post} from 'src/interfaces/post';

export type StringifyData = {
  text: string;
  image: string;
};

export const serialize = (nodes: EditorValue): Partial<Post> => {
  const post: Partial<Post> = {
    text: JSON.stringify(nodes),
    rawText: nodes
      .map(element => getNodeString(element))
      .join(' ')
      .trim(),
    tags: [],
    mentions: [],
  };

  const checkAttributes = (children: RootBlock) => {
    switch (children.type) {
      case ELEMENT_MENTION:
        if (!post.mentions) {
          post.mentions = [
            {
              id: children.value,
              name: children.name as string,
              username: children.name as string,
            },
          ];
        }

        if (!post.mentions.map(mention => mention.id).includes(children.value)) {
          post.mentions.push({
            id: children.value,
            name: children.name as string,
            username: children.name as string,
          });
        }
        break;
      case ELEMENT_HASHTAG:
        if (!post.tags) {
          post.tags = [children.hashtag];
        }

        if (!post.tags.includes(children.hashtag)) {
          post.tags.push(children.hashtag);
        }

        break;
      default:
        const leaf = children.children;

        if (leaf && Array.isArray(leaf)) {
          for (const node of leaf) {
            checkAttributes(node as any);
          }
        }

        if (leaf && !Array.isArray(leaf)) {
          checkAttributes(leaf);
        }
        break;
    }
  };

  for (const node of nodes) {
    checkAttributes(node);
  }

  return post;
};

export const stringify = (post: Post): StringifyData => {
  const node = deserialize(post.text);
  const text = node
    .map(element => formatToString(element))
    .join(' ')
    .trim();

  const image = node.find(element => element.type === 'img');
  const imageURL = (image?.url as string) ?? null;

  return {
    text,
    image: imageURL,
  };
};
