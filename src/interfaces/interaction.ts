import {BaseModel} from './base.interface';

export enum ReferenceType {
  POST = 'post',
  COMMENT = 'comment',
}

export type LikeProps = {
  type: ReferenceType;
  referenceId: string;
  userId: string;
};

export interface Like extends LikeProps, BaseModel {}
