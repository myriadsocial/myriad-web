import {Comment, CommentProps} from '../../../interfaces/comment';

import {User} from 'src/interfaces/user';

export interface CommentDetailProps {
  user?: User;
  comment: Comment;
  deep: number;
  onReply: (comment: Partial<CommentProps>) => void;
  onUpvote: (comment: Comment) => void;
  onDownVote: (comment: Comment) => void;
  onLoadReplies: (referenceId: string, deep: number) => void;
  onOpenTipHistory: (comment: Comment) => void;
  onSendTip: (comment: Comment) => void;
  onReport: (comment: Comment) => void;
}
