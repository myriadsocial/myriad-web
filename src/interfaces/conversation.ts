import {Post} from './post';
import {User} from './user';

export interface Conversation {
  read: boolean;
  unreadMessage: number;
  postId: string;
  userId: string;
}

export interface ExtendedConversation extends Conversation {
  user: User;
  post: Post;
}
