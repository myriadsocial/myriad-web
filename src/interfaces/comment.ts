import {BaseModel} from './base.interface';
import {ReferenceType, SectionType, Vote} from './interaction';
import {MentionUserProps, Post} from './post';
import {User} from './user';

type CommentMetric = {
  upvotes: number;
  downvotes: number;
  deletedComments: number;
  comments: number;
};

export interface CommentProps {
  text: string;
  type: ReferenceType;
  referenceId: string;
  postId: string;
  section: SectionType;
  userId: string;
  mentions: MentionUserProps[];
}

export interface Comment extends CommentProps, BaseModel {
  deleteByUser?: boolean;
  user: User;
  post?: Post;
  metric: CommentMetric;
  votes?: Vote[];
  replies?: Comment[];
  isUpvoted?: boolean;
  isDownVoted?: boolean;
}
