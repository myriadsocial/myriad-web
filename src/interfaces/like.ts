import {BaseModel} from './base.interface';

export enum LikeType {
  POST = 'post',
  COMMENT = 'comment',
}

export interface LikeProps {
  type: LikeType;
  state: boolean;
  referenceId: string;
  userId: string;
}
export interface Like extends LikeProps, BaseModel {}
