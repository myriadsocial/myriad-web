import {Comment, CommentProps} from '../../../interfaces/comment';

import {FriendDetail} from 'src/components/FriendsMenu/hooks/use-friend-list.hook';
import {SectionType} from 'src/interfaces/interaction';
import {User} from 'src/interfaces/user';

export interface CommentDetailProps {
  section: SectionType;
  user?: User;
  comment: Comment;
  deep: number;
  mentionables: FriendDetail[];
  onReply: (comment: Partial<CommentProps>) => void;
  onUpvote: (comment: Comment) => void;
  onRemoveVote: (comment: Comment) => void;
  onLoadReplies: (referenceId: string, deep: number) => void;
  onOpenTipHistory: (comment: Comment) => void;
  onSendTip: (comment: Comment) => void;
  onReport: (comment: Comment) => void;
  onSearchPeople: (query: string) => void;
  setDownvoting: (comment: Comment) => void;
  onBeforeDownvote?: () => void;
}
