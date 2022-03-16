import React, {createRef, useEffect} from 'react';

import Typography from '@material-ui/core/Typography';

import {CommentDeleted} from '../CommentDeleted';
import {CommentDetail, CommentDetailProps} from '../CommentDetail';
import {useStyles} from './CommentList.style';

import {useQueryParams} from 'src/hooks/use-query-params.hooks';
import {Comment} from 'src/interfaces/comment';
import {User} from 'src/interfaces/user';

type CommentListProps = Omit<CommentDetailProps, 'comment' | 'deep'> & {
  comments: Comment[];
  user?: User;
  deep?: number;
  placeholder?: string;
  focus?: boolean;
  expand?: boolean;
  hasMoreComment: boolean;
  onLoadMoreReplies: () => void;
  onReportReplies?: (replies: Comment) => void;
  onSendTipReplies?: (replies: Comment) => void;
};

type RefComment = Record<string, React.RefObject<HTMLDivElement>>;

export const CommentList: React.FC<CommentListProps> = props => {
  const {
    user,
    comments,
    deep = 0,
    hasMoreComment = false,
    onOpenTipHistory,
    onLoadMoreReplies,
    ...restProps
  } = props;

  const styles = useStyles();
  const {query} = useQueryParams();

  const refs: RefComment = comments.reduce((acc: RefComment, value: Comment) => {
    acc[value.id] = createRef<HTMLDivElement>();
    return acc;
  }, {});

  useEffect(() => {
    if (Object.keys(refs).length > 0) {
      if (!Array.isArray(query.comment) && query.comment) {
        if (refs[query.comment]?.current) {
          refs[query.comment].current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }
    }
  }, [refs, query]);

  return (
    <div>
      {comments.map(comment => {
        return comment.deleteByUser ? (
          <CommentDeleted
            ref={refs[comment.id]}
            key={comment.id}
            user={user}
            comment={comment}
            deep={deep}
            onOpenTipHistory={onOpenTipHistory}
          />
        ) : (
          <CommentDetail
            ref={refs[comment.id]}
            key={comment.id}
            user={user}
            deep={deep}
            comment={comment}
            onOpenTipHistory={onOpenTipHistory}
            {...restProps}
          />
        );
      })}

      {comments.length > 0 && deep > 0 && hasMoreComment && (
        <Typography
          color="primary"
          component="button"
          className={styles.more}
          onClick={onLoadMoreReplies}>
          View more replies
        </Typography>
      )}
    </div>
  );
};
