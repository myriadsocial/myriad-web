import { User } from 'src/interfaces/user';

export interface Transaction {
  id?: string;
  trxHash: string;
  from: string;
  to: string;
  value: number;
  state: string;
  tokenId: string;
  postId: string;
  createdAt: string;
  fromUser?: User;
  toUser?: User;
}
