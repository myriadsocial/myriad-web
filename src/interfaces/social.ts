import {BaseModel} from './base.interface';

export enum SocialsEnum {
  FACEBOOK = 'facebook',
  TWITTER = 'twitter',
  REDDIT = 'reddit',
}

export interface SocialMedia extends BaseModel {
  verified: boolean;
  platform: SocialsEnum;
  peopleId: string;
  userId: string;
}
