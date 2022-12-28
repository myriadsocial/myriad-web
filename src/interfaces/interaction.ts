import {BaseModel} from './base.interface';

export enum ReferenceType {
  POST = 'post',
  COMMENT = 'comment',
  USER = 'user',
  PEOPLE = 'people',
  EXCLUSIVE_CONTENT = 'unlockable_content',
}

export enum SectionType {
  DISCUSSION = 'discussion',
  DEBATE = 'debate',
}

export type VoteProps = {
  state: boolean;
  type: ReferenceType;
  referenceId: string;
  postId: string;
  section?: SectionType;
  userId: string;
};

export interface Vote extends VoteProps, BaseModel {}
