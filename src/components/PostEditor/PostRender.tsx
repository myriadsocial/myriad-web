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

import {ELEMENT_IMAGE_LIST} from './Render/ImageList';
import {ELEMENT_SHOW_MORE, ShowMore} from './Render/ShowMore';
import {deserialize, formatToString} from './formatter';
import {ELEMENT_HASHTAG} from './plugins/hashtag';

import escapeHtml from 'escape-html';
import uniqueId from 'lodash/uniqueId';
import {Gallery} from 'src/components/atoms/Gallery';
import {Video} from 'src/components/atoms/Video/Video';
import {Post} from 'src/interfaces/post';
import theme from 'src/themes/light-theme';

type PostRenderProps = {
  post: Post;
  max?: number;
  onShowAll?: () => void;
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

  const renderPost = () => {
    const render: any[] = [];
    let imageUrls: string[] = [];

    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].type === ELEMENT_IMAGE) {
        if (nodes[i + 1] && nodes[i + 1].type === ELEMENT_IMAGE) {
          imageUrls.push(nodes[i].url as string);
          continue;
        } else {
          imageUrls.push(nodes[i].url as string);
          render.push(renderElement(nodes[i], imageUrls));
          imageUrls = [];
        }
      } else {
        render.push(renderElement(nodes[i], []));
      }
    }

    return render;
  };

  const renderElement = useCallback(
    (node, images: string[] = []) => {
      const id = uniqueId();

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
            key={id}
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
            <blockquote key={id}>
              <p>{children}</p>
            </blockquote>
          );
        case ELEMENT_PARAGRAPH:
          if (showMore) {
            return <span key={id}>{children}</span>;
          } else {
            return <p key={id}>{children}</p>;
          }
        case ELEMENT_H1:
        case ELEMENT_H2:
        case ELEMENT_H3:
        case ELEMENT_H4:
        case ELEMENT_H5:
        case ELEMENT_H6:
          return (
            <Typography key={id} variant={node.type as TypographyVariant} component="div">
              {children}
            </Typography>
          );
        case ELEMENT_ALIGN_CENTER:
          return (
            <Typography
              key={id}
              variant={node.type as TypographyVariant}
              component="div"
              align="center">
              {children}
            </Typography>
          );
        case ELEMENT_ALIGN_RIGHT:
          return (
            <Typography
              key={id}
              variant={node.type as TypographyVariant}
              component="div"
              align="right">
              {children}
            </Typography>
          );
        case ELEMENT_ALIGN_JUSTIFY:
          return (
            <Typography
              key={id}
              variant={node.type as TypographyVariant}
              component="div"
              align="justify">
              {children}
            </Typography>
          );
        case ELEMENT_UL:
          return <ul key={id}>{children}</ul>;
        case ELEMENT_OL:
          return <ol key={id}>{children}</ol>;
        case ELEMENT_LIC:
          return <li key={id}>{children}</li>;
        case ELEMENT_LINK:
          return (
            <a key={id} href={escapeHtml(node.url)}>
              {children}
            </a>
          );
        case ELEMENT_HASHTAG:
          return (
            <Link key={id} href={`/topic/hashtag?tag=${node.hashtag}`} shallow passHref>
              <Typography
                component="a"
                style={{
                  cursor: 'pointer',
                  fontWeight: 600,
                  color: theme.palette.primary.main,
                  display: 'inline-block',
                }}>
                #{node.hashtag}
              </Typography>
            </Link>
          );
        case ELEMENT_IMAGE:
          return <Gallery key={id} images={images} variant="vertical" />;
        case ELEMENT_IMAGE_LIST:
          return <Gallery key={id} images={node.url} variant="vertical" />;
        case ELEMENT_MEDIA_EMBED:
          return <Video key={id} url={node.url} />;
        case ELEMENT_MENTION:
          return (
            <Link key={id} href={'/profile/[id]'} as={`/profile/${node.value}`} shallow passHref>
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
            </Link>
          );
        case ELEMENT_SHOW_MORE:
          return <ShowMore key={id} onClick={onShowAll} />;
        default:
          return children;
      }
    },
    [max],
  );

  return <>{renderPost()}</>;
};
