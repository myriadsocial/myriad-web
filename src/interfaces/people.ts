import { SocialsEnum } from './social';

export interface People {
  id: string;
  platform: SocialsEnum;
  username: string;
  platform_account_id: string;
  hide: boolean;
}
