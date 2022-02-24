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
  totalMutual?: number;
};

export interface Friend extends FriendProps, BaseModel {
  mutual?: number;
  requestee: User;
  requestor: User;
}
