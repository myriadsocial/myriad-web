import {
  ELEMENT_BLOCKQUOTE,
  ELEMENT_IMAGE,
  ELEMENT_LINK,
  ELEMENT_MENTION,
  ELEMENT_PARAGRAPH,
  ELEMENT_MEDIA_EMBED,
  ELEMENT_H4,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H5,
  ELEMENT_H6,
  ELEMENT_ALIGN_CENTER,
  ELEMENT_ALIGN_RIGHT,
  ELEMENT_ALIGN_JUSTIFY,
  ELEMENT_OL,
  ELEMENT_UL,
  ELEMENT_LIC,
} from '@udecode/plate';

import React, {useCallback} from 'react';

import Link from 'next/link';

import {Typography, TypographyVariant} from '@material-ui/core';

import escapeHtml from 'escape-html';
import {Gallery} from 'src/components-v2/atoms/Gallery';
import {Video} from 'src/components-v2/atoms/Video/Video';
import {Post} from 'src/interfaces/post';
import theme from 'src/themes/light-theme-v2';

import {ELEMENT_IMAGE_LIST} from './Render/ImageList';
import {ELEMENT_SHOW_MORE, ShowMore} from './Render/ShowMore';
import {deserialize, formatToString} from './formatter';
import {ELEMENT_HASHTAG} from './plugins/hashtag';

type PostRenderProps = {
  post: Post;
  max?: number;
  onShowAll: () => void;
};

export const PostRender: React.FC<PostRenderProps> = props => {
  const {post, max, onShowAll} = props;
  let nodes = deserialize(post);
  const originText = nodes.map(formatToString).join('');
  let showMore = false;

  if (max && originText.length > max) {
    nodes = deserialize(post, max);
    showMore = true;
  }

  const renderElement = useCallback(
    node => {
      if (node.text) {
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
            return <p>{children}</p>;
          }
        case ELEMENT_H1:
        case ELEMENT_H2:
        case ELEMENT_H3:
        case ELEMENT_H4:
        case ELEMENT_H5:
        case ELEMENT_H6:
          return (
            <Typography variant={node.type as TypographyVariant} component="div">
              {children}
            </Typography>
          );
        case ELEMENT_ALIGN_CENTER:
          return (
            <Typography variant={node.type as TypographyVariant} component="div" align="center">
              {children}
            </Typography>
          );
        case ELEMENT_ALIGN_RIGHT:
          return (
            <Typography variant={node.type as TypographyVariant} component="div" align="right">
              {children}
            </Typography>
          );
        case ELEMENT_ALIGN_JUSTIFY:
          return (
            <Typography variant={node.type as TypographyVariant} component="div" align="justify">
              {children}
            </Typography>
          );
        case ELEMENT_UL:
          return <ul>{children}</ul>;
        case ELEMENT_OL:
          return <ol>{children}</ol>;
        case ELEMENT_LIC:
          return <li>{children}</li>;
        case ELEMENT_LINK:
          return <a href={escapeHtml(node.url)}>{children}</a>;
        case ELEMENT_HASHTAG:
          return (
            <Link href={`/home?tag=${node.hashtag}&type=trending`} shallow={true}>
              <Typography
                component="span"
                style={{
                  fontWeight: 600,
                  color: theme.palette.primary.main,
                  display: 'inline-block',
                }}>
                #{node.hashtag}
              </Typography>
            </Link>
          );
        case ELEMENT_IMAGE:
          return <Gallery images={[node.url]} cloudName={'dsget80gs'} />;
        case ELEMENT_IMAGE_LIST:
          return <Gallery images={node.url} cloudName={'dsget80gs'} />;
        case ELEMENT_MEDIA_EMBED:
          return <Video url={node.url} />;
        case ELEMENT_MENTION:
          return (
            <Typography
              component="span"
              style={{fontWeight: 600, color: theme.palette.primary.main, display: 'inline-block'}}>
              @{node.name}
            </Typography>
          );
        case ELEMENT_SHOW_MORE:
          return <ShowMore onClick={onShowAll} />;
        default:
          return children;
      }
    },
    [max],
  );

  return <>{nodes.map(renderElement)}</>;
};
