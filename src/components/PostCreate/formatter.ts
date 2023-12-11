import {
  ELEMENT_MENTION,
  ELEMENT_MENTION_INPUT,
  getNodeString,
} from '@udecode/plate';

import {
  EditorValue,
  RootBlock,
} from 'components/common/Editor/Editor.interface';
import { ELEMENT_HASHTAG } from 'components/common/Editor/plugins';
import {
  deserialize,
  formatToString,
} from 'components/common/NodeViewer/formatter';
import { MentionUserProps, Post } from 'src/interfaces/post';
import * as UserAPI from 'src/lib/api/user';

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
      case ELEMENT_MENTION_INPUT: {
        const username = children.children[0].text.trim();
        if (!post.mentions) {
          post.mentions = [
            {
              id: username,
              name: username,
              username: username,
            },
          ];
        }

        if (!post.mentions.map(mention => mention.id).includes(username)) {
          post.mentions.push({
            id: username,
            name: username,
            username: username,
          });
        }
        break;
      }
      case ELEMENT_MENTION:
        if (!post.mentions) {
          post.mentions = [
            {
              id: children.value,
              name: children.name as string,
              username: children.username as string,
            },
          ];
        }

        if (
          !post.mentions.map(mention => mention.id).includes(children.value)
        ) {
          post.mentions.push({
            id: children.value,
            name: children.name as string,
            username: children.username as string,
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

export const handleMention = async (username: string) => {
  try {
    const User = await UserAPI.getUserByUserName(username);
    console.log('User is', User);
    return User;
  } catch (err) {
    throw 'Failed to fetch user';
  }
};

const handleImageFormat = (imageurl?: string[]) => {
  if (!imageurl) {
    return [];
  } else {
    const imagechildren = imageurl.map(url => {
      return {
        type: 'img',
        url: url,
        children: [
          {
            text: '',
          },
        ],
      };
    });
    return imagechildren;
  }
};

export const handleFormatCKEditor = async (
  rawtext: string,
  imageurl?: string[],
) => {
  const regex = /([\@\#][\w]+)/g;
  const mention = /(?<=\@)\w+/g;
  const tag = /(?<=\#)\w+/g;
  const text = rawtext.split(regex);
  const mentions: MentionUserProps[] = [];
  const hashtags = [];

  const promises = text.map(substring => {
    if (mention.test(substring)) {
      const match = substring.match(mention);
      const username = match[0];
      return handleMention(username).then(User => {
        if (User.length !== 0) {
          const child = {
            type: 'mention',
            value: User[0].id,
            username: User[0].username,
            name: User[0].name,
            children: [
              {
                text: '',
              },
            ],
          };
          mentions.push({
            id: User[0].id,
            username: User[0].username,
            name: User[0].name,
          });
          return child;
        } else {
          const child = {
            text: substring,
          };
          return child;
        }
      });
    }
    if (tag.test(substring)) {
      const match = substring.match(tag);
      const hashtag = match[0];
      hashtags.push(hashtag);
      const child = {
        type: 'hashtag',
        hashtag,
        children: [
          {
            text: '',
          },
        ],
      };
      return new Promise(res => res(child));
    } else {
      const child = {
        text: substring,
      };
      return new Promise(res => res(child));
    }
  });

  const children = await Promise.all(promises).catch(err => console.error(err));
  if (children) {
    const format = {
      type: 'p',
      children: [...children, ...handleImageFormat(imageurl)],
    };
    const skeleton = { format, mentions, hashtags };
    return skeleton;
  } else {
    throw 'There is a formatting error';
  }
};
