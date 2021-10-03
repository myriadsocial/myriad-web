import {BaseModel} from './base.interface';

export enum ReferenceType {
  POST = 'post',
  COMMENT = 'comment',
}

export enum SectionType {
  DISCUSSION = 'discussion',
  DEBATE = 'debate',
}

export type LikeProps = {
  state: boolean;
  type: ReferenceType;
  referenceId: string;
  userId: string;
};

export interface Like extends LikeProps, BaseModel {}

export interface Dislike extends LikeProps, BaseModel {}

export type VoteProps = {
  state: boolean;
  type: ReferenceType;
  referenceId: string;
  section?: SectionType;
  userId: string;
};

export interface Vote extends VoteProps, BaseModel {}
