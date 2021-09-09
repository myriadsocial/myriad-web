import {BaseModel} from './base.interface';
import {User} from './user';

export interface CommentProps {
  text: string;
  postId: string;
  userId: string;
}

export interface Comment extends CommentProps, BaseModel {
  user: User;

  replies?: Comment[];
}
