import { User } from './user';

export interface Friend {
  status: string;
  friendId: string;
  requestorId: string;
}

export interface ExtendedFriend extends Friend {
  id: string;
  createdAt: Date;
  requestor: User;
  friend: User;
}

export enum FriendStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export interface FriendRequest {
  id: string;
  status: string;
  friendId: string;
  requestorId: string;
  createdAt: string;
}
