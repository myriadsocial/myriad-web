import {Comment, CommentProps} from '../../../interfaces/comment';

import {FriendDetail} from 'src/components-v2/FriendsMenu/hooks/use-friend-list.hook';
import {User} from 'src/interfaces/user';

export interface CommentDetailProps {
  user?: User;
  comment: Comment;
  deep: number;
  mentionables: FriendDetail[];
  onReply: (comment: Partial<CommentProps>) => void;
  onUpvote: (comment: Comment) => void;
  onDownVote: (comment: Comment) => void;
  onLoadReplies: (referenceId: string, deep: number) => void;
  onOpenTipHistory: (comment: Comment) => void;
  onSendTip: (comment: Comment) => void;
  onReport: (comment: Comment) => void;
  onSearchPeople: (query: string) => void;
}
