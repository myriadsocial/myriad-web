import React from 'react';

import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {CommentDetail} from '../CommentDetail';
import {CommentEditor} from '../CommentEditor';

import {Comment, CommentProps} from 'src/interfaces/comment';
import {User} from 'src/interfaces/user';

type CommentListProps = {
  user?: User;
  comments: Comment[];
  deep?: number;
  placeholder?: string;
  focus?: boolean;
  expand?: boolean;
  onComment: (comment: Partial<CommentProps>) => void;
  onUpvote: (comment: Comment) => void;
  onDownvote: (comment: Comment) => void;
  onLoadReplies: (referenceId: string, deep: number) => void;
  onOpenTipHistory: (comment: Comment) => void;
  onSendTip: (comment: Comment) => void;
  onReport: (comment: Comment) => void;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
  }),
);

export const CommentList: React.FC<CommentListProps> = props => {
  const {
    user,
    comments = [],
    deep = 0,
    placeholder,
    focus,
    expand,
    onComment,
    onUpvote,
    onDownvote,
    onLoadReplies,
    onOpenTipHistory,
    onReport,
    onSendTip,
  } = props;

  const styles = useStyles();

  return (
    <div className={styles.root}>
      {deep === 0 && user && (
        <CommentEditor
          placeholder={placeholder || ''}
          onSubmit={onComment}
          username={user.name}
          avatar={user.profilePictureURL || ''}
          focus={focus}
          expand={expand}
        />
      )}

      {comments.map(comment => (
        <CommentDetail
          user={user}
          key={comment.id}
          comment={comment}
          deep={deep}
          onReply={onComment}
          onUpvote={onUpvote}
          onDownVote={onDownvote}
          onLoadReplies={onLoadReplies}
          onOpenTipHistory={onOpenTipHistory}
          onReport={onReport}
          onSendTip={onSendTip}
        />
      ))}
    </div>
  );
};
