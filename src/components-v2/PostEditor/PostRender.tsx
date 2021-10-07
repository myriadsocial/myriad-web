import {
  ELEMENT_BLOCKQUOTE,
  ELEMENT_IMAGE,
  ELEMENT_LINK,
  ELEMENT_MENTION,
  ELEMENT_PARAGRAPH,
  TNode,
} from '@udecode/plate';

import React, {useCallback} from 'react';

import {Typography} from '@material-ui/core';

import {ELEMENT_HASHTAG} from './plugins/hashtag';

import escapeHtml from 'escape-html';
import theme from 'src/themes/light-theme-v2';

type PostRenderProps = {
  nodes: TNode[];
};

export const PostRender: React.FC<PostRenderProps> = props => {
  const {nodes} = props;

  const renderElement = useCallback(node => {
    if (node.text) {
      return (
        <Typography
          component="span"
          style={{
            fontWeight: node.bold ? 600 : 400,
            textDecoration: node.underline
              ? 'underline'
              : node.striketrough
              ? 'line-through'
              : 'none',
          }}>
          {node.text}
        </Typography>
      );
    }

    const children = node.children.map((node: any) => renderElement(node));

    switch (node.type) {
      case ELEMENT_BLOCKQUOTE:
        return (
          <blockquote>
            <p>{children}</p>
          </blockquote>
        );
      case ELEMENT_PARAGRAPH:
        return <p>{children}</p>;
      case ELEMENT_LINK:
        return <a href={escapeHtml(node.url)}>{children}</a>;
      case ELEMENT_HASHTAG:
        return (
          <Typography
            component="span"
            style={{fontWeight: 600, color: theme.palette.primary.main, display: 'inline-block'}}>
            #{children}
          </Typography>
        );
      case ELEMENT_IMAGE:
        return <span>{children}</span>;
      case ELEMENT_MENTION:
        return (
          <Typography
            component="span"
            style={{fontWeight: 600, color: theme.palette.primary.main, display: 'inline-block'}}>
            @{children}
          </Typography>
        );
      default:
        return children;
    }
  }, []);

  return <>{nodes.map(renderElement)}</>;
};
