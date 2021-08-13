import {ImageSizes} from './base.interface';
import {User} from './user';

export interface Friend {
  status: FriendStatus;
  friendId: string;
  requestorId: string;
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

export enum FriendStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}
