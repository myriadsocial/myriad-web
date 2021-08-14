import {ImageSizes} from './assets';
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

export interface ExtendedFriend extends Friend {
  id: string;
  createdAt: Date;
  requestor: User & {
    profilePicture: ImageSizes;
  };
  friend: User & {
    profilePicture: ImageSizes;
  };
}
