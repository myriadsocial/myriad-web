import { User } from './user';

export interface Transaction {
  id: string;
  trxHash: string;
  from: string;
  to: string;
  value: number;
  state: string;
  createdAt: string;
  fromUser?: User;
  toUser?: User;
}
