import {ELEMENT_PARAGRAPH} from '@udecode/plate';
import {
  isCollapsed,
  getRangeBefore,
  getRangeFromBlockStart,
  getBlockAbove,
  getText,
  wrapNodes,
  isSelectionAtBlockEnd,
  getQueryOptions,
} from '@udecode/plate-common';
import {
  getPlatePluginType,
  SPEditor,
  WithOverride,
  TElement,
  TDescendant,
} from '@udecode/plate-core';

import {ELEMENT_HASHTAG} from './default';

import {Range, Transforms, Editor, BaseRange} from 'slate';
import {ReactEditor} from 'slate-react';

export type HashtagOptions = {
  max: number;
};

const isHashTag = (string: string): boolean => {
  if (typeof string !== 'string') {
    return false;
  }

  const match = string.match(/(?:\s|^)#[A-Za-z0-9\-._]+(?:\s|$)/);
  if (!match) {
    return false;
  }

  return true;
};

export const insertHashtag = (editor: SPEditor, value: string | ArrayBuffer, at: Range) => {
  const hashtag = {
    type: getPlatePluginType(editor, ELEMENT_HASHTAG),
    children: [{text: ''}],
    hashtag: value,
  };

  wrapNodes<TElement>(editor, hashtag, {
    at,
    split: true,
  });

  Transforms.insertText(editor, '');
  Transforms.move(editor);
};

export const withHashtag =
  (options: HashtagOptions): WithOverride<ReactEditor & SPEditor> =>
  editor => {
    const {insertText} = editor;

    editor.insertText = (text: string) => {
      const selection = editor.selection as Range;

      if (!isCollapsed(selection)) {
        return insertText(text);
      }
      // allowed character on hashtag
      const match = text.match(/^[a-zA-Z0-9_]+$/);

      if (match) {
        // check if hashtag character exist on previous node
        // minimum requirement for hashtag element is a hashtag char followed by any character
        const hashtagCharRange = getRangeBefore(editor, selection, {
          matchString: '#',
          skipInvalid: false,
          afterMatch: false,
          multiPaths: false,
        });

        // if hashtag char exist treat current text as hashtag element
        if (hashtagCharRange) {
          const beforeWordText = getText(editor, hashtagCharRange);

          const currentText = beforeWordText + text;

          if (isHashTag(currentText)) {
            insertHashtag(editor, currentText.replace('#', ''), hashtagCharRange);
          }
        } else {
          // check if white space is exist on current node
          // hashtag is separated by white space
          const whiteSpace = getRangeBefore(editor, selection, {
            matchString: ' ',
            skipInvalid: true,
            afterMatch: false,
            multiPaths: false,
          });

          if (!whiteSpace) {
            // check if previous node is a hastag node,
            const prevNode = Editor.previous<any>(
              editor,
              getQueryOptions<TElement>(editor, {
                at: selection,
                match: {
                  type: getPlatePluginType(editor, ELEMENT_HASHTAG),
                },
              }),
            );

            // if previous node is a hastag node, update the hastag text
            if (prevNode) {
              const [child, path] = prevNode;
              const current = child.hashtag + text;

              // current hashtag text plus new inserted text is in hashtag char limit update the hashtag text
              // otherwise treat as new text node
              if (current.length <= options.max) {
                const hashtag = {
                  type: getPlatePluginType(editor, ELEMENT_HASHTAG),
                  children: [{text: ''}],
                  hashtag: current,
                };

                Transforms.removeNodes(editor, {at: path});
                Transforms.insertNodes(editor, hashtag, {at: path});
                Transforms.select(editor, selection);
              } else {
                insertText(` ${text}`);
              }
            } else {
              insertText(text);
            }
          } else {
            insertText(text);
          }
        }
      } else {
        if (text.length === 1) {
          if (text === '#') {
            if (isSelectionAtBlockEnd(editor)) {
              insertText(text);
            } else {
              const block = getBlockAbove(editor)?.[0];
              const path = getBlockAbove(editor)?.[1];
              const before = getRangeFromBlockStart(editor, {at: selection});
              let beforeText = getText(editor, before);

              if (block?.type === ELEMENT_PARAGRAPH) {
                const newChildren: TDescendant = [];

                block.children.forEach((children: TDescendant) => {
                  if (children.text) {
                    if (children.text.includes(beforeText)) {
                      const chunk = children.text
                        .split(beforeText)
                        .map((text: string) => text.trim());

                      for (const item of chunk) {
                        if (item.length > 0) {
                          const [first, ...second] = item.split(' ');

                          newChildren.push({
                            type: getPlatePluginType(editor, ELEMENT_HASHTAG),
                            children: [{text: ''}],
                            hashtag: first,
                          });
                          newChildren.push({
                            text: ` ${second.join(' ')}`,
                          });
                        } else {
                          newChildren.push({
                            text: ` ${beforeText} `,
                          });
                        }
                      }
                    } else {
                      beforeText = beforeText.replace(children.text.trim(), '').trim();
                      newChildren.push(children);
                    }
                  } else {
                    beforeText = beforeText.trim();
                    newChildren.push(children);
                  }
                });

                const newElement = {
                  type: getPlatePluginType(editor, ELEMENT_PARAGRAPH),
                  children: newChildren,
                };

                Transforms.removeNodes(editor, {at: path});
                Transforms.insertNodes(editor, newElement, {at: path, select: true});
              } else {
                insertText(text);
              }
            }
          } else {
            insertText(text);
          }
        } else {
          const hashtagRule = /([#|＃][^\s]+)/g;

          const prevNode = Editor.previous<any>(
            editor,
            getQueryOptions<TElement>(editor, {
              at: selection,
              match: {
                type: getPlatePluginType(editor, ELEMENT_PARAGRAPH),
              },
            }),
          );

          const children = text.split(hashtagRule).map(slice => {
            if (slice.match(hashtagRule)) {
              return {
                type: getPlatePluginType(editor, ELEMENT_HASHTAG),
                children: [{text: ''}],
                hashtag: slice.replace('#', ''),
              };
            } else {
              return {
                text: slice,
              };
            }
          });

          if (prevNode) {
            const [element, path] = prevNode;

            const newElement = {
              type: getPlatePluginType(editor, ELEMENT_PARAGRAPH),
              children: element.children.concat([...children, {text: ' '}]),
            };

            Transforms.removeNodes(editor, {at: path});
            Transforms.insertNodes(editor, newElement, {at: path, select: true});
          } else {
            const path = selection as BaseRange;

            const element = {
              type: getPlatePluginType(editor, ELEMENT_PARAGRAPH),
              children,
            };

            Transforms.insertNodes(editor, element, {at: path, select: true});
          }
        }
      }
    };

    return editor;
  };
