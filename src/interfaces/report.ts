import {BaseModel} from './base.interface';
import {ReferenceType} from './interaction';

export enum ReportType {
  PORNOGRAPHY = 'pornography',
  CHILD = 'child',
  OTHER = 'other',
}

export enum ReportStatusType {
  PENDING = 'pending',
  APPROVED = 'approved',
}

export type ReportProps = {
  referenceType: ReferenceType;
  referenceId: string;
  type: ReportType;
  reason: string;
  reportedBy: string;
  userId: string;
  postId: string;
};

export interface Report extends ReportProps, BaseModel {
  status: ReportStatusType;
  totalReported: number;
}
