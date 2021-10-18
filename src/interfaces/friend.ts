import {BaseModel} from './base.interface';
import {User} from './user';

export enum FriendStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  BLOCKED = 'blocked',
}

export type FriendProps = {
  status: FriendStatus;
  requesteeId: string;
  requestorId: string;
};

export interface Friend extends FriendProps, BaseModel {
  requestee: User;
  requestor: User;
}
