import {Comment} from 'src/interfaces/comment';
import {User} from 'src/interfaces/user';

export interface CommentDeletedProps {
  user?: User;
  comment: Comment;
  deep: number;
  onOpenTipHistory: (comment: Comment) => void;
}
