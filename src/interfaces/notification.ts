import {User} from './user';

export interface Notification {
  type: string;
  from: string;
  to: string;
  message: string;
}

export interface ExtendedNotification extends Notification {
  id: string;
  createdAt: string;
  fromUserId: User;
  toUserId: User;
}
