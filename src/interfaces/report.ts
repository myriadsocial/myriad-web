import {BaseModel} from './base.interface';
import {ReferenceType} from './interaction';

export enum ReportStatusType {
  PENDING = 'pending',
  REMOVED = 'removed',
  IGNORED = 'ignored',
  APPROVED = 'approved',
}

export enum PenaltyStatusType {
  BANNED = 'banned',
  PENALTY1 = 'penalty 1',
  PENALTY2 = 'penalty 2',
  PENALTY3 = 'penalty 3',
}

export type ReportProps = {
  referenceType: ReferenceType;
  referenceId: string;
  type: string;
  description: string;
};

export interface Report extends ReportProps, BaseModel {
  status: ReportStatusType;
  totalReported: number;
  reportedBy: string;
  userId: string;
  postId: string;
}
