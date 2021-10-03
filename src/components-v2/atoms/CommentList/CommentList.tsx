import React from 'react';

import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {Comment, CommentProps} from '../../../interfaces/comment';
import {User} from '../../../interfaces/user';
import {CommentDetail} from '../CommentDetail';
import {CommentEditor} from '../CommentEditor';

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
  onLoadReplies: (referenceId: string) => void;
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
        />
      ))}
    </div>
  );
};
