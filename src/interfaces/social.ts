import {BaseModel} from './base.interface';
import {People} from './people';

export enum SocialsEnum {
  FACEBOOK = 'facebook',
  TWITTER = 'twitter',
  REDDIT = 'reddit',
  INSTAGRAM = 'instagram',
  WECHAT = 'wechat',
  FOURCHAN = '4chan',
  TELEGRAM = 'telegram',
  VK = 'vk',
  WEIBO = 'weibo',
}

export interface SocialMedia extends BaseModel {
  verified: boolean;
  platform: SocialsEnum;
  peopleId: string;
  userId: string;
  primary: boolean;

  people?: People;
}
