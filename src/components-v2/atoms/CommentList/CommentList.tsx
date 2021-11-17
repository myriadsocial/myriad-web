import React from 'react';

import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {CommentDetail} from '../CommentDetail';

import {FriendDetail} from 'src/components-v2/FriendsMenu/hooks/use-friend-list.hook';
import {Comment, CommentProps} from 'src/interfaces/comment';
import {User} from 'src/interfaces/user';

type CommentListProps = {
  user?: User;
  comments: Comment[];
  mentionables: FriendDetail[];
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
  onSearchPeople: (query: string) => void;
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
    mentionables,
    deep = 0,
    onComment,
    onUpvote,
    onDownvote,
    onLoadReplies,
    onOpenTipHistory,
    onReport,
    onSendTip,
    onSearchPeople,
  } = props;

  const styles = useStyles();

  return (
    <div className={styles.root}>
      {comments.map(comment => (
        <CommentDetail
          user={user}
          key={comment.id}
          comment={comment}
          mentionables={mentionables}
          deep={deep}
          onReply={onComment}
          onUpvote={onUpvote}
          onDownVote={onDownvote}
          onLoadReplies={onLoadReplies}
          onOpenTipHistory={onOpenTipHistory}
          onReport={onReport}
          onSendTip={onSendTip}
          onSearchPeople={onSearchPeople}
        />
      ))}
    </div>
  );
};
