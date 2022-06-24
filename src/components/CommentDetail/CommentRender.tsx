import {ELEMENT_BLOCKQUOTE, ELEMENT_MENTION, ELEMENT_PARAGRAPH} from '@udecode/plate';

import React, {useCallback} from 'react';

import Link from 'next/link';

import {Typography} from '@material-ui/core';

import {deserialize} from '../CommentEditor/formatter';

import {formatToString} from 'src/components/PostEditor';
import {ELEMENT_SHOW_MORE, ShowMore} from 'src/components/PostEditor/Render/ShowMore';
import {Comment} from 'src/interfaces/comment';
import i18n from 'src/locale';
import theme from 'src/themes/light-theme';

type CommentRenderProps = {
  comment: Comment;
  max?: number;
  onShowAll: () => void;
};

type ReportTypeCategory =
  | 'abusive_violent'
  | 'unauthorize_copyright'
  | 'child_exploitation'
  | 'pornography'
  | 'private_information'
  | 'spam'
  | 'unauthorize_trademark';

const ReportTypeCategoryMapper: Record<ReportTypeCategory, string> = {
  abusive_violent: i18n.t('Post_Comment.Modal_Report.Reason_Abuse'),
  unauthorize_copyright: i18n.t('Post_Comment.Modal_Report.Reason_Copyright'),
  child_exploitation: i18n.t('Post_Comment.Modal_Report.Reason_Child_Sexual'),
  pornography: i18n.t('Post_Comment.Modal_Report.Reason_Porn'),
  private_information: i18n.t('Post_Comment.Modal_Report.Reason_Private'),
  spam: i18n.t('Post_Comment.Modal_Report.Reason_Spam'),
  unauthorize_trademark: i18n.t('Post_Comment.Modal_Report.Reason_Trademark'),
};

export const CommentRender: React.FC<CommentRenderProps> = props => {
  const {comment, max, onShowAll} = props;

  const category = comment.reportType;

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
      render.push(renderElement(nodes[i], i));
    }

    return render;
  };

  const translationComment = (comment: string) => {
    switch (comment) {
      case '[This comment is from a private account]':
        return i18n.t('Post_Comment.Private_Account');

      case '[comment removed]':
        return i18n.t('Post_Comment.Banned_Account', {
          reportingLabel: ReportTypeCategoryMapper[category],
        });

      default:
        return comment;
    }
  };

  const renderElement = useCallback(
    (node, i) => {
      if (node.text) {
        node.text = translationComment(node.text);
        if (Object.keys(node).length === 1) {
          const splitNewLine = node.text.split('\n');

          return splitNewLine.map((item: string, key: number) => (
            <Typography
              variant="body1"
              component="span"
              key={`${i}--${key}`}
              style={{wordBreak: 'break-word'}}>
              {item}
              {key !== splitNewLine.length - 1 && <br />}
            </Typography>
          ));
        }

        return (
          <Typography
            component="span"
            variant="body1"
            key={i}
            style={{
              fontWeight: node.bold ? 600 : 400,
              fontStyle: node.italic ? 'italic' : 'none',
              wordBreak: 'break-word',
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

      const children = node?.children
        ? node.children.map((node: any, j: number) => renderElement(node, `${i}-${j}`))
        : '';

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
            return (
              <p style={{marginTop: 0, marginBottom: 4, wordBreak: 'break-word'}}>{children}</p>
            );
          }
        case ELEMENT_MENTION:
          return (
            <Link href={'/profile/[id]'} as={`/profile/${node.value}`} shallow>
              <Typography
                component="a"
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
          return <ShowMore onClick={onShowAll} />;
        default:
          return children;
      }
    },
    [max],
  );

  return <>{renderPost()}</>;
};
