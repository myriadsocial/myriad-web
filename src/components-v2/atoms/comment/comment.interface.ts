export interface Comment {
  id: string;
  username: string;
  avatar: string;
  text: string;
  createdAt: Date;
  comments?: Comment[];
}

export type CommentComponentProps = {
  comments?: Comment[];
  deep?: number;
};

export interface CommentDisplayProps {
  comment: Comment;
  deep: number;
}
