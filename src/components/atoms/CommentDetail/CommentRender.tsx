import {ELEMENT_BLOCKQUOTE, ELEMENT_MENTION, ELEMENT_PARAGRAPH} from '@udecode/plate';

import React, {useCallback} from 'react';

import Link from 'next/link';

import {Typography} from '@material-ui/core';

import {deserialize} from '../CommentEditor/formatter';

import {formatToString} from 'src/components/PostEditor';
import {ELEMENT_SHOW_MORE, ShowMore} from 'src/components/PostEditor/Render/ShowMore';
import {Comment} from 'src/interfaces/comment';
import theme from 'src/themes/light-theme';

type CommentRenderProps = {
  comment: Comment;
  max?: number;
  onShowAll: () => void;
};

export const CommentRender: React.FC<CommentRenderProps> = props => {
  const {comment, max, onShowAll} = props;
  let nodes = deserialize(comment);

  const originText = nodes.map(formatToString).join('');
  let showMore = false;

  if (max && originText.length > max) {
    nodes = deserialize(comment, max);
    showMore = true;
  }

  const renderPost = () => {
    const render: any[] = [];

    for (let i = 0; i < nodes.length; i++) {
      render.push(renderElement(nodes[i]));
    }

    return render;
  };

  const renderElement = useCallback(
    node => {
      if (node.text) {
        if (Object.keys(node).length === 1) {
          const splitNewLine = node.text.split('\n');

          return splitNewLine.map((item: string, key: number) => (
            <span key={key}>
              {item}
              {key !== splitNewLine.length - 1 && <br />}
            </span>
          ));
        }

        return (
          <Typography
            component="span"
            style={{
              fontWeight: node.bold ? 600 : 400,
              fontStyle: node.italic ? 'italic' : 'none',
              textDecoration: node.underline
                ? 'underline'
                : node.strikethrough
                ? 'line-through'
                : 'none',
            }}>
            {node.text}
          </Typography>
        );
      }

      const children = node?.children ? node.children.map((node: any) => renderElement(node)) : '';

      switch (node.type) {
        case ELEMENT_BLOCKQUOTE:
          return (
            <blockquote>
              <p>{children}</p>
            </blockquote>
          );
        case ELEMENT_PARAGRAPH:
          if (showMore) {
            return <span>{children}</span>;
          } else {
            return <p style={{marginTop: 0, marginBottom: 4}}>{children}</p>;
          }
        case ELEMENT_MENTION:
          return (
            <Link href={`/profile/${node.value}`} shallow={true}>
              <a href={`/profile/${node.value}`}>
                <Typography
                  component="span"
                  style={{
                    cursor: 'pointer',
                    fontWeight: 600,
                    color: theme.palette.primary.main,
                    display: 'inline-block',
                  }}>
                  @{node.name}
                </Typography>
              </a>
            </Link>
          );
        case ELEMENT_SHOW_MORE:
          return <ShowMore onClick={onShowAll} />;
        default:
          return children;
      }
    },
    [max],
  );

  return <>{renderPost()}</>;
};
