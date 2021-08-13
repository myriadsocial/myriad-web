import {BaseModel} from './base.interface';

export interface CommentProps {
  text: string;
  postId: string;
  userId: string;
}

export interface Comment extends CommentProps, BaseModel {}
