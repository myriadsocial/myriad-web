import {BaseModel} from './base.interface';
import {Currency} from './currency';
import {FriendStatus} from './friend';
import {NetworkIdEnum, Network, NetworkProps} from './network';
import {People} from './people';
import {TransactionDetail} from './transaction';

export interface UserSocialMedia {
  id: string;
  verified: boolean;
  platform: string;
  peopleId: string;
  userId: string;
  primary: boolean;
}

export type BaseUser = {
  name: string;
  profilePictureURL?: string;
};

export type UserOnTransaction = BaseUser & {
  id: string;
};

export interface Wallet extends BaseModel, NetworkProps {
  network?: Network;
  networkId: NetworkIdEnum;
  primary: boolean;
  userId: string;
}

export type UserWallet = Wallet & {
  user: User;
};

export type UserProps = BaseUser & {
  bio?: string;
  bannerImageURL?: string;
  fcmTokens: string[];
  onTimeline?: string;
  websiteURL?: string;
  username: string;
  verified: boolean;
  deletedAt?: string;
};

export type FriendStatusProps = {
  friendId: string;
  status: FriendStatus;
  requester: string;
  requestee: string;
};

export type UserMetric = {
  totalExperiences: number;
  totalFriends: number;
  totalKudos: number;
  totalPosts: number;
  totalActivity: number;
};

export interface Importer extends UserProps, BaseModel {}

export interface User extends UserProps, BaseModel {
  wallets: Wallet[];
  currencies: Currency[];
  people?: People[];
  metric?: UserMetric;
  deletedAt?: string;
  fullAccess?: boolean;
}

export interface UserTransactionDetail {
  sent: TransactionDetail[];
  received: TransactionDetail[];
}

export interface ActivityLog {
  id: string;
  type: ActivityLogType;
  message: string;
  userId: string;
}

export enum ActivityLogType {
  USERNAME = 'username',
  PROFILE = 'profile',
  SKIP = 'skip_new_user_username',
}
