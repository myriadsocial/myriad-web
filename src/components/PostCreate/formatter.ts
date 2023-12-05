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
import { Post } from 'src/interfaces/post';

export type StringifyData = {
  text: string;
  image: string;
};
import * as UserAPI from 'src/lib/api/user';

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
  const User = await UserAPI.getUserByUserName(username).catch(err => console.error("There is an error ", err));
  // console.log("User is", User);
  return User ;
}

export const handleFormatCKEditor = async (rawtext: string) => {
  const regex = /[\@\#][\w]+/g ;
  const mention = /(?<=\@)\w+/g ;
  const tag = /(?<=\#)\w+/g ;
  const text = rawtext.split(regex);


  const promises = text.map(substring => {
    if (mention.test(substring)) {
      const username = substring.match(mention)[0] ;
      handleMention(username).then(User => {
        if (!User) {
          const child =  {
            text : substring
          }
          return child ;
        }
        else {
          const child = {
            type: "mention",
            value: User.id,
            username: User.username,
            name: User.name,
            children : [{
              text: ""
            }]
          }
          return child ;
        }
      })

    }
    if (tag.test(substring)) {
      const hashtag = substring.match(tag)[0]
      const child = {
        type: "hashtag",
        hashtag,
        children : [{
          text: ""
        }]
      }
      return new Promise(res => res(child)) ;

    }
    else {
      const child =  {
        text : substring
      }
      return new Promise(res => res(child)) ;
    }
  })

  const children = await Promise.all(promises).catch(err => console.error(err));
  if (children) {
    const format = {
      type: "p",
      children
    }
    return format
  }
  else {
    throw("There is a formatting error");
  }

}
