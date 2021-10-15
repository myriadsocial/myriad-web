import {BaseModel} from './base.interface';
import {Currency, CurrencyId} from './currency';
import {TransactionDetail} from './transaction';

export interface UserSocialMedia {
  id: string;
  verified: boolean;
  platform: string;
  peopleId: string;
  userId: string;
}

export type BaseUser = {
  name: string;
  profilePictureURL?: string;
  defaultCurrency: CurrencyId;
};

export type UserOnTransaction = BaseUser & {
  id: string;
};

export type UserProps = BaseUser & {
  bio?: string;
  bannerImageUrl?: string;
  fcmTokens?: string[];
  skipTour?: boolean;
  onTimeline?: string;
  skipWelcome?: boolean;
  websiteURL?: string;
  username?: string;
};

export interface User extends UserProps, BaseModel {
  currencies: Currency[];
}

export interface UserTransactionDetail {
  sent: TransactionDetail[];
  received: TransactionDetail[];
}

export interface ActivityLog {
  id: string;
  type: string;
  message: string;
  userId: string;
}

export enum ReportType {
  POST = 'post',
  USER = 'user',
  COMMENT = 'comment',
}

export enum CaseType {
  PORNOGRAPHY = 'pornography',
  CHILD = 'child',
  OTHER = 'other',
}

export enum ReportStatus {
  PENDING = 'pending',
  APPROVE = 'approve',
  OTHER = 'other',
}

export interface Report extends BaseModel {
  referenceType: ReportType;
  referenceId: string;
  type: CaseType;
  status: ReportStatus;
  reason: string;
  totalReported: number;
  reportedBy: string;
  postId: string;
  userId: string;
}
