import {BaseModel} from './base.interface';
import {User} from './user';

export enum FriendStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
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
