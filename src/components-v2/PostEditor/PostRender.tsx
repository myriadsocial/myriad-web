import {
  ELEMENT_BLOCKQUOTE,
  ELEMENT_IMAGE,
  ELEMENT_LINK,
  ELEMENT_MENTION,
  ELEMENT_PARAGRAPH,
  ELEMENT_MEDIA_EMBED,
  TNode,
} from '@udecode/plate';

import React, {useCallback} from 'react';

import {Typography} from '@material-ui/core';

import {ELEMENT_HASHTAG} from './plugins/hashtag';

import escapeHtml from 'escape-html';
import {Gallery} from 'src/components-v2/atoms/Gallery';
import {Video} from 'src/components-v2/atoms/Video/Video';
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
            fontStyle: node.italic ? 'italic' : 'none',
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

    let children = '';
    try {
      children = node?.children.map((node: any) => renderElement(node));
    } catch (error) {
      console.log('error', node);
    }

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
        return <Gallery images={[node.url]} onImageClick={console.log} cloudName={'dsget80gs'} />;
      case ELEMENT_MEDIA_EMBED:
        return <Video url={node.url} />;
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
