import {BaseModel} from './base.interface';
import {ReferenceType, SectionType} from './interaction';
import {PostMetric} from './post';
import {User} from './user';

export interface CommentProps {
  text: string;
  type: ReferenceType;
  referenceId: string;
  postId: string;
  section: SectionType;
  userId: string;
}

export interface Comment extends CommentProps, BaseModel {
  user: User;
  metric: PostMetric;
  replies?: Comment[];
  isUpvoted?: boolean;
  isDownvoted?: boolean;
}
