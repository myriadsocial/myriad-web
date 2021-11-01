import {BaseModel} from './base.interface';
import {ReferenceType, SectionType, Vote} from './interaction';
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
  votes?: Vote[];
  replies?: Comment[];
  isUpvoted?: boolean;
  isDownVoted?: boolean;
}
